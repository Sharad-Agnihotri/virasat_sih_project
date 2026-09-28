import 'package:flutter/material.dart';

import '../design/heritage_backdrop.dart';
import '../design/tokens.dart';

/// Home.
///
/// Carries one section for now: what Virasat is and why it matters to the
/// person holding the phone. The four beats map onto the platform's own
/// pillars — discovery, the AI guide, multilingual access, and community
/// participation — so the argument sets up the product rather than sitting
/// beside it.
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key, required this.onOpenPage});

  /// Opens a page of the web platform. Kept on the signature so sections
  /// added here can reach a feature that has not been ported yet.
  final void Function(String page, String title) onOpenPage;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>
    with SingleTickerProviderStateMixin {
  /// One timeline for the whole section, so the entrance reads as a single
  /// considered move rather than several widgets animating independently.
  late final AnimationController _c = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 2200),
  )..forward();

  Animation<double> _at(double begin, double end) => CurvedAnimation(
        parent: _c,
        curve: Interval(begin, end, curve: Curves.easeOutCubic),
      );

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return HeritageBackdrop(
      child: SafeArea(
        bottom: false,
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(
              parent: AlwaysScrollableScrollPhysics()),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: VSpace.gutter),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: VSpace.lg),
                _Reveal(animation: _at(0.00, 0.18), child: const _Masthead()),
                const SizedBox(height: VSpace.xxxl),
                _Reveal(
                  animation: _at(0.08, 0.28),
                  child: Text('WHY VIRASAT', style: VFont.eyebrow),
                ),
                const SizedBox(height: VSpace.md),
                _Reveal(
                  animation: _at(0.14, 0.36),
                  child: Text(
                    'One platform for\nIndia’s living heritage.',
                    style: VFont.serif(size: 31, weight: 600, height: 1.14),
                  ),
                ),
                const SizedBox(height: VSpace.lg),
                _Reveal(
                  animation: _at(0.20, 0.42),
                  child: Text(
                    'India’s monuments, traditions and crafts are extraordinary '
                    '— and scattered. Virasat brings heritage discovery, an AI '
                    'guide, monument scanning, regional languages, virtual tours '
                    'and community participation into a single place.',
                    style: VFont.sansStyle(
                        size: 15.5, height: 1.62, color: VColor.inkSoft),
                  ),
                ),
                const SizedBox(height: VSpace.xxl),
                for (final (i, point) in _points.indexed)
                  _Reveal(
                    animation: _at(0.30 + i * 0.10, 0.52 + i * 0.10),
                    child: _Point(
                      number: '0${i + 1}',
                      title: point.title,
                      body: point.body,
                      isLast: i == _points.length - 1,
                    ),
                  ),
                const SizedBox(height: VSpace.xxl),
                _Reveal(
                  animation: _at(0.74, 0.92),
                  child: const _Journey(),
                ),
                const SizedBox(height: VSpace.xxl),
                _Reveal(
                  animation: _at(0.82, 1.0),
                  child: const _VisionNote(),
                ),
                const SizedBox(height: VSpace.xxxl),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _AboutPoint {
  const _AboutPoint(this.title, this.body);
  final String title;
  final String body;
}

const _points = <_AboutPoint>[
  _AboutPoint(
    'Heritage information is scattered.',
    'Monuments, museums, festivals, crafts and local stories sit across '
        'signboards, brochures, portals and books. Virasat organises them by '
        'city, so one search shows you everything a place holds.',
  ),
  _AboutPoint(
    'A signboard cannot answer a question.',
    'Ask why a fort was built, who commissioned it, or why its architecture '
        'changed — and keep asking. The AI guide answers from a heritage '
        'knowledge base, and monument scanning identifies what your camera '
        'is pointed at.',
  ),
  _AboutPoint(
    'Language should not decide what you learn.',
    'Heritage explained in the language you think in, with the cultural '
        'meaning carried across rather than translated word for word.',
  ),
  _AboutPoint(
    'Preservation needs participation.',
    'Report damage or neglect at a site, contribute a story or photograph, '
        'and buy directly from the artisans keeping a craft alive — so '
        'heritage is documented and supported, not only visited.',
  ),
];

