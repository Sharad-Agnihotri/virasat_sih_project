import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';

import '../data/api.dart';
import '../data/city.dart';
import '../design/heritage_backdrop.dart';
import '../design/tokens.dart';
import 'ask_sheet.dart';
import 'city_screen.dart';

/// Scan a monument: take or choose a photograph, and the vision model names
/// what is in it.
///
/// The flow is deliberately three states and no more — invite, working,
/// result — so there is never a moment where the visitor cannot tell what
/// the app is doing.
class ScanScreen extends StatefulWidget {
  const ScanScreen({super.key});

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

enum _Stage { idle, working, done }

class _ScanScreenState extends State<ScanScreen> {
  _Stage _stage = _Stage.idle;
  File? _photo;
  IdentifyResult? _result;
  String _step = '';

  Future<void> _pick(ImageSource source) async {
    if (source == ImageSource.camera) {
      final granted = await Permission.camera.request();
      if (!granted.isGranted) {
        if (mounted) _toast('Camera permission is needed to scan.');
        return;
      }
    }

    final picked = await ImagePicker().pickImage(
      source: source,
      // Enough detail for the model, small enough to upload over a phone
      // connection in a couple of seconds.
      maxWidth: 1400,
      maxHeight: 1400,
      imageQuality: 85,
    );
    if (picked == null || !mounted) return;

    final file = File(picked.path);
    setState(() {
      _photo = file;
      _stage = _Stage.working;
      _result = null;
      _step = 'Preparing the photograph…';
    });

    final bytes = await file.readAsBytes();
    if (!mounted) return;
    setState(() => _step = 'Looking at the architecture…');

    final result = await Api.identify(base64Encode(bytes));
    if (!mounted) return;
    setState(() {
      _result = result;
      _stage = _Stage.done;
    });
  }

  void _reset() => setState(() {
        _stage = _Stage.idle;
        _photo = null;
        _result = null;
      });

  void _toast(String message) => ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(message), behavior: SnackBarBehavior.floating),
      );

  @override
  Widget build(BuildContext context) {
    return HeritageBackdrop(
      child: SafeArea(
        bottom: false,
        child: switch (_stage) {
          _Stage.idle => _Invite(onPick: _pick),
          _Stage.working => _Working(photo: _photo, step: _step),
          _Stage.done => _Result(
              photo: _photo,
              result: _result!,
              onRetry: _reset,
              onPick: _pick,
            ),
        },
      ),
    );
  }
}

// ── Idle ────────────────────────────────────────────────────────────────

class _Invite extends StatelessWidget {
  const _Invite({required this.onPick});
  final Future<void> Function(ImageSource) onPick;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(
          VSpace.gutter, VSpace.lg, VSpace.gutter, VSpace.xxxl),
      children: [
        Text('SCAN A MONUMENT', style: VFont.eyebrow),
        const SizedBox(height: VSpace.sm),
        Text('Point it at\nsomething old.',
            style: VFont.serif(size: 29, weight: 600, height: 1.14)),
        const SizedBox(height: VSpace.md),
        Text(
          'A photograph is enough. Virasat names the monument, dates it, and '
          'tells you who built it.',
          style: VFont.sansStyle(size: 15, height: 1.6),
        ),
        const SizedBox(height: VSpace.xl),
        // A framed target rather than a plain button: it tells you what kind
        // of photograph the model wants before you take one.
        AspectRatio(
          aspectRatio: 4 / 3,
          child: CustomPaint(
            painter: _FramePainter(),
            child: Center(
              child: Icon(Icons.center_focus_weak_rounded,
                  size: 46, color: VColor.inkMuted.withOpacity(0.4)),
            ),
          ),
        ),
        const SizedBox(height: VSpace.xl),
        SizedBox(
          width: double.infinity,
          child: FilledButton.icon(
            onPressed: () => onPick(ImageSource.camera),
            icon: const Icon(Icons.photo_camera_rounded, size: 19),
            label: const Text('Take a photo'),
          ),
        ),
        const SizedBox(height: VSpace.md),
        SizedBox(
          width: double.infinity,
          child: OutlinedButton.icon(
            onPressed: () => onPick(ImageSource.gallery),
            icon: const Icon(Icons.photo_library_outlined, size: 19),
            label: const Text('Choose from gallery'),
          ),
        ),
        const SizedBox(height: VSpace.xl),
        Text(
          'Works best on the whole structure, in daylight, without heavy '
          'crowds in front of it.',
          style: VFont.caption,
        ),
      ],
    );
  }
}

