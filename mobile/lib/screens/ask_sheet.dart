import 'package:flutter/material.dart';

import '../data/api.dart';
import '../design/tokens.dart';

/// The heritage guide, as a sheet that can be opened from anywhere.
///
/// It takes a `context` string describing what the visitor is looking at, so
/// the same guide answers differently on a city page, after a scan, or from
/// the home screen — which is what makes it feel like a companion rather
/// than a generic chatbot.
class AskSheet extends StatefulWidget {
  const AskSheet({
    super.key,
    required this.systemContext,
    required this.opener,
    this.suggestions = const [],
  });

  final String systemContext;
  final String opener;
  final List<String> suggestions;

  static Future<void> open(
    BuildContext context, {
    required String about,
    required String opener,
    List<String> suggestions = const [],
  }) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: VColor.surface,
      builder: (_) => AskSheet(
        systemContext: about,
        opener: opener,
        suggestions: suggestions,
      ),
    );
  }

  @override
  State<AskSheet> createState() => _AskSheetState();
}

class _AskSheetState extends State<AskSheet> {
  final _input = TextEditingController();
  final _scroll = ScrollController();
  final _messages = <ChatMessage>[];
  bool _busy = false;
  String? _error;

  @override
  void dispose() {
    _input.dispose();
    _scroll.dispose();
    super.dispose();
  }

  Future<void> _send([String? preset]) async {
    final text = (preset ?? _input.text).trim();
    if (text.isEmpty || _busy) return;

    setState(() {
      _messages.add(ChatMessage(text: text, fromUser: true));
      _input.clear();
      _busy = true;
      _error = null;
    });
    _toBottom();

    final result = await Api.chat(_messages, context: widget.systemContext);
    if (!mounted) return;

    setState(() {
      _busy = false;
      if (result.failed) {
        _error = result.error;
      } else {
        _messages.add(ChatMessage(text: result.text!, fromUser: false));
      }
    });
    _toBottom();
  }

  void _toBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!_scroll.hasClients) return;
      _scroll.animateTo(
        _scroll.position.maxScrollExtent,
        duration: const Duration(milliseconds: 280),
        curve: Curves.easeOut,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    // The sheet sits above the keyboard rather than behind it.
    final inset = MediaQuery.of(context).viewInsets.bottom;

    return Padding(
      padding: EdgeInsets.only(bottom: inset),
      child: FractionallySizedBox(
        heightFactor: 0.92,
        child: Column(
          children: [
            const _SheetHeader(),
            const Divider(height: 1),
            Expanded(
              child: ListView(
                controller: _scroll,
                padding: const EdgeInsets.fromLTRB(
                    VSpace.gutter, VSpace.lg, VSpace.gutter, VSpace.lg),
                children: [
                  _Bubble(text: widget.opener, fromUser: false),
                  for (final m in _messages) ...[
                    const SizedBox(height: VSpace.md),
                    _Bubble(text: m.text, fromUser: m.fromUser),
                  ],
                  if (_busy) ...[
                    const SizedBox(height: VSpace.md),
                    const _Typing(),
                  ],
                  if (_error != null) ...[
                    const SizedBox(height: VSpace.md),
                    _ErrorNote(message: _error!),
                  ],
                  if (_messages.isEmpty && widget.suggestions.isNotEmpty) ...[
                    const SizedBox(height: VSpace.lg),
                    _Suggestions(
                        items: widget.suggestions, onTap: (s) => _send(s)),
                  ],
                ],
              ),
            ),
            _Composer(
              controller: _input,
              busy: _busy,
              onSend: _send,
            ),
          ],
        ),
      ),
    );
  }
}

