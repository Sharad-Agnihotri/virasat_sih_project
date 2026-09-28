import 'package:flutter/material.dart';

import '../data/city.dart';
import '../design/heritage_backdrop.dart';
import '../design/remote_image.dart';
import '../design/tokens.dart';
import 'ask_sheet.dart';
import 'tour_sheet.dart';

/// One city's heritage, in sections.
///
/// A collapsing photograph carries the name, then a pinned tab bar. Only
/// sections that actually have content get a tab, so no tab is ever empty.
class CityScreen extends StatelessWidget {
  const CityScreen({super.key, required this.city, this.initialTab = 0});

  final City city;

  /// Which section opens first. Used by deep links and by the design
  /// preview; defaults to the story.
  final int initialTab;

  List<_Section> get _sections => [
        _Section('Story', (c) => _StoryTab(city: c)),
        if (city.places.isNotEmpty)
          _Section('Places', (c) => _PlacesTab(city: c)),
        if (city.crafts.isNotEmpty)
          _Section('Crafts', (c) => _CraftsTab(city: c)),
        if (city.food.isNotEmpty) _Section('Food', (c) => _FoodTab(city: c)),
        if (city.festivals.isNotEmpty)
          _Section('Festivals', (c) => _FestivalsTab(city: c)),
        if (city.artisans.isNotEmpty)
          _Section('Artisans', (c) => _ArtisansTab(city: c)),
      ];

  @override
  Widget build(BuildContext context) {
    final sections = _sections;

    return DefaultTabController(
      length: sections.length,
      initialIndex: initialTab.clamp(0, sections.length - 1),
      child: Scaffold(
        backgroundColor: VColor.canvas,
        // The guide knows which city is open, so questions here need no
        // preamble from the visitor.
        floatingActionButton: FloatingActionButton.extended(
          onPressed: () => TourSheet.open(context, city),
          backgroundColor: VColor.terracotta,
          foregroundColor: Colors.white,
          elevation: 2,
          icon: const Icon(Icons.headphones_rounded, size: 19),
          label: Text('Guided tour',
              style:
                  VFont.sansStyle(size: 14, weight: 700, color: Colors.white)),
        ),
        body: NestedScrollView(
          headerSliverBuilder: (context, _) => [
            _CityAppBar(city: city),
            SliverPersistentHeader(
              pinned: true,
              delegate: _TabBarDelegate(
                TabBar(
                  isScrollable: true,
                  tabAlignment: TabAlignment.start,
                  labelColor: VColor.terracotta,
                  unselectedLabelColor: VColor.inkMuted,
                  indicatorColor: VColor.terracotta,
                  indicatorWeight: 2,
                  indicatorSize: TabBarIndicatorSize.label,
                  dividerColor: Colors.transparent,
                  labelStyle: VFont.sansStyle(
                      size: 14, weight: 700, color: VColor.terracotta),
                  unselectedLabelStyle: VFont.sansStyle(
                      size: 14, weight: 500, color: VColor.inkMuted),
                  labelPadding:
                      const EdgeInsets.symmetric(horizontal: VSpace.lg),
                  tabs: [for (final s in sections) Tab(text: s.label)],
                ),
              ),
            ),
          ],
          body: TabBarView(
            children: [for (final s in sections) s.build(city)],
          ),
        ),
      ),
    );
  }
}

class _Section {
  const _Section(this.label, this.build);
  final String label;
  final Widget Function(City) build;
}

// ── Header ──────────────────────────────────────────────────────────────

class _CityAppBar extends StatelessWidget {
  const _CityAppBar({required this.city});
  final City city;

