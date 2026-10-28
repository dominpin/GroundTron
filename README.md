# GroundTron: moje narzędzia do Claude

Dwie rzeczy w tym samym wyglądzie: mod do Claude Code i rozszerzenie do przeglądarki.

## groundtron-combo (mod do Claude Code)

Plugin marketplace (`groundtron`) z jednym modem, **groundtron-combo**: savvy-progress, filetree,
cache-tax i blast-radius w jednej wtyczce ze wspólną paletą. Pasek postępu nad promptem
jest w stylu paska z Windows 7, a skill `task-progress` włącza go przy każdym zadaniu
z co najmniej trzema krokami.
Opis w [groundtron-combo/README.md](groundtron-combo/README.md).

Potrzebny Claude Code 2.1.287 lub nowszy (`claude update`). W Claude Code:

```
/plugin marketplace add dominpin/GroundTron
/plugin install groundtron-combo@groundtron
```

Wybierz zakres **user**, żeby ładował się w każdej sesji.

## groundtron-side-tree (rozszerzenie do przeglądarki)

Panel po prawej stronie `claude.ai`: drzewko plików dotkniętych w rozmowie
z podświetlaniem na żywo (klik w plik przewija rozmowę do jego ostatniej wzmianki,
a trójkąt przy folderze go zwija), miernik bezczynności wątku w duchu cache-tax, pasek
postępu z listy zadań i zakładka z podpowiedziami do pisania promptów, opartymi na
dokumentacji Anthropica. Bez żadnych uprawnień, nic nie wysyła.

Rozszerzenie jest po polsku, angielsku, kaszubsku, śląsku i góralsku. Z GitHuba pobierasz
tylko jeden język, jako zip z katalogu [`dist`](dist) z własnym README:

| Język | Zip do pobrania |
| --- | --- |
| Polski | [`groundtron-side-tree-pl-polski.zip`](dist/groundtron-side-tree-pl-polski.zip) |
| English | [`groundtron-side-tree-en-english.zip`](dist/groundtron-side-tree-en-english.zip) |
| Kaszëbsczi | [`groundtron-side-tree-csb-kaszubski.zip`](dist/groundtron-side-tree-csb-kaszubski.zip) |
| Ślōnski | [`groundtron-side-tree-szl-slaski.zip`](dist/groundtron-side-tree-szl-slaski.zip) |
| Gôrolsko | [`groundtron-side-tree-gor-goralski.zip`](dist/groundtron-side-tree-gor-goralski.zip) |

Instalacja, uprawnienia i ograniczenia w [groundtron-side-tree/README.md](groundtron-side-tree/README.md).
Teksty kaszubskie, śląskie i góralskie to pierwsza wersja, jeszcze bez sprawdzenia przez
native speakera.
