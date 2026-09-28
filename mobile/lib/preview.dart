// Design preview entry point: renders the native screens without the
// WebView plugin, so the UI can be inspected in a browser at phone size.
import 'package:flutter/material.dart';

import 'design/heritage_backdrop.dart';
import 'design/theme.dart';
import 'design/tokens.dart';
import 'data/city.dart';
import 'screens/city_screen.dart';
import 'screens/explore_screen.dart';
import 'screens/home_screen.dart';
import 'screens/intro_screen.dart';

void main() => runApp(const PreviewApp());

/// `?city=jaipur&tab=2` opens that section directly, so every screen can be
/// inspected without driving the UI.
Widget? _deepLink() {
  final q = Uri.base.queryParameters;
  final id = q['city'];
  if (id == null) return null;
  final tab = int.tryParse(q['tab'] ?? '0') ?? 0;
  return FutureBuilder<List<City>>(
    future: CityRepository.load(),
    builder: (_, snap) {
      if (!snap.hasData) return const SizedBox.shrink();
      final city = snap.data!
          .firstWhere((c) => c.id == id, orElse: () => snap.data!.first);
      return CityScreen(city: city, initialTab: tab);
    },
  );
}

class PreviewApp extends StatefulWidget {
  const PreviewApp({super.key});
  @override
  State<PreviewApp> createState() => _PreviewAppState();
}

class _PreviewAppState extends State<PreviewApp> {
  int _index = 0;
  bool _intro = true;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: buildVirasatTheme(),
      home: _deepLink() ?? _shell(),
    );
  }

  Widget _shell() {
    if (_intro) {
      return IntroScreen(onDone: () => setState(() => _intro = false));
    }
    return Scaffold(
      body: switch (_index) {
        0 => HomeScreen(onOpenPage: (_, __) {}),
        1 => const ExploreScreen(),
        _ => HeritageBackdrop(
            child: Center(child: Text('Coming next', style: VFont.title))),
      },
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: VColor.hairline, width: 1)),
        ),
        child: NavigationBar(
          selectedIndex: _index,
          onDestinationSelected: (i) => setState(() => _index = i),
          destinations: const [
            NavigationDestination(
                icon: Icon(Icons.auto_stories_outlined),
                selectedIcon: Icon(Icons.auto_stories_rounded),
                label: 'Home'),
            NavigationDestination(
                icon: Icon(Icons.map_outlined),
                selectedIcon: Icon(Icons.map_rounded),
                label: 'Explore'),
            NavigationDestination(
                icon: Icon(Icons.center_focus_weak_rounded),
                selectedIcon: Icon(Icons.center_focus_strong_rounded),
                label: 'Scan'),
            NavigationDestination(
                icon: Icon(Icons.storefront_outlined),
                selectedIcon: Icon(Icons.storefront_rounded),
                label: 'Market'),
            NavigationDestination(
                icon: Icon(Icons.grid_view_outlined),
                selectedIcon: Icon(Icons.grid_view_rounded),
                label: 'More'),
          ],
        ),
      ),
    );
  }
}