  @override
  Widget build(BuildContext context) {
    return SliverAppBar(
      expandedHeight: 248,
      pinned: true,
      backgroundColor: VColor.canvas,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
      leading: const _CircleBack(),
      actions: [_CircleAsk(city: city), const SizedBox(width: VSpace.sm)],
      // Title appears only once the bar has collapsed onto the photograph,
      // so it never sits on top of the name in the flexible space.
      title: _CollapsedTitle(city: city),
      flexibleSpace: FlexibleSpaceBar(
        collapseMode: CollapseMode.parallax,
        background: Stack(
          fit: StackFit.expand,
          children: [
            RemoteImage(path: city.heroImage ?? ''),
            // Two scrims: one under the status bar for the back button, one
            // at the foot so the name stays legible on a bright photograph.
            const DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Color(0x73000000),
                    Color(0x14000000),
                    Color(0xB3000000),
                  ],
                  stops: [0.0, 0.42, 1.0],
                ),
              ),
            ),
            Positioned(
              left: VSpace.gutter,
              right: VSpace.gutter,
              bottom: VSpace.lg,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    city.state.toUpperCase(),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: VFont.sansStyle(
                      size: 10,
                      weight: 800,
                      color: Colors.white.withOpacity(0.85),
                      letterSpacing: 2,
                    ),
                  ),
                  const SizedBox(height: VSpace.xs),
                  Text(
                    city.name,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: VFont.serif(
                        size: 30,
                        weight: 600,
                        height: 1.1,
                        color: Colors.white),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Opens the guide already primed with this city.
class _CircleAsk extends StatelessWidget {
  const _CircleAsk({required this.city});
  final City city;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Material(
        color: Colors.black.withOpacity(0.32),
        shape: const CircleBorder(),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: () => AskSheet.open(
            context,
            about: 'The visitor is reading about ${city.name}, '
                '${city.state}. Context: ${city.shortDesc} '
                'Known crafts: ${city.crafts.map((c) => c.name).join(', ')}. '
                'Known dishes: ${city.food.map((f) => f.name).join(', ')}.',
            opener: 'Ask me anything about ${city.name} — what to see, '
                'when to go, what to eat, what to bring home.',
            suggestions: [
              'Plan one day in ${city.name}',
              'What craft should I buy here, and from whom?',
              'What should I eat in ${city.name}?',
            ],
          ),
          child: const SizedBox(
            width: 38,
            height: 38,
            child:
                Icon(Icons.auto_awesome_rounded, size: 18, color: Colors.white),
          ),
        ),
      ),
    );
  }
}

/// Fades the city name into the app bar as the photograph scrolls away.
class _CollapsedTitle extends StatelessWidget {
  const _CollapsedTitle({required this.city});
  final City city;

  @override
  Widget build(BuildContext context) {
    final settings =
        context.dependOnInheritedWidgetOfExactType<FlexibleSpaceBarSettings>();
    if (settings == null) return const SizedBox.shrink();

    final range = settings.maxExtent - settings.minExtent;
    final t = range <= 0
        ? 1.0
        : (1 - (settings.currentExtent - settings.minExtent) / range)
            .clamp(0.0, 1.0);
    // Only the last quarter of the collapse fades it in, so the two titles
    // are never both legible at once.
    final opacity = ((t - 0.75) / 0.25).clamp(0.0, 1.0);

    return Opacity(
      opacity: opacity,
      child: Text(
        city.name,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: VFont.serif(size: 19, weight: 600),
      ),
    );
  }
}

class _CircleBack extends StatelessWidget {
  const _CircleBack();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Material(
        color: Colors.black.withOpacity(0.32),
        shape: const CircleBorder(),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: () => Navigator.of(context).maybePop(),
          child: const SizedBox(
            width: 38,
            height: 38,
            child:
                Icon(Icons.arrow_back_rounded, size: 19, color: Colors.white),
          ),
        ),
      ),
    );
  }
}

/// Keeps the tab bar pinned under the collapsing photograph.
class _TabBarDelegate extends SliverPersistentHeaderDelegate {
  _TabBarDelegate(this.tabBar);
  final TabBar tabBar;

  static const _height = 50.0;

  @override
  double get minExtent => _height;
  @override
  double get maxExtent => _height;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlaps) {
    return Container(
      height: _height,
      decoration: const BoxDecoration(
        color: VColor.canvas,
        border: Border(bottom: BorderSide(color: VColor.hairline, width: 1)),
      ),
      alignment: Alignment.centerLeft,
      child: tabBar,
    );
  }

  @override
  bool shouldRebuild(_TabBarDelegate old) => old.tabBar != tabBar;
}

// ── Shared tab scaffolding ──────────────────────────────────────────────

/// Every tab scrolls inside the same padded, bounded list, which is what
/// keeps content off the edges and clear of the bottom inset.
class _TabList extends StatelessWidget {
  const _TabList({required this.children});
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return ListView(
      physics:
          const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
      padding: EdgeInsets.fromLTRB(
        VSpace.gutter,
        VSpace.xl,
        VSpace.gutter,
        VSpace.xxxl + MediaQuery.of(context).padding.bottom,
      ),
      children: children,
    );
  }
}