/// Corner brackets — the same visual language as a camera viewfinder.
class _FramePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = VColor.hairline
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;
    const arm = 26.0;
    const r = 14.0;

    void corner(Offset o, double dx, double dy) {
      final path = Path()
        ..moveTo(o.dx + dx * arm, o.dy)
        ..lineTo(o.dx + dx * r, o.dy)
        ..quadraticBezierTo(o.dx, o.dy, o.dx, o.dy + dy * r)
        ..lineTo(o.dx, o.dy + dy * arm);
      canvas.drawPath(path, paint);
    }

    corner(Offset.zero, 1, 1);
    corner(Offset(size.width, 0), -1, 1);
    corner(Offset(0, size.height), 1, -1);
    corner(Offset(size.width, size.height), -1, -1);
  }

  @override
  bool shouldRepaint(_FramePainter oldDelegate) => false;
}

// ── Working ─────────────────────────────────────────────────────────────

class _Working extends StatelessWidget {
  const _Working({required this.photo, required this.step});
  final File? photo;
  final String step;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: VSpace.gutter),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const SizedBox(height: VSpace.xl),
          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(VRadius.lg),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  if (photo != null) Image.file(photo!, fit: BoxFit.cover),
                  const ColoredBox(color: Color(0x59FFFFFF)),
                  const Center(child: _Scanner()),
                ],
              ),
            ),
          ),
          const SizedBox(height: VSpace.xl),
          Row(
            children: [
              const SizedBox(
                width: 16,
                height: 16,
                child: CircularProgressIndicator(strokeWidth: 2),
              ),
              const SizedBox(width: VSpace.md),
              Expanded(
                child: Text(step,
                    style: VFont.sansStyle(
                        size: 14.5, weight: 600, color: VColor.ink)),
              ),
            ],
          ),
          const SizedBox(height: VSpace.sm),
          Text('This usually takes a few seconds.', style: VFont.caption),
          const SizedBox(height: VSpace.xxl),
        ],
      ),
    );
  }
}

/// A line that sweeps the photograph while the model reads it.
class _Scanner extends StatefulWidget {
  const _Scanner();
  @override
  State<_Scanner> createState() => _ScannerState();
}

class _ScannerState extends State<_Scanner>
    with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1900),
  )..repeat(reverse: true);

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _c,
      builder: (_, __) => Align(
        alignment:
            Alignment(0, -0.85 + 1.7 * Curves.easeInOut.transform(_c.value)),
        child: Container(
          height: 2.5,
          margin: const EdgeInsets.symmetric(horizontal: VSpace.xl),
          decoration: BoxDecoration(
            gradient: const LinearGradient(colors: [
              Colors.transparent,
              VColor.terracotta,
              Colors.transparent,
            ]),
            boxShadow: [
              BoxShadow(
                  color: VColor.terracotta.withOpacity(0.4), blurRadius: 12),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Result ──────────────────────────────────────────────────────────────

class _Result extends StatelessWidget {
  const _Result({
    required this.photo,
    required this.result,
    required this.onRetry,
    required this.onPick,
  });

  final File? photo;
  final IdentifyResult result;
  final VoidCallback onRetry;
  final Future<void> Function(ImageSource) onPick;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(
          VSpace.gutter, VSpace.lg, VSpace.gutter, VSpace.xxxl),
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(VRadius.lg),
          child: AspectRatio(
            aspectRatio: 4 / 3,
            child: photo == null
                ? const ColoredBox(color: VColor.surfaceMuted)
                : Image.file(photo!, fit: BoxFit.cover),
          ),
        ),
        const SizedBox(height: VSpace.xl),
        if (result.failed)
          _Failed(message: result.error!, onRetry: onRetry)
        else if (!result.identified)
          _Unsure(result: result, onRetry: onRetry)
        else
          _Identified(result: result),
        const SizedBox(height: VSpace.xl),
        SizedBox(
          width: double.infinity,
          child: OutlinedButton.icon(
            onPressed: onRetry,
            icon: const Icon(Icons.refresh_rounded, size: 18),
            label: const Text('Scan something else'),
          ),
        ),
      ],
    );
  }
}

class _Identified extends StatelessWidget {
  const _Identified({required this.result});
  final IdentifyResult result;

  @override
  Widget build(BuildContext context) {
    final place = [result.city, result.state, result.country]
        .where((s) => s.isNotEmpty)
        .join(' · ');

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _Confidence(value: result.confidence),
        const SizedBox(height: VSpace.md),
        Text(result.monument,
            style: VFont.serif(size: 28, weight: 600, height: 1.15)),
        if (place.isNotEmpty) ...[
          const SizedBox(height: VSpace.xs),
          Text(place, style: VFont.caption),
        ],
        const SizedBox(height: VSpace.lg),
        if (result.summary.isNotEmpty)
          Text(result.summary, style: VFont.sansStyle(size: 15, height: 1.62)),
        const SizedBox(height: VSpace.lg),
        VCard(
          child: Column(
            children: [
              if (result.builtBy.isNotEmpty)
                _Fact(label: 'Built by', value: result.builtBy),
              if (result.builtBy.isNotEmpty && result.era.isNotEmpty)
                const Divider(height: VSpace.xl),
              if (result.era.isNotEmpty) _Fact(label: 'Era', value: result.era),
            ],
          ),
        ),
        const SizedBox(height: VSpace.lg),
        _NextSteps(result: result),
      ],
    );
  }
}

