// Material taken from the three saved Anthropic pages:
//   Prompt engineering overview, Prompting best practices, Prompt library (Claude Code).
// The texts shown to the reader are in i18n.js, one set per language. What is
// left here is language-independent: the id of each pattern, its test, and the
// starter prompts, which are sent to Claude as they are.
//
// The tests run over the words you typed, after diacritics are stripped, so
// "uruchōm", "ùruchòmi" and "uruchom" all count alike. They are heuristics,
// never a judgement of the prompt.
globalThis.CST_DOCS = {
  patterns: [
    {
      id: 'outcome',
      test: t => t.trim().split(/\s+/).filter(Boolean).length >= 8,
    },
    {
      id: 'verify',
      test: t => /\b(uruchom|uruchomi|urucho|sprawdz|sprawdzi|przetestuj|przetestuji|testy?|test|porownaj|porownoj|zweryfikuj|potwierdz|potwierdzi|run|verify|compare|confirm)\b/i.test(t),
    },
    {
      id: 'reference',
      test: t => /@[\w./-]|[\w-]+\.[a-z]{1,8}\b|\b(jak w|wzoruj|tak samo jak|tak jak|ukladzie jak|na wzor|same as|like the|laid out like)\b/i.test(t),
    },
    {
      id: 'target',
      test: t => /\d+\s*(%|kb|mb|gb|ms|s\b|sek|px|rem|tokenow|tokens|rows|wierszy)/i.test(t),
    },
    {
      id: 'artifact',
      test: t => /@[\w./-]|```|\b(error|exception|traceback|stack trace|blad:|log|zrzut|fele|balond)\b/i.test(t),
    },
    {
      id: 'format',
      test: t => /\b(punkt\w*|list[aeiyo]\w*|tabel\w*|html|markdown|diagram\w*|krotko|zwiez\w*|akapit\w*|format\w*|zdani\w*|bullet|table|short)\b/i.test(t),
    },
  ],

  // The five starter prompts from the Claude Code prompt library. Their labels
  // are translated in i18n.js; the text goes into the box untranslated.
  starters: [
    'give me an overview of this codebase: architecture, key directories, and how the pieces connect',
    'where do we validate uploaded file types?',
    'the UserAuth test is failing, find out why and fix it',
    'write tests for app/parsers/feed.py, run them, and fix any failures',
    'review my uncommitted changes and flag anything that looks risky before I commit',
  ],
};
