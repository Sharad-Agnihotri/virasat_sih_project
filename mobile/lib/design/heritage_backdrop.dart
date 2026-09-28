import 'package:flutter/material.dart';

import 'tokens.dart';

/// The app's canvas: warm white with a heritage photograph ghosted into it.
///
/// The image sits at a few percent opacity and is masked so it fades out
/// before it reaches the content — it should register as texture, never as
/// a picture competing with the text on top of it. Every screen is built
/// inside one of these, which is what makes the product feel like a single
/// surface rather than a stack of pages.
class HeritageBackdrop extends StatelessWidget {
  const HeritageBackdrop({
    super.key,
    required this.child,
    this.image = 'assets/heritage/backdrop.webp',
    this.opacity = 0.055,
    this.alignment = Alignment.topCenter,
    this.showWash = true,
  });

  final Widget child;
  final String image;
  final double opacity;
  final Alignment alignment;

  /// A faint warm gradient at the top, so the status-bar area has a little
  /// colour instead of reading as a flat slab.
  final bool showWash;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: VColor.canvas,
      child: Stack(
        children: [
          // Ghosted architecture.
          Positioned.fill(
            child: IgnorePointer(
              child: ShaderMask(
                blendMode: BlendMode.dstIn,
                shaderCallback: (rect) => const LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [Colors.white, Colors.white, Colors.transparent],
                  stops: [0.0, 0.32, 0.78],
                ).createShader(rect),
                child: Opacity(
                  opacity: opacity,
                  child: Image.asset(
                    image,
                    fit: BoxFit.cover,
                    alignment: alignment,
                    // The backdrop is decorative: if it is missing, the
                    // screen must still render.
                    errorBuilder: (_, __, ___) => const SizedBox.shrink(),
                  ),
                ),
              ),
            ),
          ),
          if (showWash)
            Positioned.fill(
              child: IgnorePointer(
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        VColor.goldWash.withOpacity(0.55),
                        VColor.canvas.withOpacity(0.0),
                      ],
                      stops: const [0.0, 0.34],
                    ),
                  ),
                ),
              ),
            ),
          child,
        ],
      ),
    );
  }
}

/// A white card on the canvas. The single container used across the app so
/// corner radius, border and shadow never drift between screens.
class VCard extends StatelessWidget {
  const VCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(VSpace.lg),
    this.onTap,
    this.radius = VRadius.lg,
    this.lifted = false,
    this.clip = false,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final VoidCallback? onTap;
  final double radius;
  final bool lifted;

  /// Set when the card's content reaches its edges (an image header).
  final bool clip;

  @override
  Widget build(BuildContext context) {
    final shape = BorderRadius.circular(radius);
    final body = Padding(padding: padding, child: child);

    return DecoratedBox(
      decoration: BoxDecoration(
        color: VColor.surface,
        borderRadius: shape,
        border: Border.all(color: VColor.hairline, width: 1),
        boxShadow: lifted ? VColor.shadowLifted : VColor.shadowCard,
      ),
      child: Material(
        type: MaterialType.transparency,
        child: InkWell(
          onTap: onTap,
          borderRadius: shape,
          splashColor: VColor.terracottaWash,
          highlightColor: VColor.terracottaWash.withOpacity(0.5),
          child: clip ? ClipRRect(borderRadius: shape, child: body) : body,
        ),
      ),
    );
  }
}

/// Eyebrow + title, the standard way a section opens.
class VSectionHeader extends StatelessWidget {
  const VSectionHeader({
    super.key,
    required this.title,
    this.eyebrow,
    this.action,
    this.onAction,
  });

  final String title;
  final String? eyebrow;
  final String? action;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // The action sits on the eyebrow line, not beside the title: a title
        // that wraps to two lines would otherwise crowd or displace it.
        Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            if (eyebrow != null)
              Expanded(
                  child: Text(eyebrow!.toUpperCase(), style: VFont.eyebrow))
            else
              const Spacer(),
            if (action != null)
              GestureDetector(
                onTap: onAction,
                behavior: HitTestBehavior.opaque,
                child: Padding(
                  padding: const EdgeInsets.only(left: VSpace.md, bottom: 2),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(action!,
                          style: VFont.sansStyle(
                              size: 13, weight: 700, color: VColor.terracotta)),
                      const SizedBox(width: 2),
                      const Icon(Icons.chevron_right_rounded,
                          size: 16, color: VColor.terracotta),
                    ],
                  ),
                ),
              ),
          ],
        ),
        SizedBox(height: eyebrow != null ? VSpace.sm : 0),
        Text(title, style: VFont.title),
      ],
    );
  }
}
