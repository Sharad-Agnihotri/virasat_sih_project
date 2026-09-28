/// Editorial content for the native screens.
///
/// Mirrors the data the web platform serves, kept here so the shell renders
/// instantly and offline. Anything that must stay in sync with the backend
/// (prices, live events) is fetched; this is the durable stuff.
class Destination {
  const Destination({
    required this.id,
    required this.name,
    required this.region,
    required this.tagline,
    required this.image,
    required this.era,
    this.unesco = false,
  });

  final String id;
  final String name;
  final String region;
  final String tagline;
  final String image;
  final String era;
  final bool unesco;
}

const kDestinations = <Destination>[
  Destination(
    id: 'taj-mahal',
    name: 'Taj Mahal',
    region: 'Agra, Uttar Pradesh',
    tagline: 'A marble elegy, twenty-two years in the making',
    image: 'assets/heritage/taj.webp',
    era: '1632–1653',
    unesco: true,
  ),
  Destination(
    id: 'hampi',
    name: 'Hampi',
    region: 'Ballari, Karnataka',
    tagline: 'The stone capital of Vijayanagara',
    image: 'assets/heritage/hampi.webp',
    era: '14th century',
    unesco: true,
  ),
  Destination(
    id: 'mysore-palace',
    name: 'Mysore Palace',
    region: 'Mysuru, Karnataka',
    tagline: 'Ninety-seven thousand bulbs, every Sunday',
    image: 'assets/heritage/mysore.webp',
    era: '1912',
  ),
  Destination(
    id: 'red-fort',
    name: 'Red Fort',
    region: 'Delhi',
    tagline: 'Where the tricolour rises each Independence Day',
    image: 'assets/heritage/redfort.webp',
    era: '1639',
    unesco: true,
  ),
  Destination(
    id: 'gateway-of-india',
    name: 'Gateway of India',
    region: 'Mumbai, Maharashtra',
    tagline: 'The arch that watched an empire leave',
    image: 'assets/heritage/gateway.webp',
    era: '1924',
  ),
];

/// The four things a visitor can actually *do*, surfaced on the home screen.
class QuickAction {
  const QuickAction(this.id, this.title, this.subtitle, this.page);
  final String id;
  final String title;
  final String subtitle;

  /// Page on the web platform this action opens, until it is ported native.
  final String page;
}

const kQuickActions = <QuickAction>[
  QuickAction('scan', 'Scan a monument', 'Point your camera, get its story',
      'scan.html'),
  QuickAction('vr', 'Walk it in 360°', 'Guided virtual tours', 'vr.html'),
  QuickAction('market', 'Artisan market', 'GI-tagged crafts, direct',
      'marketplace.html'),
  QuickAction('language', 'Speak the region', 'Phrases that open doors',
      'language.html'),
];

/// Craft traditions — the marketplace's editorial hook.
class Craft {
  const Craft(this.name, this.origin, this.note);
  final String name;
  final String origin;
  final String note;
}

const kCrafts = <Craft>[
  Craft('Blue Pottery', 'Jaipur, Rajasthan',
      'Fired without clay — quartz, glass and fuller\'s earth.'),
  Craft('Banarasi Silk', 'Varanasi, Uttar Pradesh',
      'A single sari can hold three weavers for a month.'),
  Craft('Pashmina', 'Srinagar, Jammu & Kashmir',
      'Spun from the winter undercoat of the changthangi goat.'),
  Craft('Ajrakh', 'Rann of Kutch, Gujarat',
      'Sixteen stages of resist-printing, all by hand.'),
];
