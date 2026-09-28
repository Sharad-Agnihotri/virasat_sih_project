import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;

import '../config.dart';

/// Talks to the Virasat proxy (`/api/*`) that fronts the AI models.
///
/// Every call returns a typed result rather than throwing, because each of
/// these can fail for a reason the visitor needs to see — the laptop is off,
/// the tunnel moved, the model is rate-limited — and the screens render
/// those differently from an empty state.
class Api {
  static final _client = http.Client();

  static Uri _u(String path) => Uri.parse('${AppConfig.baseUrl}$path');

  /// Identify the monument in a photograph.
  static Future<IdentifyResult> identify(
    String base64Jpeg, {
    String? hint,
  }) async {
    try {
      final res = await _client
          .post(
            _u('/api/identify'),
            headers: const {'Content-Type': 'application/json'},
            body: jsonEncode({
              'image': 'data:image/jpeg;base64,$base64Jpeg',
              if (hint != null && hint.isNotEmpty) 'hint': hint,
            }),
          )
          // Vision runs take a while; well past a default client timeout.
          .timeout(const Duration(seconds: 60));

      final body = jsonDecode(res.body);
      if (res.statusCode != 200) {
        return IdentifyResult.failed(_message(body, res.statusCode));
      }
      return IdentifyResult.fromJson(body as Map<String, dynamic>);
    } on SocketException {
      return IdentifyResult.failed(_offline);
    } catch (e) {
      return IdentifyResult.failed('Could not identify the photo. $e');
    }
  }

  /// One turn of conversation with the heritage guide.
  static Future<ChatResult> chat(List<ChatMessage> history,
      {String? context}) async {
    final messages = <Map<String, String>>[
      {
        'role': 'system',
        'content': _systemPrompt + (context == null ? '' : '\n\n$context'),
      },
      for (final m in history)
        {'role': m.fromUser ? 'user' : 'assistant', 'content': m.text},
    ];

    try {
      final res = await _client
          .post(
            _u('/api/chat'),
            headers: const {'Content-Type': 'application/json'},
            body: jsonEncode({'messages': messages}),
          )
          .timeout(const Duration(seconds: 45));

      final body = jsonDecode(res.body);
      if (res.statusCode != 200) {
        return ChatResult.failed(_message(body, res.statusCode));
      }
      final text = (((body['choices'] as List?)?.firstOrNull
              as Map<String, dynamic>?)?['message']
          as Map<String, dynamic>?)?['content'] as String?;
      if (text == null || text.trim().isEmpty) {
        return ChatResult.failed('The guide had nothing to say. Try again.');
      }
      return ChatResult.ok(text.trim());
    } on SocketException {
      return ChatResult.failed(_offline);
    } catch (e) {
      return ChatResult.failed('Could not reach the guide. $e');
    }
  }

  static const _offline =
      'Cannot reach Virasat. Check that the server is running, or update the '
      'address under More → Server address.';

  static String _message(dynamic body, int status) {
    if (body is Map && body['error'] is Map) {
      final m = (body['error'] as Map)['message'];
      if (m is String && m.trim().isNotEmpty) return m;
    }
    return 'The server replied $status.';
  }

  static const _systemPrompt =
      'You are the Virasat heritage guide: a knowledgeable, warm companion '
      'for Indian monuments, crafts, festivals and food. Answer in clear, '
      'specific prose — names, dynasties, dates, materials — never padding. '
      'Keep replies under 120 words unless the visitor asks for a plan or '
      'itinerary. If you are not certain of a fact, say so rather than '
      'inventing one. Reply in the language the visitor writes in. '
      'Formatting: this is a chat bubble on a phone, not a document. Write '
      'plain sentences. For a list, put each item on its own line starting '
      'with "— ". Never use markdown: no **bold**, no *italics*, no # '
      'headings, no tables.';
}

class IdentifyResult {
  const IdentifyResult({
    required this.identified,
    required this.monument,
    required this.city,
    required this.state,
    required this.country,
    required this.confidence,
    required this.builtBy,
    required this.era,
    required this.summary,
    required this.alternatives,
    this.error,
  });

  final bool identified;
  final String monument;
  final String city;
  final String state;
  final String country;
  final int confidence;
  final String builtBy;
  final String era;
  final String summary;
  final List<String> alternatives;

  /// Set when the call itself failed, as opposed to the model declining to
  /// name the monument.
  final String? error;

  bool get failed => error != null;

  factory IdentifyResult.failed(String message) => IdentifyResult(
        identified: false,
        monument: '',
        city: '',
        state: '',
        country: '',
        confidence: 0,
        builtBy: '',
        era: '',
        summary: '',
        alternatives: const [],
        error: message,
      );

  factory IdentifyResult.fromJson(Map<String, dynamic> j) => IdentifyResult(
        identified: j['identified'] == true,
        monument: j['monument'] as String? ?? '',
        city: j['city'] as String? ?? '',
        state: j['state'] as String? ?? '',
        country: j['country'] as String? ?? '',
        confidence: (j['confidence'] as num?)?.toInt() ?? 0,
        builtBy: j['builtBy'] as String? ?? '',
        era: j['era'] as String? ?? '',
        summary: j['summary'] as String? ?? '',
        alternatives:
            (j['alternatives'] as List?)?.whereType<String>().toList() ??
                const [],
      );
}

class ChatMessage {
  const ChatMessage({required this.text, required this.fromUser});
  final String text;
  final bool fromUser;
}

class ChatResult {
  const ChatResult._(this.text, this.error);
  factory ChatResult.ok(String text) => ChatResult._(text, null);
  factory ChatResult.failed(String message) => ChatResult._(null, message);

  final String? text;
  final String? error;
  bool get failed => error != null;
}

extension _FirstOrNull<E> on List<E> {
  E? get firstOrNull => isEmpty ? null : first;
}
