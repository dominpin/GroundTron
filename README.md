# Ultron: moje narzędzia do Claude

Dwie rzeczy w tym samym wyglądzie: mod do Claude Code i rozszerzenie do przeglądarki.

## cc-combo (mod do Claude Code)

Plugin marketplace (`my-mods`) z jednym modem, **cc-combo**: savvy-progress, filetree,
cache-tax i blast-radius w jednej wtyczce ze wspólną paletą. Pasek postępu nad promptem
jest w stylu paska z Windows 7, a skill `task-progress` włącza go przy każdym zadaniu
z co najmniej trzema krokami.
Opis w [cc-combo/README.md](cc-combo/README.md).

Potrzebny Claude Code 2.1.287 lub nowszy (`claude update`). W Claude Code:

```
/plugin marketplace add dominpin/Ultron
/plugin install cc-combo@my-mods
```

Wybierz zakres **user**, żeby ładował się w każdej sesji.

## claude-side-tree (rozszerzenie do przeglądarki)

Panel po prawej stronie `claude.ai`: drzewko plików dotkniętych w rozmowie
z podświetlaniem na żywo (klik w plik przewija rozmowę do jego ostatniej wzmianki,
a trójkąt przy folderze go zwija), miernik bezczynności wątku w duchu cache-tax, pasek
postępu z listy zadań i zakładka z podpowiedziami do pisania promptów, opartymi na
dokumentacji Anthropica. Bez żadnych uprawnień, nic nie wysyła.

Rozszerzenie jest po polsku, angielsku, kaszubsku, śląsku i góralsku. Z GitHuba pobierasz
tylko jeden język, jako zip z katalogu [`dist`](dist) z własnym README:

| Język | Zip do pobrania |
| --- | --- |
| polski | [`claude-side-tree-pl-polski.zip`](dist/claude-side-tree-pl-polski.zip) |
| English | [`claude-side-tree-en-english.zip`](dist/claude-side-tree-en-english.zip) |
| kaszëbsczi | [`claude-side-tree-csb-kaszubski.zip`](dist/claude-side-tree-csb-kaszubski.zip) |
| ślōnski | [`claude-side-tree-szl-slaski.zip`](dist/claude-side-tree-szl-slaski.zip) |
| gôrolsko | [`claude-side-tree-gor-goralski.zip`](dist/claude-side-tree-gor-goralski.zip) |

Instalacja, uprawnienia i ograniczenia w [claude-side-tree/README.md](claude-side-tree/README.md).
Teksty kaszubskie, śląskie i góralskie to pierwsza wersja, jeszcze bez sprawdzenia przez
native speakera.