class _SheetHeader extends StatelessWidget {
  const _SheetHeader();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding:
          const EdgeInsets.fromLTRB(VSpace.gutter, 0, VSpace.sm, VSpace.md),
      child: Row(
        children: [
          Image.asset('assets/heritage/logo_ink.png',
              height: 24,
              errorBuilder: (_, __, ___) => const SizedBox(height: 24)),
          const SizedBox(width: VSpace.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text('Virasat Guide',
                    style: VFont.sansStyle(
                        size: 15.5, weight: 700, color: VColor.ink)),
                Text('Ask about anything you are looking at',
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

class _Bubble extends StatelessWidget {
  const _Bubble({required this.text, required this.fromUser});
  final String text;
  final bool fromUser;

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: fromUser ? Alignment.centerRight : Alignment.centerLeft,
      child: ConstrainedBox(
        // Never full width: a bubble that reaches both edges stops reading
        // as a turn in a conversation.
        constraints:
            BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.82),
        child: Container(
          padding: const EdgeInsets.symmetric(
              horizontal: VSpace.lg, vertical: VSpace.md),
          decoration: BoxDecoration(
            color: fromUser ? VColor.terracotta : VColor.surfaceMuted,
            borderRadius: BorderRadius.only(
              topLeft: const Radius.circular(VRadius.md),
              topRight: const Radius.circular(VRadius.md),
              bottomLeft: Radius.circular(fromUser ? VRadius.md : 4),
              bottomRight: Radius.circular(fromUser ? 4 : VRadius.md),
            ),
          ),
          child: SelectableText.rich(
            _spans(
              text,
              VFont.sansStyle(
                size: 14.5,
                height: 1.55,
                color: fromUser ? Colors.white : VColor.ink,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Models are told not to emit markdown, but they sometimes do anyway.
/// Rather than showing raw asterisks in a chat bubble, render the two
/// inline forms that actually turn up and drop the rest.
TextSpan _spans(String raw, TextStyle base) {
  // Headings and list bullets become plain lines; only inline emphasis is
  // worth carrying through to a bubble.
  final text = raw
      .replaceAll(RegExp(r'^#{1,6}\s*', multiLine: true), '')
      .replaceAll(RegExp(r'^\s*[-*]\s+', multiLine: true), '— ');

  final children = <TextSpan>[];
  final pattern =
      RegExp(r'\*\*(.+?)\*\*|\*(.+?)\*|__(.+?)__|_(.+?)_', dotAll: true);
  var index = 0;
  for (final m in pattern.allMatches(text)) {
    if (m.start > index) {
      children.add(TextSpan(text: text.substring(index, m.start)));
    }
    final bold = m.group(1) ?? m.group(3);
    final italic = m.group(2) ?? m.group(4);
    children.add(TextSpan(
      text: bold ?? italic ?? '',
      style: bold != null
          ? const TextStyle(fontWeight: FontWeight.w700)
          : const TextStyle(fontStyle: FontStyle.italic),
    ));
    index = m.end;
  }
  if (index < text.length) {
    children.add(TextSpan(text: text.substring(index)));
  }
  return TextSpan(style: base, children: children);
}

class _Typing extends StatefulWidget {
  const _Typing();
  @override
  State<_Typing> createState() => _TypingState();
}

class _TypingState extends State<_Typing> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1100),
  )..repeat();

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        padding: const EdgeInsets.symmetric(
            horizontal: VSpace.lg, vertical: VSpace.lg),
        decoration: BoxDecoration(
          color: VColor.surfaceMuted,
          borderRadius: BorderRadius.circular(VRadius.md),
        ),
        child: AnimatedBuilder(
          animation: _c,
          builder: (_, __) => Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              for (var i = 0; i < 3; i++) ...[
                if (i > 0) const SizedBox(width: 5),
                Opacity(
                  opacity: 0.3 +
                      0.7 *
                          ((((_c.value * 3) - i) % 3).clamp(0.0, 1.0) > 0.5
                              ? 1.0
                              : 0.0),
                  child: const CircleAvatar(
                      radius: 3.2, backgroundColor: VColor.inkMuted),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _ErrorNote extends StatelessWidget {
  const _ErrorNote({required this.message});
  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(VSpace.lg),
      decoration: BoxDecoration(
        color: VColor.terracottaWash,
        borderRadius: BorderRadius.circular(VRadius.md),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.error_outline_rounded,
              size: 18, color: VColor.terracotta),
          const SizedBox(width: VSpace.md),
          Expanded(
            child: Text(message,
                style: VFont.sansStyle(
                    size: 13.5, height: 1.5, color: VColor.terracottaDark)),
          ),
        ],
      ),
    );
  }
}

class _Suggestions extends StatelessWidget {
  const _Suggestions({required this.items, required this.onTap});
  final List<String> items;
  final ValueChanged<String> onTap;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('TRY ASKING', style: VFont.eyebrow),
        const SizedBox(height: VSpace.md),
        for (final s in items)
          Padding(
            padding: const EdgeInsets.only(bottom: VSpace.sm),
            child: InkWell(
              onTap: () => onTap(s),
              borderRadius: BorderRadius.circular(VRadius.md),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(
                    horizontal: VSpace.lg, vertical: VSpace.md),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(VRadius.md),
                  border: Border.all(color: VColor.hairline),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(s,
                          style: VFont.sansStyle(
                              size: 14, color: VColor.ink, height: 1.4)),
                    ),
                    const Icon(Icons.north_east_rounded,
                        size: 15, color: VColor.inkMuted),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class _Composer extends StatelessWidget {
  const _Composer({
    required this.controller,
    required this.busy,
    required this.onSend,
  });

  final TextEditingController controller;
  final bool busy;
  final VoidCallback onSend;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(
        VSpace.gutter,
        VSpace.md,
        VSpace.md,
        VSpace.md + MediaQuery.of(context).padding.bottom * 0.5,
      ),
      decoration: const BoxDecoration(
        color: VColor.surface,
        border: Border(top: BorderSide(color: VColor.hairline)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Expanded(
            child: TextField(
              controller: controller,
              minLines: 1,
              maxLines: 4,
              textInputAction: TextInputAction.send,
              onSubmitted: (_) => onSend(),
              style: VFont.sansStyle(size: 15, color: VColor.ink),
              decoration: const InputDecoration(
                hintText: 'Ask about this place…',
                contentPadding: EdgeInsets.symmetric(
                    horizontal: VSpace.lg, vertical: VSpace.md),
              ),
            ),
          ),
          const SizedBox(width: VSpace.sm),
          Material(
            color: busy ? VColor.surfaceMuted : VColor.terracotta,
            shape: const CircleBorder(),
            clipBehavior: Clip.antiAlias,
            child: InkWell(
              onTap: busy ? null : onSend,
              child: SizedBox(
                width: 46,
                height: 46,
                child: Icon(
                  Icons.arrow_upward_rounded,
                  size: 20,
                  color: busy ? VColor.inkMuted : Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
