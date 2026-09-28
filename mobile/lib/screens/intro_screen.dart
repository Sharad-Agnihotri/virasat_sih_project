import 'dart:async';

import 'package:flutter/material.dart';

import '../design/tokens.dart';

/// The entry experience, told as a story in three beats.
///
/// Each beat brings its own photograph, a headline that writes itself in a
/// word at a time, and one paragraph. The photograph never sits still — a
/// slow drift runs under the whole screen — which is what keeps the page
/// feeling alive rather than like a static slide.
///
/// Beats advance on their own, and a tap moves on early. Nothing here is a
/// dead end: the last beat opens the app.
class IntroScreen extends StatefulWidget {
  const IntroScreen({super.key, required this.onDone});

  final VoidCallback onDone;

  @override
  State<IntroScreen> createState() => _IntroScreenState();
}

class _Beat {
  const _Beat(this.image, this.headline, this.body);
  final String image;
  final String headline;
  final String body;
}

const _beats = <_Beat>[
  _Beat(
    'assets/heritage/taj.webp',
    'Every stone here remembers.',
    'India keeps more than three thousand six hundred monuments of national '
        'importance, and tens of thousands more that were never listed. Walk '
        'up to almost any one of them and you will find nobody to tell you '
        'what you are standing in front of.',
  ),
  _Beat(
    'assets/heritage/weaver.webp',
    'The story is still being written.',
    'In the lanes behind those walls, families have shaped the same craft for '
        'four hundred years. Most of what a traveller pays for it never '
        'reaches the hands that made it.',
  ),
  _Beat(
    'assets/heritage/mysore.webp',
    'So we built a companion.',
    'Point your camera and it knows the monument. It narrates in the language '
        'you think in, walks you through the rooms you cannot enter, and puts '
        'you in touch with the people still making its craft.',
  ),
];

