import 'package:flutter/material.dart';

import '../data/city.dart';
import '../design/heritage_backdrop.dart';
import '../design/remote_image.dart';
import '../design/tokens.dart';
import 'city_screen.dart';

/// Explore City — the entry point into the heritage of a place.
///
/// One job: help someone find their city fast. Search matches the city, the
/// state, its monuments, crafts and dishes, so "pottery" or "Hawa Mahal"
/// both land on Jaipur.
class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key});

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  final _controller = TextEditingController();
  late final Future<List<City>> _future = CityRepository.load();
  String _query = '';

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return HeritageBackdrop(
      child: SafeArea(
        bottom: false,
        child: FutureBuilder<List<City>>(
          future: _future,
          builder: (context, snap) {
            if (snap.connectionState != ConnectionState.done) {
              return const Center(
                child: SizedBox(
                  width: 22,
                  height: 22,
                  child: CircularProgressIndicator(strokeWidth: 2),
                ),
              );
            }
            if (snap.hasError || snap.data == null) {
              return _Message(
                title: 'Could not load cities',
                body: '${snap.error ?? 'The heritage dataset is missing.'}',
              );
            }

            final all = snap.data!;
            final results = CityRepository.search(all, _query);

            return CustomScrollView(
              physics: const BouncingScrollPhysics(
                  parent: AlwaysScrollableScrollPhysics()),
              slivers: [
                SliverToBoxAdapter(
                  child: _Header(
                    controller: _controller,
                    total: all.length,
                    showing: results.length,
                    query: _query,
                    onChanged: (v) => setState(() => _query = v),
                    onClear: () {
                      _controller.clear();
                      setState(() => _query = '');
                    },
                  ),
                ),
                if (results.isEmpty)
                  SliverFillRemaining(
                    hasScrollBody: false,
                    child: _Message(
                      title: 'No match for “$_query”',
                      body: 'Try a city, a state, a monument or a craft — '
                          'Hampi, Kashmir, Hawa Mahal, blue pottery.',
                    ),
                  )
                else
                  SliverPadding(
                    padding: const EdgeInsets.fromLTRB(
                        VSpace.gutter, 0, VSpace.gutter, VSpace.xxxl),
                    sliver: SliverList.separated(
                      itemCount: results.length,
                      separatorBuilder: (_, __) =>
                          const SizedBox(height: VSpace.md),
                      itemBuilder: (_, i) => _CityCard(
                        city: results[i],
                        onTap: () => Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => CityScreen(city: results[i]),
                          ),
                        ),
                      ),
                    ),
                  ),
              ],
            );
          },
        ),
      ),
    );
  }
}

// ── Header ──────────────────────────────────────────────────────────────

class _Header extends StatelessWidget {
  const _Header({
    required this.controller,
    required this.total,
    required this.showing,
    required this.query,
    required this.onChanged,
    required this.onClear,
  });

  final TextEditingController controller;
  final int total;
  final int showing;
  final String query;
  final ValueChanged<String> onChanged;
  final VoidCallback onClear;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(
          VSpace.gutter, VSpace.lg, VSpace.gutter, VSpace.lg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('EXPLORE CITY', style: VFont.eyebrow),
          const SizedBox(height: VSpace.sm),
          Text('Where would you\nlike to begin?',
              style: VFont.serif(size: 29, weight: 600, height: 1.14)),
          const SizedBox(height: VSpace.lg),
          TextField(
            controller: controller,
            onChanged: onChanged,
            textInputAction: TextInputAction.search,
            style: VFont.sansStyle(size: 15, color: VColor.ink),
            decoration: InputDecoration(
              hintText: 'City, monument or craft',
              prefixIcon: const Icon(Icons.search_rounded,
                  size: 20, color: VColor.inkMuted),
              suffixIcon: query.isEmpty
                  ? null
                  : IconButton(
                      icon: const Icon(Icons.close_rounded, size: 18),
                      color: VColor.inkMuted,
                      onPressed: onClear,
                      tooltip: 'Clear',
                    ),
              // A tighter field than the global default; this one sits under
              // a heading rather than in a form.
              contentPadding: const EdgeInsets.symmetric(
                  horizontal: VSpace.lg, vertical: VSpace.md),
            ),
          ),
          const SizedBox(height: VSpace.md),
          Text(
            query.isEmpty
                ? '$total cities documented'
                : '$showing of $total cities',
            style: VFont.caption,
          ),
        ],
      ),
    );
  }
}

// ── City card ───────────────────────────────────────────────────────────

class _CityCard extends StatelessWidget {
  const _CityCard({required this.city, required this.onTap});

  final City city;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return VCard(
      onTap: onTap,
      clip: true,
      padding: EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // A fixed ratio, so a slow or failed photograph never changes the
          // card's height and shuffles the list under the reader's thumb.
          AspectRatio(
            aspectRatio: 16 / 9,
            child: Stack(
              fit: StackFit.expand,
              children: [
                RemoteImage(path: city.heroImage ?? ''),
                // Scrim only behind the chip, so the photograph stays bright.
                const DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.center,
                      colors: [Color(0x40000000), Colors.transparent],
                    ),
                  ),
                ),
                Positioned(
                  top: VSpace.md,
                  left: VSpace.md,
                  child: _Chip(label: city.state),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(
                VSpace.lg, VSpace.md, VSpace.lg, VSpace.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  city.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: VFont.serif(size: 21, weight: 600),
                ),
                const SizedBox(height: VSpace.xs),
                Text(
                  city.shortDesc,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: VFont.sansStyle(size: 13.5, height: 1.45),
                ),
                const SizedBox(height: VSpace.md),
                _Counts(city: city),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// What the city holds, as a single wrapping line. Wrap rather than Row so
/// a long set never runs past the card edge.
class _Counts extends StatelessWidget {
  const _Counts({required this.city});
  final City city;

  @override
  Widget build(BuildContext context) {
    final items = <(IconData, int)>[
      (Icons.account_balance_outlined, city.places.length),
      (Icons.palette_outlined, city.crafts.length),
      (Icons.restaurant_outlined, city.food.length),
      (Icons.celebration_outlined, city.festivals.length),
    ].where((e) => e.$2 > 0).toList();

    return Wrap(
      spacing: VSpace.lg,
      runSpacing: VSpace.sm,
      children: [
        for (final (icon, n) in items)
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 14, color: VColor.inkMuted),
              const SizedBox(width: 5),
              Text('$n', style: VFont.caption),
            ],
          ),
      ],
    );
  }
}

class _Chip extends StatelessWidget {
  const _Chip({required this.label});
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: VSpace.md, vertical: 5),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.92),
        borderRadius: BorderRadius.circular(VRadius.pill),
      ),
      child: Text(
        label.toUpperCase(),
        style: VFont.sansStyle(
            size: 9.5, weight: 800, color: VColor.ink, letterSpacing: 1.1),
      ),
    );
  }
}

class _Message extends StatelessWidget {
  const _Message({required this.title, required this.body});
  final String title;
  final String body;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(
          VSpace.xxl, VSpace.xxl, VSpace.xxl, VSpace.xxxl),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: VFont.serif(size: 20, weight: 600)),
          const SizedBox(height: VSpace.sm),
          Text(body, style: VFont.sansStyle(size: 14.5, height: 1.55)),
        ],
      ),
    );
  }
}
