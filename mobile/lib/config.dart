import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Where the Virasat web platform + AI proxy are served from.
///
/// Set at build time with
///   flutter build apk --dart-define=VIRASAT_URL=https://your-host
/// or change it at runtime from the in-app settings sheet. The default is
/// the Cloudflare quick-tunnel in front of `node static_server.js`.
class AppConfig {
  static const _defineUrl = String.fromEnvironment(
    'VIRASAT_URL',
    defaultValue: 'https://uploaded-tablets-favor-led.trycloudflare.com',
  );
  static const _prefKey = 'virasat_base_url';

  static String baseUrl = _defineUrl;

  static Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    baseUrl = prefs.getString(_prefKey) ?? _defineUrl;
  }

  static Future<void> save(String url) async {
    baseUrl = url.trim().replaceAll(RegExp(r'/+$'), '');
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefKey, baseUrl);
  }

  static Uri page(String path) => Uri.parse('$baseUrl/$path');
}

/// One entry per tab. `page` is the HTML file served by static_server.js.
class VirasatScreen {
  const VirasatScreen(this.title, this.page, this.icon);
  final String title;
  final String page;
  final IconData icon;
}

const kScreens = <VirasatScreen>[
  VirasatScreen('Home', 'index.html', Icons.home_rounded),
  VirasatScreen('Explore', 'explore.html', Icons.map_rounded),
  VirasatScreen('Scan', 'scan.html', Icons.camera_alt_rounded),
  VirasatScreen('Market', 'marketplace.html', Icons.storefront_rounded),
  VirasatScreen('More', '', Icons.menu_rounded),
];

/// Everything reachable from the "More" tab.
const kMoreScreens = <VirasatScreen>[
  VirasatScreen('Community', 'community.html', Icons.forum_rounded),
  VirasatScreen('Events & Festivals', 'events.html', Icons.event_rounded),
  VirasatScreen('Language Studio', 'language.html', Icons.translate_rounded),
  VirasatScreen('VR Explorer', 'vr.html', Icons.vrpano_rounded),
  VirasatScreen('Report a Site', 'report.html', Icons.flag_rounded),
  VirasatScreen('Artisan Portal', 'artisan.html', Icons.handyman_rounded),
  VirasatScreen('Profile', 'profile.html', Icons.person_rounded),
  VirasatScreen('Sign in / Register', 'login.html', Icons.login_rounded),
];
