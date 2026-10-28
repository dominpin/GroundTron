// Material taken from the three saved Anthropic pages:
//   Prompt engineering overview, Prompting best practices, Prompt library (Claude Code).
// PATTERNS are checked against the draft in the composer; the checks are
// heuristics over the words you typed, never a judgement of the prompt.
globalThis.CST_DOCS = {
  // "What makes these prompts work" + the general principles.
  patterns: [
    {
      id: 'outcome',
      label: 'Opisz wynik, nie kroki',
      hint: 'Powiedz, co ma powstac, i pozwol Claude znalezc pliki. Jedno zdanie to zwykle za malo.',
      example: 'dodaj limitowanie zapytan do publicznego API i upewnij sie, ze istniejace testy nadal przechodza',
      test: t => t.trim().split(/\s+/).filter(Boolean).length >= 8,
    },
    {
      id: 'verify',
      label: 'Daj sposob weryfikacji',
      hint: 'Popros o uruchomienie, test lub porownanie w tym samym promptcie, zeby Claude poprawial sie sam.',
      example: 'napisz migracje, uruchom ja na bazie dev i potwierdz, ze schemat sie zgadza',
      test: t => /\b(uruchom|urucho|sprawdz|przetestuj|testy?|test|porownaj|zweryfikuj|potwierdz|run|test|verify|compare|confirm)\b/i.test(t),
    },
    {
      id: 'reference',
      label: 'Wskaz punkt odniesienia',
      hint: 'Nazwij istniejacy plik, test albo wzorzec, zeby nowy kod pasowal do reszty. Plik wskazesz przez @.',
      example: 'dodaj strone ustawien w takim ukladzie jak strona profilu',
      test: t => /@[\w./-]|[\w-]+\.[a-z]{1,8}\b|\b(jak w|wzoruj|tak samo jak|na wzor|same as|like the)\b/i.test(t),
    },
    {
      id: 'target',
      label: 'Podaj mierzalny cel',
      hint: 'Przy wydajnosci lub pokryciu podaj liczbe i prog, zeby bylo jasne, kiedy jest skonczone.',
      example: 'zejdz z rozmiarem bundla ponizej 200KB i pokaz, co usunales',
      test: t => /\d+\s*(%|kb|mb|gb|ms|s\b|sek|px|rem|tokenow|tokens|rows|wierszy)/i.test(t),
    },
    {
      id: 'artifact',
      label: 'Dolacz artefakt',
      hint: 'Wklej blad, log, zrzut ekranu albo wskaz plik przez @. Claude czyta zrodlo zamiast Twojego opisu zrodla.',
      example: 'dlaczego build sie wysypuje? @build.log',
      test: t => /@[\w./-]|```|\b(error|exception|traceback|stack trace|blad:|log|zrzut)\b/i.test(t),
    },
    {
      id: 'format',
      label: 'Powiedz, jak ma wygladac odpowiedz',
      hint: 'Nazwij format, dlugosc albo odbiorce, zeby odpowiedz pasowala do tego, jak jej uzyjesz.',
      example: 'wyjasnij logike ponawiania platnosci jako strone HTML z diagramem, potem otworz ja w przegladarce',
      test: t => /\b(punkt\w*|list[aeiyo]\w*|tabel\w*|html|markdown|diagram\w*|krotko|zwiez\w*|akapit\w*|format\w*|zdani\w*|bullet|table|short)\b/i.test(t),
    },
  ],

  // The five starter prompts from the Claude Code prompt library.
  starters: [
    { label: 'Poznaj repozytorium', text: 'give me an overview of this codebase: architecture, key directories, and how the pieces connect' },
    { label: 'Znajdz, gdzie cos sie dzieje', text: 'where do we validate uploaded file types?' },
    { label: 'Napraw padajacy test', text: 'the UserAuth test is failing, find out why and fix it' },
    { label: 'Napisz testy i je uruchom', text: 'write tests for app/parsers/feed.py, run them, and fix any failures' },
    { label: 'Przejrzyj zmiany przed commitem', text: 'review my uncommitted changes and flag anything that looks risky before I commit' },
  ],

  // The principles worth remembering, from Prompting best practices.
  principles: [
    ['Badz konkretny', 'Pokaz prompt komus bez kontekstu. Jesli on sie zgubi, Claude tez.'],
    ['Podaj powod', 'Wyjasnij, dlaczego czegos chcesz. "Nigdy nie uzywaj wielokropka" dziala gorzej niz to samo z uzasadnieniem.'],
    ['Dawaj przyklady', 'Od 3 do 5 przykladow, roznorodnych, kazdy w znacznikach <example>.'],
    ['Uzywaj znacznikow XML', 'Oddziel instrukcje, kontekst i dane: <instructions>, <context>, <input>.'],
    ['Dlugie dane na gorze', 'Przy duzych wejsciach (20k+ tokenow) najpierw dokumenty, pytanie na koncu.'],
    ['Nadaj role', 'Jedno zdanie roli w prompcie systemowym zmienia ton i zakres odpowiedzi.'],
  ],
};