/// An illustrated entry: photograph, name, description, and an optional
/// longer story folded away behind a disclosure.
class _EntryCard extends StatefulWidget {
  const _EntryCard({
    required this.image,
    required this.title,
    required this.body,
    this.story,
  });

  final String image;
  final String title;
  final String body;
  final String? story;

  @override
  State<_EntryCard> createState() => _EntryCardState();
}

class _EntryCardState extends State<_EntryCard> {
  bool _open = false;

  @override
  Widget build(BuildContext context) {
    final story = widget.story;
    final hasStory = story != null && story.trim().isNotEmpty;

    return VCard(
      padding: EdgeInsets.zero,
      clip: true,
      onTap: hasStory ? () => setState(() => _open = !_open) : null,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (widget.image.isNotEmpty)
            AspectRatio(
              aspectRatio: 16 / 10,
              child: RemoteImage(path: widget.image),
            ),
          Padding(
            padding: const EdgeInsets.all(VSpace.lg),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(widget.title,
                    style: VFont.serif(size: 19, weight: 600, height: 1.25)),
                const SizedBox(height: VSpace.sm),
                Text(widget.body,
                    style: VFont.sansStyle(size: 14.5, height: 1.58)),
                if (hasStory) ...[
                  // AnimatedCrossFade rather than a conditional child, so the
                  // card grows smoothly instead of jumping the list.
                  AnimatedCrossFade(
                    duration: const Duration(milliseconds: 260),
                    sizeCurve: Curves.easeOutCubic,
                    crossFadeState: _open
                        ? CrossFadeState.showSecond
                        : CrossFadeState.showFirst,
                    firstChild: const SizedBox(width: double.infinity),
                    secondChild: Padding(
                      padding: const EdgeInsets.only(top: VSpace.md),
                      child: Text(
                        story,
                        style: VFont.sansStyle(
                            size: 14, height: 1.62, color: VColor.inkMuted),
                      ),
                    ),
                  ),
                  const SizedBox(height: VSpace.md),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        _open ? 'Less' : 'The story behind it',
                        style: VFont.sansStyle(
                            size: 13, weight: 700, color: VColor.terracotta),
                      ),
                      const SizedBox(width: 2),
                      AnimatedRotation(
                        turns: _open ? 0.5 : 0,
                        duration: const Duration(milliseconds: 260),
                        child: const Icon(Icons.expand_more_rounded,
                            size: 17, color: VColor.terracotta),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Tabs ────────────────────────────────────────────────────────────────

class _StoryTab extends StatelessWidget {
  const _StoryTab({required this.city});
  final City city;

  @override
  Widget build(BuildContext context) {
    return _TabList(
      children: [
        Text(city.shortDesc,
            style: VFont.serif(size: 19, weight: 600, height: 1.4)),
        const SizedBox(height: VSpace.lg),
        Text(city.historyStory, style: VFont.sansStyle(size: 15, height: 1.68)),
        if (city.languages.isNotEmpty) ...[
          const SizedBox(height: VSpace.xxl),
          Text('LANGUAGES SPOKEN', style: VFont.eyebrow),
          const SizedBox(height: VSpace.md),
          Wrap(
            spacing: VSpace.sm,
            runSpacing: VSpace.sm,
            children: [
              for (final l in city.languages)
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: VSpace.md, vertical: 7),
                  decoration: BoxDecoration(
                    color: VColor.surface,
                    borderRadius: BorderRadius.circular(VRadius.pill),
                    border: Border.all(color: VColor.hairline),
                  ),
                  child: Text(l,
                      style: VFont.sansStyle(
                          size: 12.5, weight: 600, color: VColor.ink)),
                ),
            ],
          ),
        ],
        const SizedBox(height: VSpace.xxl),
        _AtAGlance(city: city),
      ],
    );
  }
}

class _AtAGlance extends StatelessWidget {
  const _AtAGlance({required this.city});
  final City city;

  @override
  Widget build(BuildContext context) {
    final rows = <(String, int)>[
      ('Places to visit', city.places.length),
      ('Living crafts', city.crafts.length),
      ('Dishes', city.food.length),
      ('Festivals', city.festivals.length),
      ('Artisans listed', city.artisans.length),
    ].where((e) => e.$2 > 0).toList();

    return VCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('AT A GLANCE', style: VFont.eyebrow),
          const SizedBox(height: VSpace.md),
          for (var i = 0; i < rows.length; i++) ...[
            if (i > 0) const Divider(height: VSpace.xl),
            Row(
              children: [
                Expanded(
                  child: Text(rows[i].$1,
                      style:
                          VFont.sansStyle(size: 14.5, color: VColor.inkSoft)),
                ),
                Text('${rows[i].$2}',
                    style: VFont.sansStyle(
                        size: 15, weight: 700, color: VColor.ink)),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _PlacesTab extends StatelessWidget {
  const _PlacesTab({required this.city});
  final City city;

  @override
  Widget build(BuildContext context) {
    return _TabList(
      children: [
        for (var i = 0; i < city.places.length; i++) ...[
          if (i > 0) const SizedBox(height: VSpace.md),
          _EntryCard(
            image: city.places[i].image,
            title: city.places[i].name,
            body: city.places[i].desc,
          ),
        ],
      ],
    );
  }
}

class _CraftsTab extends StatelessWidget {
  const _CraftsTab({required this.city});
  final City city;

  @override
  Widget build(BuildContext context) {
    return _TabList(
      children: [
        for (var i = 0; i < city.crafts.length; i++) ...[
          if (i > 0) const SizedBox(height: VSpace.md),
          _EntryCard(
            image: city.crafts[i].image,
            title: city.crafts[i].name,
            body: city.crafts[i].desc,
            story: city.crafts[i].story,
          ),
        ],
      ],
    );
  }
}

class _FoodTab extends StatelessWidget {
  const _FoodTab({required this.city});
  final City city;

  @override
  Widget build(BuildContext context) {
    return _TabList(
      children: [
        for (var i = 0; i < city.food.length; i++) ...[
          if (i > 0) const SizedBox(height: VSpace.md),
          _EntryCard(
            image: city.food[i].image,
            title: city.food[i].name,
            body: city.food[i].desc,
            story: city.food[i].story,
          ),
        ],
      ],
    );
  }
}

class _FestivalsTab extends StatelessWidget {
  const _FestivalsTab({required this.city});
  final City city;

  @override
  Widget build(BuildContext context) {
    return _TabList(
      children: [
        for (var i = 0; i < city.festivals.length; i++) ...[
          if (i > 0) const SizedBox(height: VSpace.md),
          VCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Text(city.festivals[i].name,
                          style:
                              VFont.serif(size: 19, weight: 600, height: 1.25)),
                    ),
                    const SizedBox(width: VSpace.md),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: VSpace.md, vertical: 5),
                      decoration: BoxDecoration(
                        color: VColor.goldWash,
                        borderRadius: BorderRadius.circular(VRadius.pill),
                      ),
                      // Constrained so a long month string wraps inside the
                      // pill instead of pushing the title off the card.
                      child: ConstrainedBox(
                        constraints: const BoxConstraints(maxWidth: 124),
                        child: Text(
                          city.festivals[i].month,
                          textAlign: TextAlign.center,
                          style: VFont.sansStyle(
                              size: 11, weight: 700, color: VColor.gold),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: VSpace.sm),
                Text(city.festivals[i].desc,
                    style: VFont.sansStyle(size: 14.5, height: 1.58)),
              ],
            ),
          ),
        ],
      ],
    );
  }
}

class _ArtisansTab extends StatelessWidget {
  const _ArtisansTab({required this.city});
  final City city;

  @override
  Widget build(BuildContext context) {
    return _TabList(
      children: [
        for (var i = 0; i < city.artisans.length; i++) ...[
          if (i > 0) const SizedBox(height: VSpace.md),
          VCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(VRadius.sm),
                      child: SizedBox(
                        width: 56,
                        height: 56,
                        child: RemoteImage(path: city.artisans[i].photo),
                      ),
                    ),
                    const SizedBox(width: VSpace.lg),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(city.artisans[i].name,
                              style: VFont.cardTitle,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis),
                          const SizedBox(height: 2),
                          Text(city.artisans[i].craft,
                              style: VFont.caption,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis),
                          if (city.artisans[i].years > 0) ...[
                            const SizedBox(height: VSpace.sm),
                            Text('${city.artisans[i].years} years at the craft',
                                style: VFont.sansStyle(
                                    size: 12,
                                    weight: 700,
                                    color: VColor.terracotta)),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
                if (city.artisans[i].bio.isNotEmpty) ...[
                  const SizedBox(height: VSpace.md),
                  Text(city.artisans[i].bio,
                      style: VFont.sansStyle(size: 14.5, height: 1.58)),
                ],
              ],
            ),
          ),
        ],
      ],
    );
  }
}
