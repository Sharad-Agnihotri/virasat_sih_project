import 'package:flutter/material.dart';

import '../data/city.dart';
import '../data/guide_voice.dart';
import '../data/tour.dart';
import '../design/remote_image.dart';
import '../design/tokens.dart';

/// The guided audio tour of a city.
///
/// Opens on the language choice, because that decision changes everything
/// that follows and asking for it later would mean re-fetching the script.
/// After that it is a player: one stop at a time, spoken aloud, with the
/// text on screen for anyone who would rather read or cannot hear it.
class TourSheet extends StatefulWidget {
  const TourSheet({super.key, required this.city});
  final City city;

  static Future<void> open(BuildContext context, City city) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: VColor.surface,
      builder: (_) => TourSheet(city: city),
    );
  }

  @override
  State<TourSheet> createState() => _TourSheetState();
}

enum _Phase { choosing, loading, playing }

class _TourSheetState extends State<TourSheet> {
  final _voice = GuideVoice();

  _Phase _phase = _Phase.choosing;
  TourLanguage _language = TourLanguage.english;
  List<TourStop> _stops = const [];
  int _index = 0;
  bool _speaking = false;
  String? _notice;
  Set<String> _installed = const {};

  @override
  void initState() {
    super.initState();
    _voice.installedLocales().then((set) {
      if (mounted) setState(() => _installed = set);
    });
  }

  @override
  void dispose() {
    _voice.dispose();
    super.dispose();
  }

  bool _hasVoice(TourLanguage l) {
    if (_installed.isEmpty) return true;
    final want = l.ttsLocale.toLowerCase();
    final base = want.split('-').first;
    return _installed.contains(want) ||
        _installed.any((x) => x.startsWith('$base-'));
  }

  Future<void> _start(TourLanguage language) async {
    setState(() {
      _language = language;
      _phase = _Phase.loading;
      _notice = null;
    });

    final result = await TourScript.build(widget.city, language);
    if (!mounted) return;

    setState(() {
      _stops = result.stops;
      _index = 0;
      _phase = _Phase.playing;
      _notice = result.warning ??
          (_hasVoice(language)
              ? null
              : 'Your phone has no ${language.englishName} voice installed. '
                  'The text is here; install the voice from Android Settings '
                  '→ Accessibility → Text-to-speech to hear it.');
    });
    _play();
  }

  Future<void> _play() async {
    if (_stops.isEmpty) return;
    setState(() => _speaking = true);
    final at = _index;
    await _voice.speak(_stops[_index].script, _language);
    if (!mounted || at != _index) return;
    setState(() => _speaking = false);
    // Roll on to the next stop the way a guide keeps walking.
    if (_index < _stops.length - 1) _go(_index + 1);
  }

  Future<void> _pause() async {
    await _voice.stop();
    if (mounted) setState(() => _speaking = false);
  }

  Future<void> _go(int i) async {
    if (i < 0 || i >= _stops.length) return;
    await _voice.stop();
    if (!mounted) return;
    setState(() => _index = i);
    _play();
  }

  @override
  Widget build(BuildContext context) {
    return FractionallySizedBox(
      heightFactor: 0.94,
      child: Column(
        children: [
          _Header(city: widget.city, phase: _phase),
          const Divider(height: 1),
          Expanded(
            child: switch (_phase) {
              _Phase.choosing => _LanguagePicker(
                  installed: _installed,
                  hasVoice: _hasVoice,
                  onPick: _start,
                ),
              _Phase.loading => _Loading(language: _language),
              _Phase.playing => _Player(
                  stops: _stops,
                  index: _index,
                  notice: _notice,
                  onSelect: _go,
                ),
            },
          ),
          if (_phase == _Phase.playing)
            _Controls(
              speaking: _speaking,
              index: _index,
              total: _stops.length,
              language: _language,
              onPlayPause: () => _speaking ? _pause() : _play(),
              onPrev: () => _go(_index - 1),
              onNext: () => _go(_index + 1),
              onChangeLanguage: () async {
                await _voice.stop();
                if (mounted) setState(() => _phase = _Phase.choosing);
              },
            ),
        ],
      ),
    );
  }
}

// ── Header ──────────────────────────────────────────────────────────────

class _Header extends StatelessWidget {
  const _Header({required this.city, required this.phase});
  final City city;
  final _Phase phase;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding:
          const EdgeInsets.fromLTRB(VSpace.gutter, 0, VSpace.sm, VSpace.md),
      child: Row(
        children: [
          Container(
            width: 34,
            height: 34,
            decoration: BoxDecoration(
              color: VColor.terracottaWash,
              borderRadius: BorderRadius.circular(VRadius.sm),
            ),
            child: const Icon(Icons.headphones_rounded,
                size: 18, color: VColor.terracotta),
          ),
          const SizedBox(width: VSpace.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('Guided tour',
                    style: VFont.sansStyle(
                        size: 15.5, weight: 700, color: VColor.ink)),
                Text(city.name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: VFont.caption),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.close_rounded, size: 20),
            color: VColor.inkMuted,
            onPressed: () => Navigator.of(context).maybePop(),
          ),
        ],
      ),
    );
  }
}

