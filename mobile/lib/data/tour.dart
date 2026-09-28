import 'dart:convert';

import 'api.dart';
import 'city.dart';

/// A language the guide can speak in.
///
/// [ttsLocale] is what Android's speech engine wants; [name] is what the
/// visitor picks from. Availability is checked at runtime, because a phone
/// only has voice data for the languages its owner has installed.
class TourLanguage {
  const TourLanguage(this.code, this.name, this.englishName, this.ttsLocale);

  final String code;
  final String name;
  final String englishName;
  final String ttsLocale;

  static const english = TourLanguage('en', 'English', 'English', 'en-IN');

  static const all = <TourLanguage>[
    english,
    TourLanguage('hi', 'हिन्दी', 'Hindi', 'hi-IN'),
    TourLanguage('bn', 'বাংলা', 'Bengali', 'bn-IN'),
    TourLanguage('mr', 'मराठी', 'Marathi', 'mr-IN'),
    TourLanguage('ta', 'தமிழ்', 'Tamil', 'ta-IN'),
    TourLanguage('te', 'తెలుగు', 'Telugu', 'te-IN'),
    TourLanguage('kn', 'ಕನ್ನಡ', 'Kannada', 'kn-IN'),
    TourLanguage('ml', 'മലയാളം', 'Malayalam', 'ml-IN'),
    TourLanguage('gu', 'ગુજરાતી', 'Gujarati', 'gu-IN'),
    TourLanguage('pa', 'ਪੰਜਾਬੀ', 'Punjabi', 'pa-IN'),
    TourLanguage('ur', 'اردو', 'Urdu', 'ur-IN'),
  ];
}

/// One thing the guide stops to talk about.
class TourStop {
  const TourStop({
    required this.title,
    required this.script,
    required this.kind,
    this.image = '',
  });

  final String title;
  final String script;
  final TourStopKind kind;
  final String image;

  TourStop withScript(String s) =>
      TourStop(title: title, script: s, kind: kind, image: image);
}

enum TourStopKind { welcome, place, craft, food, festival, farewell }

/// Builds the walking-tour script for a city, then translates it.
///
/// The English script is written from the bundled data, so it is free and
/// instant. Only the translation costs a round trip, and only once per
/// language per city.
class TourScript {
  static final Map<String, List<TourStop>> _cache = {};

  static String _key(String cityId, String lang) => '$cityId::$lang';

  /// The stops, in the language asked for. Falls back to English if the
  /// translation fails, so the tour always plays.
  static Future<TourResult> build(City city, TourLanguage language) async {
    final cached = _cache[_key(city.id, language.code)];
    if (cached != null) return TourResult(cached, null);

    final english = _english(city);
    if (language.code == 'en') {
      _cache[_key(city.id, 'en')] = english;
      return TourResult(english, null);
    }

    final translated = await _translate(english, language, city);
    if (translated == null) {
      return TourResult(
          english,
          'Could not translate the tour — playing it '
          'in English instead.');
    }
    _cache[_key(city.id, language.code)] = translated;
    return TourResult(translated, null);
  }

  // ── The English script ────────────────────────────────────────────────
  //
  // Written the way a guide actually speaks: second person, present tense,
  // pointing at what is in front of you — not encyclopedia prose read out.
  static List<TourStop> _english(City city) {
    final stops = <TourStop>[];

    stops.add(TourStop(
      kind: TourStopKind.welcome,
      title: 'Welcome to ${city.name}',
      image: city.heroImage ?? '',
      script: 'Welcome to ${city.name}, in ${city.state}. '
          '${_spoken(city.shortDesc)}. '
          '${_firstSentences(city.historyStory, 3)} '
          'Walk with me — I will show you what most visitors walk straight '
          'past.',
    ));

    for (final p in city.places) {
      stops.add(TourStop(
        kind: TourStopKind.place,
        title: p.name,
        image: p.image,
        script: 'We are standing at ${p.name}. ${p.desc} '
            'Take a moment with it before we move on.',
      ));
    }

    for (final c in city.crafts) {
      stops.add(TourStop(
        kind: TourStopKind.craft,
        title: c.name,
        image: c.image,
        script: 'Now, the craft this city is known for: ${c.name}. ${c.desc} '
            '${c.story} '
            'If you buy one piece here, buy it from the person who made it.',
      ));
    }

    for (final f in city.food) {
      stops.add(TourStop(
        kind: TourStopKind.food,
        title: f.name,
        image: f.image,
        script: 'You cannot leave ${city.name} without eating ${f.name}. '
            '${f.desc} ${f.story}',
      ));
    }

    for (final f in city.festivals) {
      stops.add(TourStop(
        kind: TourStopKind.festival,
        title: f.name,
        script: 'If you come back in ${f.month}, come for ${f.name}. '
            '${f.desc}',
      ));
    }

    stops.add(TourStop(
      kind: TourStopKind.farewell,
      title: 'Before you go',
      script: 'That is ${city.name} — or as much of it as one walk allows. '
          'What you have seen is still lived in, still made by hand, and '
          'still standing because people keep turning up. Thank you for '
          'walking it with me.',
    ));

    return stops;
  }

