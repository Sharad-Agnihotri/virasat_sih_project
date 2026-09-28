import 'dart:convert';

import 'package:flutter/services.dart';

/// The Explore City dataset, bundled with the app so the screen opens
/// instantly and works offline. Photographs stay on the server and are
/// fetched by URL — bundling them would add hundreds of megabytes.
class City {
  const City({
    required this.id,
    required this.name,
    required this.state,
    required this.shortDesc,
    required this.historyStory,
    required this.languages,
    required this.places,
    required this.crafts,
    required this.festivals,
    required this.food,
    required this.artisans,
  });

  final String id;
  final String name;
  final String state;
  final String shortDesc;
  final String historyStory;
  final List<String> languages;
  final List<Place> places;
  final List<Craft> crafts;
  final List<Festival> festivals;
  final List<Dish> food;
  final List<Artisan> artisans;

  /// The city's lead photograph: the first place that has one.
  String? get heroImage {
    for (final p in places) {
      if (p.image.isNotEmpty) return p.image;
    }
    return null;
  }

  static List<T> _list<T>(dynamic v, T Function(Map<String, dynamic>) f) =>
      (v as List?)
          ?.whereType<Map<String, dynamic>>()
          .map(f)
          .toList(growable: false) ??
      const [];

  factory City.fromJson(Map<String, dynamic> j) => City(
        id: j['id'] as String? ?? '',
        name: j['name'] as String? ?? '',
        state: j['state'] as String? ?? '',
        shortDesc: j['shortDesc'] as String? ?? '',
        historyStory: j['historyStory'] as String? ?? '',
        languages: (j['languageSpoken'] as List?)
                ?.whereType<String>()
                .toList(growable: false) ??
            const [],
        places: _list(j['placesToVisit'], Place.fromJson),
        crafts: _list(j['crafts'], Craft.fromJson),
        festivals: _list(j['festivals'], Festival.fromJson),
        food: _list(j['food'], Dish.fromJson),
        artisans: _list(j['artisans'], Artisan.fromJson),
      );
}

class Place {
  const Place({required this.name, required this.desc, required this.image});
  final String name;
  final String desc;
  final String image;

  factory Place.fromJson(Map<String, dynamic> j) => Place(
        name: j['name'] as String? ?? '',
        desc: j['desc'] as String? ?? '',
        image: j['image'] as String? ?? '',
      );
}

class Craft {
  const Craft({
    required this.name,
    required this.desc,
    required this.story,
    required this.image,
  });
  final String name;
  final String desc;
  final String story;
  final String image;

  factory Craft.fromJson(Map<String, dynamic> j) => Craft(
        name: j['name'] as String? ?? '',
        desc: j['desc'] as String? ?? '',
        story: j['story'] as String? ?? '',
        image: j['image'] as String? ?? '',
      );
}

class Festival {
  const Festival({
    required this.name,
    required this.month,
    required this.desc,
  });
  final String name;
  final String month;
  final String desc;

  factory Festival.fromJson(Map<String, dynamic> j) => Festival(
        name: j['name'] as String? ?? '',
        month: j['month'] as String? ?? '',
        desc: j['desc'] as String? ?? '',
      );
}

class Dish {
  const Dish({
    required this.name,
    required this.desc,
    required this.story,
    required this.image,
  });
  final String name;
  final String desc;
  final String story;
  final String image;

  factory Dish.fromJson(Map<String, dynamic> j) => Dish(
        name: j['name'] as String? ?? '',
        desc: j['desc'] as String? ?? '',
        story: j['story'] as String? ?? '',
        image: j['image'] as String? ?? '',
      );
}

class Artisan {
  const Artisan({
    required this.name,
    required this.craft,
    required this.bio,
    required this.photo,
    required this.years,
  });
  final String name;
  final String craft;
  final String bio;
  final String photo;
  final int years;

  factory Artisan.fromJson(Map<String, dynamic> j) => Artisan(
        name: j['name'] as String? ?? '',
        craft: j['craftSpecialty'] as String? ?? '',
        bio: j['bio'] as String? ?? '',
        photo: j['photo'] as String? ?? '',
        years: (j['yearsOfExperience'] as num?)?.toInt() ?? 0,
      );
}

/// Loads the dataset once and keeps it for the life of the process.
class CityRepository {
  static List<City>? _cache;

  static Future<List<City>> load() async {
    final cached = _cache;
    if (cached != null) return cached;
    final raw = await rootBundle.loadString('assets/data/cities.json');
    final list = (jsonDecode(raw) as List)
        .whereType<Map<String, dynamic>>()
        .map(City.fromJson)
        .toList(growable: false);
    _cache = list;
    return list;
  }

  /// Name, state and craft names all match, so "pottery" finds Jaipur.
  static List<City> search(List<City> cities, String query) {
    final q = query.trim().toLowerCase();
    if (q.isEmpty) return cities;
    return cities.where((c) {
      if (c.name.toLowerCase().contains(q)) return true;
      if (c.state.toLowerCase().contains(q)) return true;
      if (c.shortDesc.toLowerCase().contains(q)) return true;
      if (c.crafts.any((x) => x.name.toLowerCase().contains(q))) return true;
      if (c.places.any((x) => x.name.toLowerCase().contains(q))) return true;
      if (c.food.any((x) => x.name.toLowerCase().contains(q))) return true;
      return false;
    }).toList(growable: false);
  }
}
