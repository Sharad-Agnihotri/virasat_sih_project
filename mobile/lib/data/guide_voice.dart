import 'dart:async';

import 'package:flutter_tts/flutter_tts.dart';

import 'tour.dart';

/// The speaking half of the tour guide.
///
/// Wraps the phone's own speech engine, because it is the only way to get
/// eleven Indian languages without a per-word cloud bill — and it works with
/// no network once the voice data is on the device.
///
/// Two things make it sound like a guide rather than a screen reader: the
/// pacing is slowed to a docent's, and every stop is spoken sentence by
/// sentence so the engine never truncates a long passage (Android quietly
/// drops utterances past about fifteen seconds).
class GuideVoice {
  GuideVoice();

  final FlutterTts _tts = FlutterTts();
  bool _ready = false;

  /// Bumped on every stop and stop-change, so callbacks from an utterance
  /// that has been superseded are ignored.
  int _run = 0;

  Set<String>? _installed;

  Future<void> _init() async {
    if (_ready) return;
    _ready = true;
    // Await each sentence, which is what lets us queue them in order and
    // know when the whole stop has finished.
    await _tts.awaitSpeakCompletion(true);
  }

  /// Locales the phone can actually speak. Used to mark languages that need
  /// voice data installed before they will work.
  Future<Set<String>> installedLocales() async {
    final cached = _installed;
    if (cached != null) return cached;
    await _init();
    try {
      final langs = await _tts.getLanguages as List?;
      final set = langs
              ?.whereType<String>()
              .map((l) => l.replaceAll('_', '-').toLowerCase())
              .toSet() ??
          <String>{};
      _installed = set;
      return set;
    } catch (_) {
      return _installed = <String>{};
    }
  }

  Future<bool> supports(TourLanguage language) async {
    final set = await installedLocales();
    if (set.isEmpty) return true; // cannot tell; let it try
    final want = language.ttsLocale.toLowerCase();
    final base = want.split('-').first;
    return set.contains(want) || set.any((l) => l.startsWith('$base-'));
  }

  Future<void> _configure(TourLanguage language) async {
    await _init();
    await _tts.setLanguage(language.ttsLocale);
    // Android's baseline rate is 0.5. A shade under that is the pace of
    // someone explaining something they know well.
    await _tts.setSpeechRate(0.46);
    await _tts.setPitch(1.0);
    await _tts.setVolume(1.0);

    // Prefer a networked (neural) voice for the locale when the engine
    // offers one; they are markedly less robotic than the local fallback.
    try {
      final voices = await _tts.getVoices as List?;
      final want = language.ttsLocale.toLowerCase();
      final base = want.split('-').first;
      final matches = (voices ?? [])
          .whereType<Map>()
          .map((v) => v.map((k, val) => MapEntry('$k', '$val')))
          .where((v) =>
              (v['locale'] ?? '').replaceAll('_', '-').toLowerCase() == want ||
              (v['locale'] ?? '')
                  .replaceAll('_', '-')
                  .toLowerCase()
                  .startsWith('$base-'))
          .toList();
      if (matches.isNotEmpty) {
        matches.sort((a, b) => _voiceScore(b).compareTo(_voiceScore(a)));
        final best = matches.first;
        await _tts.setVoice({
          'name': best['name'] ?? '',
          'locale': best['locale'] ?? language.ttsLocale,
        });
      }
    } catch (_) {
      // Engine does not expose voices; the locale default is fine.
    }
  }

  static int _voiceScore(Map<String, String> v) {
    final name = (v['name'] ?? '').toLowerCase();
    var score = 0;
    if (name.contains('network') || name.contains('neural')) score += 30;
    if (name.contains('female') || name.endsWith('-female')) score += 5;
    if (name.contains('local')) score -= 10;
    if (name.contains('compact') || name.contains('espeak')) score -= 40;
    return score;
  }

  /// Speak one stop, sentence by sentence. Returns when the stop finishes,
  /// or immediately if it was superseded by [stop] or another [speak].
  Future<void> speak(String text, TourLanguage language) async {
    final run = ++_run;
    await _configure(language);
    if (run != _run) return;

    for (final sentence in _sentences(text)) {
      if (run != _run) return;
      await _tts.speak(sentence);
      if (run != _run) return;
      // A beat between sentences; a guide does not run them together.
      await Future<void>.delayed(const Duration(milliseconds: 160));
    }
  }

  Future<void> stop() async {
    _run++;
    await _init();
    await _tts.stop();
  }

  Future<void> dispose() async {
    _run++;
    try {
      await _tts.stop();
    } catch (_) {}
  }

  /// Split on sentence ends, including the Devanagari danda, and merge any
  /// fragment too short to be worth its own utterance.
  static List<String> _sentences(String text) {
    final raw = text
        .split(RegExp(r'(?<=[.!?।])\s+'))
        .map((s) => s.trim())
        .where((s) => s.isNotEmpty)
        .toList();

    final out = <String>[];
    for (final s in raw) {
      if (out.isNotEmpty && (out.last.length + s.length) < 90) {
        out[out.length - 1] = '${out.last} $s';
      } else {
        out.add(s);
      }
    }
    return out.isEmpty ? [text] : out;
  }
}