// ── Language ────────────────────────────────────────────────────────────

class _LanguagePicker extends StatelessWidget {
  const _LanguagePicker({
    required this.installed,
    required this.hasVoice,
    required this.onPick,
  });

  final Set<String> installed;
  final bool Function(TourLanguage) hasVoice;
  final ValueChanged<TourLanguage> onPick;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(
          VSpace.gutter, VSpace.lg, VSpace.gutter, VSpace.xxxl),
      children: [
        Text('CHOOSE YOUR GUIDE’S LANGUAGE', style: VFont.eyebrow),
        const SizedBox(height: VSpace.sm),
        Text('Which language would\nyou like to hear?',
            style: VFont.serif(size: 25, weight: 600, height: 1.16)),
        const SizedBox(height: VSpace.md),
        Text(
          'The whole tour — the history, the crafts, the food — is retold in '
          'the language you pick, not just translated word for word.',
          style: VFont.sansStyle(size: 14.5, height: 1.58),
        ),
        const SizedBox(height: VSpace.xl),
        for (final l in TourLanguage.all)
          Padding(
            padding: const EdgeInsets.only(bottom: VSpace.sm),
            child: _LanguageRow(
              language: l,
              available: hasVoice(l),
              onTap: () => onPick(l),
            ),
          ),
        const SizedBox(height: VSpace.md),
        Text(
          'A language marked “voice not installed” will still show the tour '
          'as text.',
          style: VFont.caption,
        ),
      ],
    );
  }
}

class _LanguageRow extends StatelessWidget {
  const _LanguageRow({
    required this.language,
    required this.available,
    required this.onTap,
  });

  final TourLanguage language;
  final bool available;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: VColor.surface,
      borderRadius: BorderRadius.circular(VRadius.md),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(VRadius.md),
        child: Container(
          padding: const EdgeInsets.symmetric(
              horizontal: VSpace.lg, vertical: VSpace.md),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(VRadius.md),
            border: Border.all(color: VColor.hairline),
          ),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(language.name,
                        style: VFont.sansStyle(
                            size: 16, weight: 700, color: VColor.ink)),
                    const SizedBox(height: 1),
                    Text(
                      available
                          ? language.englishName
                          : '${language.englishName} · voice not installed',
                      style: VFont.caption,
                    ),
                  ],
                ),
              ),
              Icon(
                available ? Icons.volume_up_rounded : Icons.notes_rounded,
                size: 18,
                color: available ? VColor.terracotta : VColor.inkMuted,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Loading extends StatelessWidget {
  const _Loading({required this.language});
  final TourLanguage language;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(VSpace.xxl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(
              width: 22,
              height: 22,
              child: CircularProgressIndicator(strokeWidth: 2),
            ),
            const SizedBox(height: VSpace.lg),
            Text(
              language.code == 'en'
                  ? 'Preparing your tour…'
                  : 'Retelling the tour in ${language.name}…',
              textAlign: TextAlign.center,
              style: VFont.sansStyle(size: 15, weight: 600, color: VColor.ink),
            ),
            const SizedBox(height: VSpace.sm),
            Text('This happens once per city.',
                textAlign: TextAlign.center, style: VFont.caption),
          ],
        ),
      ),
    );
  }
}

// ── Player ──────────────────────────────────────────────────────────────

class _Player extends StatelessWidget {
  const _Player({
    required this.stops,
    required this.index,
    required this.notice,
    required this.onSelect,
  });

  final List<TourStop> stops;
  final int index;
  final String? notice;
  final ValueChanged<int> onSelect;

  @override
  Widget build(BuildContext context) {
    final stop = stops[index];

    return ListView(
      // Keyed on the stop so the list returns to the top when it changes,
      // instead of leaving the reader halfway down the previous script.
      key: ValueKey(index),
      padding: const EdgeInsets.fromLTRB(
          VSpace.gutter, VSpace.lg, VSpace.gutter, VSpace.lg),
      children: [
        if (notice != null) ...[
          _Notice(message: notice!),
          const SizedBox(height: VSpace.lg),
        ],
        if (stop.image.isNotEmpty) ...[
          ClipRRect(
            borderRadius: BorderRadius.circular(VRadius.lg),
            child: AspectRatio(
              aspectRatio: 16 / 10,
              child: RemoteImage(path: stop.image),
            ),
          ),
          const SizedBox(height: VSpace.lg),
        ],
        Text(_kindLabel(stop.kind), style: VFont.eyebrow),
        const SizedBox(height: VSpace.sm),
        Text(stop.title,
            style: VFont.serif(size: 24, weight: 600, height: 1.2)),
        const SizedBox(height: VSpace.md),
        SelectableText(stop.script,
            style: VFont.sansStyle(size: 16, height: 1.7)),
        const SizedBox(height: VSpace.xxl),
        Text('ALL STOPS', style: VFont.eyebrow),
        const SizedBox(height: VSpace.md),
        for (var i = 0; i < stops.length; i++)
          _StopRow(
            number: i + 1,
            title: stops[i].title,
            active: i == index,
            onTap: () => onSelect(i),
          ),
      ],
    );
  }

