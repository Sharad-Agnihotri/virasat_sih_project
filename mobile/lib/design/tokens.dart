import 'package:flutter/material.dart';

/// Virasat design tokens.
///
/// One source of truth for colour, type and spacing. Screens never hard-code
/// a hex value or a font size — they pull from here, so the whole product
/// can be re-tuned in one file.
///
/// The palette is a warm, paper-white base (heritage documents, marble,
/// limewash) with terracotta as the single action colour and gold reserved
/// for moments of ceremony — never for ordinary buttons.
class VColor {
  // ── Surfaces ──────────────────────────────────────────────────────────
  /// App canvas. Warm white, not pure #FFF — pure white reads clinical
  /// against the heritage photography.
  static const canvas = Color(0xFFFCFBF8);

  /// Cards and sheets sit *above* the canvas, so they are pure white.
  static const surface = Color(0xFFFFFFFF);

  /// Grouped rows, chips at rest, image placeholders.
  static const surfaceMuted = Color(0xFFF4F1EA);

  // ── Ink ───────────────────────────────────────────────────────────────
  static const ink = Color(0xFF1C1917); // headings, primary text
  static const inkSoft = Color(0xFF57534E); // body copy
  static const inkMuted = Color(0xFF8C857C); // captions, metadata
  static const hairline = Color(0xFFE7E2D8); // 1px dividers and borders

  // ── Accents ───────────────────────────────────────────────────────────
  /// The action colour: buttons, links, active states.
  static const terracotta = Color(0xFF9E4733);
  static const terracottaDark = Color(0xFF7F3626);
  static const terracottaWash = Color(0xFFF7EDE9);

  /// Ceremony only — verified badges, GI tags, premium marks.
  static const gold = Color(0xFFB5882D);
  static const goldWash = Color(0xFFFBF3E2);

  static const success = Color(0xFF2E7D5B);
  static const successWash = Color(0xFFE9F4EF);

  // ── Elevation ─────────────────────────────────────────────────────────
  /// Cards: a wide, very soft shadow reads as paper on paper. Two layers —
  /// a tight one for the edge, a broad one for the lift.
  static const List<BoxShadow> shadowCard = [
    BoxShadow(color: Color(0x0A1C1917), blurRadius: 2, offset: Offset(0, 1)),
    BoxShadow(color: Color(0x0F1C1917), blurRadius: 24, offset: Offset(0, 8)),
  ];

  static const List<BoxShadow> shadowLifted = [
    BoxShadow(color: Color(0x0D1C1917), blurRadius: 4, offset: Offset(0, 2)),
    BoxShadow(color: Color(0x1A1C1917), blurRadius: 40, offset: Offset(0, 16)),
  ];
}

/// An 8pt spacing scale. Using named steps instead of raw numbers keeps
/// rhythm consistent across screens built at different times.
class VSpace {
  static const xs = 4.0;
  static const sm = 8.0;
  static const md = 12.0;
  static const lg = 16.0;
  static const xl = 24.0;
  static const xxl = 32.0;
  static const xxxl = 48.0;

  /// Horizontal page gutter. Every screen uses this, nothing else.
  static const gutter = 20.0;
}

class VRadius {
  static const sm = 10.0;
  static const md = 16.0;
  static const lg = 22.0;
  static const xl = 28.0;
  static const pill = 999.0;
}

/// Both bundled families are variable fonts, so weight is applied through
/// [FontVariation] as well as [fontWeight] — `fontWeight` alone would render
/// every style at the file's default instance.
class VFont {
  static const display = 'Fraunces';
  static const sans = 'PlusJakartaSans';

  static List<FontVariation> _v(int wght, {double? soft, double? wonk}) => [
        FontVariation('wght', wght.toDouble()),
        if (soft != null) FontVariation('SOFT', soft),
        if (wonk != null) FontVariation('WONK', wonk),
      ];

  /// Editorial serif, for screen titles and monument names only.
  static TextStyle serif({
    required double size,
    int weight = 600,
    Color color = VColor.ink,
    double height = 1.15,
    double letterSpacing = -0.4,
  }) =>
      TextStyle(
        fontFamily: display,
        fontSize: size,
        height: height,
        color: color,
        letterSpacing: letterSpacing,
        fontWeight: FontWeight.w600,
        fontVariations: _v(weight, soft: 0, wonk: 1),
      );

  /// Everything else.
  static TextStyle sansStyle({
    required double size,
    int weight = 400,
    Color color = VColor.inkSoft,
    double height = 1.45,
    double letterSpacing = 0,
  }) =>
      TextStyle(
        fontFamily: sans,
        fontSize: size,
        height: height,
        color: color,
        letterSpacing: letterSpacing,
        fontVariations: _v(weight),
      );

  // ── Named roles ───────────────────────────────────────────────────────
  static TextStyle get displayLarge =>
      serif(size: 38, weight: 600, height: 1.08);
  static TextStyle get displayMedium =>
      serif(size: 30, weight: 600, height: 1.12);
  static TextStyle get title => serif(size: 22, weight: 600, height: 1.2);
  static TextStyle get cardTitle => sansStyle(
      size: 16,
      weight: 700,
      color: VColor.ink,
      height: 1.3,
      letterSpacing: -0.2);
  static TextStyle get body => sansStyle(size: 15, weight: 400, height: 1.55);
  static TextStyle get bodySmall =>
      sansStyle(size: 13.5, weight: 400, height: 1.5);
  static TextStyle get label =>
      sansStyle(size: 14, weight: 600, color: VColor.ink, letterSpacing: -0.1);
  static TextStyle get caption =>
      sansStyle(size: 12.5, weight: 500, color: VColor.inkMuted, height: 1.35);

  /// Small caps-ish eyebrow above section titles.
  static TextStyle get eyebrow => sansStyle(
        size: 11,
        weight: 700,
        color: VColor.terracotta,
        letterSpacing: 1.6,
        height: 1.2,
      );
}