class _IntroScreenState extends State<IntroScreen>
    with TickerProviderStateMixin {
  static const _beatReveal = Duration(milliseconds: 1500);
  static const _beatHold = Duration(milliseconds: 5200);

  /// Reveals the current beat's headline and body.
  late final AnimationController _reveal =
      AnimationController(vsync: this, duration: _beatReveal);

  /// A slow, endless drift across the photograph. Never resets between
  /// beats, so the motion reads as one continuous camera move.
  late final AnimationController _drift = AnimationController(
    vsync: this,
    duration: const Duration(seconds: 26),
  )..repeat(reverse: true);

  /// Fills across the current beat's dwell, so the reader can see how much
  /// of the story is left.
  late final AnimationController _progress =
      AnimationController(vsync: this, duration: _beatHold);

  int _index = 0;
  bool _leaving = false;
  Timer? _advance;

  @override
  void initState() {
    super.initState();
    _playBeat();
  }

  void _playBeat() {
    _reveal.forward(from: 0);
    _progress.forward(from: 0);
    _advance?.cancel();
    _advance = Timer(_beatHold, _next);
  }

  void _next() {
    if (_leaving) return;
    if (_index >= _beats.length - 1) {
      // The last beat holds; the reader chooses when to go in.
      _advance?.cancel();
      _progress.stop();
      return;
    }
    setState(() => _index++);
    _playBeat();
  }

  void _enter() {
    if (_leaving) return;
    _leaving = true;
    _advance?.cancel();
    widget.onDone();
  }

  @override
  void dispose() {
    _advance?.cancel();
    _reveal.dispose();
    _drift.dispose();
    _progress.dispose();
    super.dispose();
  }

  bool get _isLast => _index == _beats.length - 1;

  @override
  Widget build(BuildContext context) {
    final beat = _beats[_index];

    return Scaffold(
      body: GestureDetector(
        // Tapping anywhere moves the story on rather than skipping it.
        onTap: _isLast ? null : _next,
        behavior: HitTestBehavior.opaque,
        child: Stack(
          children: [
            Positioned.fill(
              child: _StoryBackdrop(image: beat.image, drift: _drift),
            ),
            SafeArea(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: VSpace.xl),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: VSpace.lg),
                    const _Masthead(),
                    const SizedBox(height: VSpace.xl),
                    _Progress(index: _index, fill: _progress),
                    Expanded(
                      child: LayoutBuilder(
                        builder: (context, box) => SingleChildScrollView(
                          physics: const ClampingScrollPhysics(),
                          child: ConstrainedBox(
                            constraints:
                                BoxConstraints(minHeight: box.maxHeight),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const SizedBox(height: VSpace.xxl),
                                // Keyed on the beat so each one animates in as a
                                // fresh widget instead of morphing the last.
                                _Headline(
                                  key: ValueKey('h$_index'),
                                  text: beat.headline,
                                  animation: _reveal,
                                ),
                                const SizedBox(height: VSpace.lg),
                                _Body(
                                  key: ValueKey('b$_index'),
                                  text: beat.body,
                                  animation: _reveal,
                                ),
                                const SizedBox(height: VSpace.xl),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                    _Footer(
                      isLast: _isLast,
                      onEnter: _enter,
                      onSkip: () {
                        setState(() => _index = _beats.length - 1);
                        _advance?.cancel();
                        _progress.value = 1.0;
                        _reveal.forward(from: 0);
                      },
                    ),
                    const SizedBox(height: VSpace.lg),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Backdrop ────────────────────────────────────────────────────────────

/// The canvas: warm white with the beat's photograph ghosted into it,
/// drifting slowly and cross-fading whenever the beat changes.
class _StoryBackdrop extends StatelessWidget {
  const _StoryBackdrop({required this.image, required this.drift});

  final String image;
  final Animation<double> drift;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: VColor.canvas,
      child: Stack(
        fit: StackFit.expand,
        children: [
          IgnorePointer(
            child: ShaderMask(
              blendMode: BlendMode.dstIn,
              shaderCallback: (rect) => const LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Colors.white, Colors.white, Colors.transparent],
                stops: [0.0, 0.34, 0.82],
              ).createShader(rect),
              child: AnimatedBuilder(
                animation: drift,
                builder: (_, child) {
                  final t = Curves.easeInOut.transform(drift.value);
                  return Transform.scale(
                    scale: 1.06 + 0.07 * t,
                    alignment: Alignment(0, -0.35 + 0.25 * t),
                    child: child,
                  );
                },
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 900),
                  switchInCurve: Curves.easeOut,
                  switchOutCurve: Curves.easeIn,
                  // SizedBox.expand: without it the switcher sizes to the
                  // photograph's own aspect and leaves hard edges instead of
                  // covering the screen.
                  child: SizedBox.expand(
                    key: ValueKey(image),
                    child: Opacity(
                      opacity: 0.085,
                      child: Image.asset(
                        image,
                        fit: BoxFit.cover,
                        alignment: Alignment.center,
                        errorBuilder: (_, __, ___) => const SizedBox.shrink(),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
          IgnorePointer(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    VColor.goldWash.withOpacity(0.5),
                    VColor.canvas.withOpacity(0.0),
                  ],
                  stops: const [0.0, 0.36],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ── Chrome ──────────────────────────────────────────────────────────────

/// The small mark with VIRASAT set in front of it, top-left.
class _Masthead extends StatelessWidget {
  const _Masthead();

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Image.asset(
          'assets/heritage/logo_ink.png',
          height: 30,
          filterQuality: FilterQuality.high,
          errorBuilder: (_, __, ___) => const SizedBox(height: 30),
        ),
        const SizedBox(width: VSpace.md),
        Text(
          'VIRASAT',
          style: VFont.sansStyle(
            size: 18,
            weight: 800,
            color: VColor.ink,
            letterSpacing: 2.8,
            height: 1.05,
          ),
        ),
      ],
    );
  }
}

/// One segment per beat. The live segment fills across its dwell; the ones
/// behind it stay full, so the bar reads as progress through a story.
class _Progress extends StatelessWidget {
  const _Progress({required this.index, required this.fill});

  final int index;
  final Animation<double> fill;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        for (var i = 0; i < _beats.length; i++) ...[
          if (i > 0) const SizedBox(width: VSpace.sm),
          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(VRadius.pill),
              child: SizedBox(
                height: 2.5,
                child: Stack(
                  children: [
                    const Positioned.fill(
                      child: ColoredBox(color: VColor.hairline),
                    ),
                    if (i < index)
                      const Positioned.fill(
                        child: ColoredBox(color: VColor.terracotta),
                      )
                    else if (i == index)
                      Positioned.fill(
                        child: AnimatedBuilder(
                          animation: fill,
                          builder: (_, __) => FractionallySizedBox(
                            alignment: Alignment.centerLeft,
                            widthFactor: fill.value,
                            child: const ColoredBox(color: VColor.terracotta),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ],
    );
  }
}

/// Skip while the story runs; the invitation once it has been told.
class _Footer extends StatelessWidget {
  const _Footer({
    required this.isLast,
    required this.onEnter,
    required this.onSkip,
  });

  final bool isLast;
  final VoidCallback onEnter;
  final VoidCallback onSkip;

  @override
  Widget build(BuildContext context) {
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 450),
      switchInCurve: Curves.easeOutCubic,
      transitionBuilder: (child, anim) => FadeTransition(
        opacity: anim,
        child: SizeTransition(
          sizeFactor: anim,
          axisAlignment: -1,
          child: child,
        ),
      ),
      child: isLast
          ? Column(
              key: const ValueKey('enter'),
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Virasat means inheritance.\nThis one belongs to everyone.',
                  style: VFont.serif(size: 18, weight: 600, height: 1.35),
                ),
                const SizedBox(height: VSpace.lg),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: onEnter,
                    child: const Text('Begin'),
                  ),
                ),
              ],
            )
          : Align(
              key: const ValueKey('skip'),
              alignment: Alignment.centerRight,
              child: TextButton(
                onPressed: onSkip,
                style: TextButton.styleFrom(
                  foregroundColor: VColor.inkMuted,
                  minimumSize: const Size(0, 44),
                ),
                child: Text('Skip',
                    style: VFont.sansStyle(
                        size: 13.5, weight: 600, color: VColor.inkMuted)),
              ),
            ),
    );
  }
}

// ── Story text ──────────────────────────────────────────────────────────

/// A headline that writes itself in a word at a time. Each word rises and
/// sharpens on its own short interval, so the line arrives with a cadence
/// instead of appearing all at once.
class _Headline extends StatelessWidget {
  const _Headline({super.key, required this.text, required this.animation});

  final String text;
  final Animation<double> animation;

  @override
  Widget build(BuildContext context) {
    final words = text.split(' ');
    // Words share the first 70% of the reveal, each overlapping the next so
    // the line flows rather than ticking.
    final step = 0.70 / words.length;

    return DefaultTextStyle(
      style: VFont.serif(size: 30, weight: 600, height: 1.18),
      child: Wrap(
        spacing: 0,
        children: [
          for (var i = 0; i < words.length; i++)
            AnimatedBuilder(
              animation: animation,
              builder: (_, child) {
                final t = Curves.easeOutCubic.transform(
                  Interval(i * step, (i * step + step * 2.2).clamp(0.0, 1.0))
                      .transform(animation.value),
                );
                return Opacity(
                  opacity: t,
                  child: Transform.translate(
                    offset: Offset(0, 16 * (1 - t)),
                    child: child,
                  ),
                );
              },
              child: Text('${words[i]} '),
            ),
        ],
      ),
    );
  }
}

/// The paragraph, rising in once the headline has landed.
class _Body extends StatelessWidget {
  const _Body({super.key, required this.text, required this.animation});

  final String text;
  final Animation<double> animation;

  @override
  Widget build(BuildContext context) {
    final curve = CurvedAnimation(
      parent: animation,
      curve: const Interval(0.45, 1.0, curve: Curves.easeOutCubic),
    );

    return AnimatedBuilder(
      animation: curve,
      builder: (_, child) => Opacity(
        opacity: curve.value,
        child: Transform.translate(
          offset: Offset(0, 20 * (1 - curve.value)),
          child: child,
        ),
      ),
      child: Text(
        text,
        style: VFont.sansStyle(size: 15.5, height: 1.62, color: VColor.inkSoft),
      ),
    );
  }
}