// ── Pieces ──────────────────────────────────────────────────────────────

class _Masthead extends StatelessWidget {
  const _Masthead();

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
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

/// A numbered beat. The rule under it carries the eye to the next one, so
/// the four read as one argument rather than four loose cards.
class _Point extends StatelessWidget {
  const _Point({
    required this.number,
    required this.title,
    required this.body,
    required this.isLast,
  });

  final String number;
  final String title;
  final String body;
  final bool isLast;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              width: 38,
              child: Text(
                number,
                style: VFont.sansStyle(
                  size: 12,
                  weight: 800,
                  color: VColor.terracotta,
                  letterSpacing: 1.2,
                  height: 1.9,
                ),
              ),
            ),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title,
                      style: VFont.serif(size: 19, weight: 600, height: 1.28)),
                  const SizedBox(height: VSpace.sm),
                  Text(body,
                      style: VFont.sansStyle(
                          size: 14.5, height: 1.6, color: VColor.inkSoft)),
                ],
              ),
            ),
          ],
        ),
        if (!isLast)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: VSpace.xl),
            child: Divider(height: 1),
          ),
      ],
    );
  }
}

/// The platform's arc, set as a single line of steps. It names what the app
/// actually does end to end without turning into a row of buttons.
class _Journey extends StatelessWidget {
  const _Journey();

  static const _steps = [
    'Discover',
    'Understand',
    'Experience',
    'Participate',
    'Preserve',
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('THE VIRASAT ARC', style: VFont.eyebrow),
        const SizedBox(height: VSpace.md),
        // A single scrolling line, not a Wrap: wrapping left an arrow
        // dangling at the end of a row, pointing at nothing.
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.only(right: VSpace.gutter),
          child: Row(
            children: [
              for (var i = 0; i < _steps.length; i++) ...[
                if (i > 0)
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: VSpace.sm),
                    child: Icon(Icons.arrow_forward_rounded,
                        size: 13, color: VColor.inkMuted.withOpacity(0.7)),
                  ),
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: VSpace.md, vertical: 7),
                  decoration: BoxDecoration(
                    color: VColor.surface,
                    borderRadius: BorderRadius.circular(VRadius.pill),
                    border: Border.all(color: VColor.hairline),
                  ),
                  child: Text(
                    _steps[i],
                    style: VFont.sansStyle(
                        size: 12.5, weight: 600, color: VColor.ink),
                  ),
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }
}

/// Closes on the project's own vision statement.
class _VisionNote extends StatelessWidget {
  const _VisionNote();

  @override
  Widget build(BuildContext context) {
    // IntrinsicHeight so the rule matches the quote however many lines it
    // wraps to, rather than a fixed height that falls short on a narrow phone.
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // A quote rule rather than a card: this is the closing word, not
          // another block competing with the four above it.
          Container(width: 2, color: VColor.terracotta),
          const SizedBox(width: VSpace.lg),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Making India’s heritage accessible, interactive, '
                  'multilingual and digitally preserved for the next generation.',
                  style: VFont.serif(size: 18, weight: 600, height: 1.42),
                ),
                const SizedBox(height: VSpace.sm),
                Text('VIRASAT AI', style: VFont.eyebrow),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Fade up — the one entrance motion the section uses throughout.
class _Reveal extends StatelessWidget {
  const _Reveal({required this.animation, required this.child});

  final Animation<double> animation;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: animation,
      builder: (_, inner) => Opacity(
        opacity: animation.value.clamp(0.0, 1.0),
        child: Transform.translate(
          offset: Offset(0, 22 * (1 - animation.value)),
          child: inner,
        ),
      ),
      child: child,
    );
  }
}