  /// Tagline punctuation is written for the eye, not the ear: an em dash
  /// read aloud is a stumble, and a naive swap leaves " , " behind.
  static String _spoken(String text) => text
      .replaceAll(RegExp(r'\s*—\s*'), ', ')
      // replaceAll takes a literal replacement in Dart, so a capture group
      // needs replaceAllMapped or it inserts the text "$1".
      .replaceAllMapped(RegExp(r'\s+([,.])'), (m) => m[1]!)
      .replaceAll(RegExp(r'[,.]\s*$'), '')
      .trim();

  static String _firstSentences(String text, int n) {
    final parts = text.split(RegExp(r'(?<=[.!?])\s+'));
    return parts.take(n).join(' ').trim();
  }

  // ── Translation ───────────────────────────────────────────────────────
  static Future<List<TourStop>?> _translate(
    List<TourStop> stops,
    TourLanguage language,
    City city,
  ) async {
    final payload = jsonEncode([
      for (var i = 0; i < stops.length; i++)
        {'i': i, 'title': stops[i].title, 'script': stops[i].script}
    ]);

    final instruction =
        'You are translating a spoken walking tour of ${city.name}, India, '
        'into ${language.englishName}. This will be read aloud by a voice, '
        'so it must sound like a person speaking, not a document.\n\n'
        'Rules:\n'
        '- Translate both "title" and "script" for every item.\n'
        '- Keep proper nouns (monuments, dynasties, dishes, crafts, people) '
        'in their usual form for a ${language.englishName} speaker; do not '
        'invent new names.\n'
        '- Carry the meaning and warmth across; do not translate word for '
        'word.\n'
        '- No markdown, no numbering, no notes.\n'
        '- Return ONLY a JSON array of objects with keys "i", "title" and '
        '"script", the same length and order as the input.\n\n'
        'Input:\n$payload';

    final result = await Api.chat(
      [ChatMessage(text: instruction, fromUser: true)],
    );
    if (result.failed || result.text == null) return null;

    try {
      final raw = result.text!;
      // Models like to wrap JSON in a fence; take the array itself.
      final start = raw.indexOf('[');
      final end = raw.lastIndexOf(']');
      if (start < 0 || end <= start) return null;
      final list = jsonDecode(raw.substring(start, end + 1)) as List;

      final out = List<TourStop>.from(stops);
      for (final item in list.whereType<Map>()) {
        final i = (item['i'] as num?)?.toInt();
        if (i == null || i < 0 || i >= out.length) continue;
        final script = (item['script'] as String?)?.trim();
        final title = (item['title'] as String?)?.trim();
        if (script == null || script.isEmpty) continue;
        out[i] = TourStop(
          title: (title == null || title.isEmpty) ? out[i].title : title,
          script: script,
          kind: out[i].kind,
          image: out[i].image,
        );
      }
      return out;
    } catch (_) {
      return null;
    }
  }
}

class TourResult {
  const TourResult(this.stops, this.warning);
  final List<TourStop> stops;

  /// Set when the tour plays, but not in the language that was asked for.
  final String? warning;
}