/// Where the visitor goes from a result. This is the whole point of the
/// feature: a name is a dead end, a city and a guide are not.
class _NextSteps extends StatelessWidget {
  const _NextSteps({required this.result});
  final IdentifyResult result;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        FutureBuilder<List<City>>(
          future: CityRepository.load(),
          builder: (context, snap) {
            final cities = snap.data;
            if (cities == null) return const SizedBox.shrink();
            final match = _match(cities, result);
            if (match == null) return const SizedBox.shrink();
            return Padding(
              padding: const EdgeInsets.only(bottom: VSpace.md),
              child: FilledButton.icon(
                onPressed: () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => CityScreen(city: match)),
                ),
                icon: const Icon(Icons.explore_outlined, size: 19),
                label: Text('Explore ${match.name}'),
              ),
            );
          },
        ),
        OutlinedButton.icon(
          onPressed: () => AskSheet.open(
            context,
            about: 'The visitor has just scanned ${result.monument}'
                '${result.city.isEmpty ? '' : ' in ${result.city}'}. '
                'Answer their questions about it.',
            opener: 'Ask me anything about ${result.monument}.',
          ),
          icon: const Icon(Icons.chat_bubble_outline_rounded, size: 18),
          label: const Text('Ask the guide about it'),
        ),
      ],
    );
  }

  /// Match the model's city against the documented ones, by city name first
  /// and state second, so "Agra" lands on Agra and "Jaipur, Rajasthan" does
  /// not land on Jodhpur.
  static City? _match(List<City> cities, IdentifyResult r) {
    final city = r.city.toLowerCase().trim();
    if (city.isEmpty) return null;
    for (final c in cities) {
      final name = c.name.toLowerCase();
      if (name == city || name.startsWith('$city ') || name.contains(city)) {
        return c;
      }
    }
    for (final c in cities) {
      if (c.places.any((p) =>
          p.name.toLowerCase().contains(r.monument.toLowerCase().trim()) &&
          r.monument.trim().isNotEmpty)) {
        return c;
      }
    }
    return null;
  }
}

class _Confidence extends StatelessWidget {
  const _Confidence({required this.value});
  final int value;

  @override
  Widget build(BuildContext context) {
    final sure = value >= 75;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: VSpace.md, vertical: 6),
      decoration: BoxDecoration(
        color: sure ? VColor.successWash : VColor.goldWash,
        borderRadius: BorderRadius.circular(VRadius.pill),
      ),
      child: Text(
        sure ? 'IDENTIFIED · $value%' : 'PROBABLE MATCH · $value%',
        style: VFont.sansStyle(
          size: 10,
          weight: 800,
          color: sure ? VColor.success : VColor.gold,
          letterSpacing: 1.2,
        ),
      ),
    );
  }
}

class _Fact extends StatelessWidget {
  const _Fact({required this.label, required this.value});
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 74,
          child: Text(label,
              style: VFont.sansStyle(size: 12.5, color: VColor.inkMuted)),
        ),
        const SizedBox(width: VSpace.md),
        Expanded(
          child: Text(value,
              style: VFont.sansStyle(
                  size: 14.5, weight: 600, color: VColor.ink, height: 1.45)),
        ),
      ],
    );
  }
}

class _Unsure extends StatelessWidget {
  const _Unsure({required this.result, required this.onRetry});
  final IdentifyResult result;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Not sure about this one',
            style: VFont.serif(size: 24, weight: 600)),
        const SizedBox(height: VSpace.sm),
        Text(
          result.summary.isNotEmpty
              ? result.summary
              : 'The photograph does not show a monument clearly enough to '
                  'name it.',
          style: VFont.sansStyle(size: 15, height: 1.6),
        ),
        if (result.alternatives.isNotEmpty) ...[
          const SizedBox(height: VSpace.lg),
          Text('IT MIGHT BE', style: VFont.eyebrow),
          const SizedBox(height: VSpace.sm),
          for (final a in result.alternatives)
            Padding(
              padding: const EdgeInsets.only(bottom: VSpace.xs),
              child:
                  Text('— $a', style: VFont.sansStyle(size: 14.5, height: 1.5)),
            ),
        ],
        const SizedBox(height: VSpace.lg),
        Text(
          'Try the whole structure in frame, in daylight, from the front.',
          style: VFont.caption,
        ),
      ],
    );
  }
}

class _Failed extends StatelessWidget {
  const _Failed({required this.message, required this.onRetry});
  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Icon(Icons.cloud_off_rounded, size: 30, color: VColor.terracotta),
        const SizedBox(height: VSpace.md),
        Text('Could not scan', style: VFont.serif(size: 24, weight: 600)),
        const SizedBox(height: VSpace.sm),
        Text(message, style: VFont.sansStyle(size: 14.5, height: 1.6)),
      ],
    );
  }
}
