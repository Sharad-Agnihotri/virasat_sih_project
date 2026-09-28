import 'package:flutter/material.dart';

import '../config.dart';
import 'tokens.dart';

/// A photograph served by the Virasat platform.
///
/// Always occupies exactly the box it is given — a loading, failed or
/// missing image reserves the same space as a loaded one, so nothing in the
/// layout shifts or spills while images arrive.
class RemoteImage extends StatelessWidget {
  const RemoteImage({
    super.key,
    required this.path,
    this.fit = BoxFit.cover,
    this.alignment = Alignment.center,
  });

  /// Server-relative path, e.g. `assets/images/remote/foo.jpg`.
  final String path;
  final BoxFit fit;
  final Alignment alignment;

  @override
  Widget build(BuildContext context) {
    if (path.isEmpty) return const _Placeholder();

    final url = path.startsWith('http')
        ? path
        : '${AppConfig.baseUrl}/${path.replaceFirst(RegExp(r'^/+'), '')}';

    return Image.network(
      url,
      fit: fit,
      alignment: alignment,
      width: double.infinity,
      height: double.infinity,
      gaplessPlayback: true,
      loadingBuilder: (_, child, progress) =>
          progress == null ? child : const _Placeholder(shimmer: true),
      errorBuilder: (_, __, ___) => const _Placeholder(),
    );
  }
}

class _Placeholder extends StatelessWidget {
  const _Placeholder({this.shimmer = false});
  final bool shimmer;

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: VColor.surfaceMuted,
      child: Center(
        child: Icon(
          shimmer
              ? Icons.image_outlined
              : Icons.photo_size_select_actual_outlined,
          size: 22,
          color: VColor.inkMuted.withOpacity(shimmer ? 0.35 : 0.22),
        ),
      ),
    );
  }
}