  static String _kindLabel(TourStopKind kind) => switch (kind) {
        TourStopKind.welcome => 'WELCOME',
        TourStopKind.place => 'A PLACE TO STAND',
        TourStopKind.craft => 'A LIVING CRAFT',
        TourStopKind.food => 'SOMETHING TO EAT',
        TourStopKind.festival => 'IF YOU COME BACK',
        TourStopKind.farewell => 'BEFORE YOU GO',
      };
}

class _StopRow extends StatelessWidget {
  const _StopRow({
    required this.number,
    required this.title,
    required this.active,
    required this.onTap,
  });

  final int number;
  final String title;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(VRadius.sm),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: VSpace.sm),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              width: 28,
              child: Text(
                '$number'.padLeft(2, '0'),
                style: VFont.sansStyle(
                  size: 11.5,
                  weight: 800,
                  color: active ? VColor.terracotta : VColor.inkMuted,
                  height: 1.7,
                ),
              ),
            ),
            Expanded(
              child: Text(
                title,
                style: VFont.sansStyle(
                  size: 14.5,
                  weight: active ? 700 : 500,
                  color: active ? VColor.ink : VColor.inkSoft,
                  height: 1.4,
                ),
              ),
            ),
            if (active)
              const Padding(
                padding: EdgeInsets.only(left: VSpace.sm, top: 2),
                child: Icon(Icons.graphic_eq_rounded,
                    size: 15, color: VColor.terracotta),
              ),
          ],
        ),
      ),
    );
  }
}

class _Notice extends StatelessWidget {
  const _Notice({required this.message});
  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(VSpace.lg),
      decoration: BoxDecoration(
        color: VColor.goldWash,
        borderRadius: BorderRadius.circular(VRadius.md),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.info_outline_rounded, size: 18, color: VColor.gold),
          const SizedBox(width: VSpace.md),
          Expanded(
            child: Text(message, style: VFont.sansStyle(size: 13, height: 1.5)),
          ),
        ],
      ),
    );
  }
}

// ── Controls ────────────────────────────────────────────────────────────

class _Controls extends StatelessWidget {
  const _Controls({
    required this.speaking,
    required this.index,
    required this.total,
    required this.language,
    required this.onPlayPause,
    required this.onPrev,
    required this.onNext,
    required this.onChangeLanguage,
  });

  final bool speaking;
  final int index;
  final int total;
  final TourLanguage language;
  final VoidCallback onPlayPause;
  final VoidCallback onPrev;
  final VoidCallback onNext;
  final VoidCallback onChangeLanguage;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(
        VSpace.gutter,
        VSpace.md,
        VSpace.gutter,
        VSpace.md + MediaQuery.of(context).padding.bottom * 0.5,
      ),
      decoration: const BoxDecoration(
        color: VColor.surface,
        border: Border(top: BorderSide(color: VColor.hairline)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // A bar per stop, so the length of the walk is visible at a glance.
          Row(
            children: [
              for (var i = 0; i < total; i++) ...[
                if (i > 0) const SizedBox(width: 3),
                Expanded(
                  child: Container(
                    height: 3,
                    decoration: BoxDecoration(
                      color: i <= index ? VColor.terracotta : VColor.hairline,
                      borderRadius: BorderRadius.circular(VRadius.pill),
                    ),
                  ),
                ),
              ],
            ],
          ),
          const SizedBox(height: VSpace.md),
          Row(
            children: [
              TextButton.icon(
                onPressed: onChangeLanguage,
                style: TextButton.styleFrom(
                  foregroundColor: VColor.inkMuted,
                  padding: const EdgeInsets.symmetric(horizontal: VSpace.sm),
                  minimumSize: const Size(0, 40),
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                icon: const Icon(Icons.translate_rounded, size: 16),
                label: Text(language.name,
                    style: VFont.sansStyle(
                        size: 13, weight: 600, color: VColor.inkMuted)),
              ),
              const Spacer(),
              _RoundButton(
                icon: Icons.skip_previous_rounded,
                onTap: index > 0 ? onPrev : null,
              ),
              const SizedBox(width: VSpace.md),
              Material(
                color: VColor.ink,
                shape: const CircleBorder(),
                clipBehavior: Clip.antiAlias,
                child: InkWell(
                  onTap: onPlayPause,
                  child: SizedBox(
                    width: 54,
                    height: 54,
                    child: Icon(
                      speaking ? Icons.pause_rounded : Icons.play_arrow_rounded,
                      size: 26,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: VSpace.md),
              _RoundButton(
                icon: Icons.skip_next_rounded,
                onTap: index < total - 1 ? onNext : null,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _RoundButton extends StatelessWidget {
  const _RoundButton({required this.icon, required this.onTap});
  final IconData icon;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final enabled = onTap != null;
    return Material(
      color: VColor.surfaceMuted,
      shape: const CircleBorder(),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: SizedBox(
          width: 42,
          height: 42,
          child: Icon(icon,
              size: 20,
              color: enabled ? VColor.ink : VColor.inkMuted.withOpacity(0.4)),
        ),
      ),
    );
  }
}
