import 'dart:io';

import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:webview_flutter_android/webview_flutter_android.dart';

import 'config.dart';
import 'native_bridge.dart';
import 'speech_polyfill.dart';

/// Hosts one page of the Virasat platform.
///
/// Each tab keeps its own controller so switching tabs doesn't reload the
/// page (the VR explorer and the map are expensive to boot). Camera + mic
/// requests from the page (scan, voice guide) are granted after the OS
/// permission prompt.
class WebScreen extends StatefulWidget {
  const WebScreen({super.key, required this.page, this.showBack = false});
  final String page;
  final bool showBack;

  @override
  State<WebScreen> createState() => WebScreenState();
}

class WebScreenState extends State<WebScreen>
    with AutomaticKeepAliveClientMixin {
  late final WebViewController _controller;
  late final NativeBridge _bridge;
  double _progress = 0;
  String? _error;

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController();
    _bridge = NativeBridge(_controller);
    _controller
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFFFCFBF8))
      ..setUserAgent(
        'Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36 '
        '(KHTML, like Gecko) Chrome/124 Mobile Safari/537.36 VirasatApp/1.0',
      )
      ..addJavaScriptChannel('VirasatNative',
          onMessageReceived: (m) => _bridge.onMessage(m.message))
      ..setNavigationDelegate(NavigationDelegate(
        onProgress: (p) => setState(() => _progress = p / 100),
        onPageStarted: (_) {
          setState(() => _error = null);
          // Install the speech shim before the page's own scripts look for it.
          _controller.runJavaScript(kSpeechPolyfillJs);
        },
        onPageFinished: (_) => _controller.runJavaScript(kSpeechPolyfillJs),
        onWebResourceError: (e) {
          if (e.isForMainFrame ?? true) {
            setState(() => _error = e.description);
          }
        },
        onNavigationRequest: (req) {
          // Keep the platform in-app; hand everything else to the OS.
          final u = Uri.parse(req.url);
          final base = Uri.parse(AppConfig.baseUrl);
          if (u.host == base.host ||
              u.scheme == 'about' ||
              u.scheme == 'blob') {
            return NavigationDecision.navigate;
          }
          return NavigationDecision.prevent;
        },
      ));

    final platform = _controller.platform;
    if (platform is AndroidWebViewController) {
      AndroidWebViewController.enableDebugging(false);
      platform
        ..setMediaPlaybackRequiresUserGesture(false)
        ..setOnPlatformPermissionRequest(_onPermission)
        ..setOnShowFileSelector(_onFileSelector);
    }

    _controller.loadRequest(AppConfig.page(widget.page));
  }

  /// Web page asked for camera/mic → ask the OS once, then grant.
  Future<void> _onPermission(PlatformWebViewPermissionRequest req) async {
    final wants = <Permission>[];
    if (req.types.contains(WebViewPermissionResourceType.camera)) {
      wants.add(Permission.camera);
    }
    if (req.types.contains(WebViewPermissionResourceType.microphone)) {
      wants.add(Permission.microphone);
    }
    if (wants.isEmpty) return req.grant();
    final results = await wants.request();
    final ok = results.values.every((s) => s.isGranted);
    ok ? await req.grant() : await req.deny();
  }

  /// `<input type="file">` on the scan page.
  Future<List<String>> _onFileSelector(FileSelectorParams params) async {
    if (!mounted) return const <String>[];
    return NativeBridge.pickImage(context);
  }

  Future<bool> goBackIfPossible() async {
    if (await _controller.canGoBack()) {
      await _controller.goBack();
      return true;
    }
    return false;
  }

  void reload() => _controller.reload();

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return Stack(
      children: [
        if (_error == null)
          WebViewWidget(controller: _controller)
        else
          _ErrorView(
            message: _error!,
            onRetry: () => _controller.loadRequest(AppConfig.page(widget.page)),
          ),
        if (_progress < 1)
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: LinearProgressIndicator(
              value: _progress,
              minHeight: 2,
              backgroundColor: Colors.transparent,
              color: const Color(0xFF9E4733),
            ),
          ),
      ],
    );
  }
}

class _ErrorView extends StatelessWidget {
  const _ErrorView({required this.message, required this.onRetry});
  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFFFCFBF8),
      padding: const EdgeInsets.all(28),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.cloud_off_rounded,
              size: 52, color: Color(0xFF9E4733)),
          const SizedBox(height: 16),
          const Text('Can\'t reach Virasat',
              style: TextStyle(
                  color: Color(0xFF1C1917),
                  fontSize: 20,
                  fontWeight: FontWeight.w700)),
          const SizedBox(height: 8),
          Text(
            Platform.isAndroid
                ? 'Make sure the server (node static_server.js) and the tunnel are running.\n\n$message'
                : message,
            textAlign: TextAlign.center,
            style: const TextStyle(
                color: Color(0xFF57534E), fontSize: 13, height: 1.5),
          ),
          const SizedBox(height: 20),
          FilledButton.icon(
            onPressed: onRetry,
            icon: const Icon(Icons.refresh_rounded),
            label: const Text('Retry'),
          ),
        ],
      ),
    );
  }
}
