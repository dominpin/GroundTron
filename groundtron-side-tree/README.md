# GroundTron Side Tree

Rozszerzenie do Chrome / Brave / Firefox, które dokłada panel po prawej stronie `claude.ai`.
Wygląd i kolory te same co w modzie [groundtron-combo](https://github.com/dominpin/GroundTron).

## Co pokazuje

**Pliki** — drzewko plików dotkniętych w tej rozmowie, budowane z wywołań narzędzi
widocznych w zapisie rozmowy (`Read(...)`, `Edit(...)`, `Write(...)`, `Update(...)`,
`Grep`, `Glob`). Kolor mówi, co się z plikiem stało:

| | |
| --- | --- |
| `◦` niebieski | czytany |
| `●` glina | edytowany |
| `✚` zielony | utworzony |
| `·` szary | tylko wspomniany |

Gdy Claude właśnie otwiera albo zmienia plik, jego wiersz zapala się na kolor
działania i zostaje z paskiem z boku przez 8 sekund. Przełącznik **podążaj**
przewija drzewko do ostatnio dotkniętego pliku. Liczba po prawej to liczba dotknięć.

**Licznik u góry** — w duchu `cache-tax`: przybliżona wielkość wątku i czas
bezczynności, a z niego zgadywany stan cache (świeże / może być zimne / najpewniej
zimne). To **szacunki liczone z tego, co widać na stronie**. Rozszerzenie nie widzi
prawdziwego cache ani prawdziwej liczby tokenów, więc nie pokazuje kosztów w złotówkach
ani dolarach i niczego nie wysyła, żeby cache podtrzymać.

**Podpowiedzi** — zakładka do pisania promptów, oparta na trzech stronach Anthropica
(Prompt engineering overview, Prompting best practices, Prompt library). Piszesz prompt w polu
wiadomości, a sześć wzorców odhacza się samo na podstawie słów: czy opisujesz wynik, czy dajesz
sposób weryfikacji, punkt odniesienia, mierzalny cel, artefakt i format odpowiedzi. Wzorzec,
którego brakuje, pokazuje, po co jest, a kliknięcie wstawia przykład do pola. Pod spodem są
pięć gotowych promptów (klik wstawia je do pola) i zasady z dokumentacji. Odhaczenia liczone
są ze słów, więc to wskazówka, nie ocena promptu.

## Języki

Panel jest po polsku, angielsku, kaszubsku, śląsku i góralsku. Z GitHuba pobierasz tylko jeden język:
w katalogu [`dist`](../dist) leży po jednym zipie na język. Taka wersja zawiera teksty tylko jednego
języka i nie pokazuje listy wyboru. Cały folder `groundtron-side-tree` z repozytorium ma wszystkie pięć
języków i listę wyboru w prawym rogu paska zakładek (wybór zapamiętuje się w przeglądarce).

| Język | Zip do pobrania | README |
| --- | --- | --- |
| polski | `groundtron-side-tree-pl-polski.zip` | [pl](readme/pl.md) |
| English | `groundtron-side-tree-en-english.zip` | [en](readme/en.md) |
| kaszëbsczi | `groundtron-side-tree-csb-kaszubski.zip` | [csb](readme/csb.md) |
| ślōnski | `groundtron-side-tree-szl-slaski.zip` | [szl](readme/szl.md) |
| gôrolsko | `groundtron-side-tree-gor-goralski.zip` | [gor](readme/gor.md) |

Każdy zip ma własne README w swoim języku (pliki w [`readme`](readme)). Rozpakuj zip i wczytaj folder jak w instrukcji niżej. Teksty kaszubskie, śląskie i góralskie, także README, to staranna pierwsza wersja, bez sprawdzenia przez native speakera; teksty panelu poprawisz w plikach z katalogu `i18n`, po jednym na język. Zipy buduje `powershell -File tools/build-language-zips.ps1`.

## Instalacja

### Chrome / Brave

1. `chrome://extensions` (w Brave `brave://extensions`), włącz **Tryb dewelopera**.
2. **Załaduj rozpakowane** i wskaż ten folder.

Chrome wypisze ostrzeżenie o nieznanym kluczu `browser_specific_settings` —
to klucz dla Firefoksa, rozszerzenie działa mimo niego.

### Firefox

1. `about:debugging#/runtime/this-firefox`.
2. **Wczytaj tymczasowy dodatek** i wskaż `manifest.json` w tym folderze.

Tymczasowy dodatek znika po restarcie przeglądarki. Na stałe trzeba go podpisać
na `addons.mozilla.org`.

## Uprawnienia

Żadnych. W `manifest.json` nie ma sekcji `permissions`: rozszerzenie czyta tylko
stronę `claude.ai`, która i tak jest na ekranie, i zapisuje ustawienia panelu
(zwinięcie, zakładka, szerokość) w `localStorage` tej strony, pod kluczami `cst:`.
Nie wysyła niczego nigdzie.

## Czego nie sprawdziłem

- Rozszerzenie **testowałem tylko na własnej stronie testowej** (`test/harness.html`),
  nie na `claude.ai`. Sposób, w jaki zapis rozmowy pokazuje wywołania narzędzi, może
  się różnić i wtedy drzewko będzie puste albo niepełne.
- Drzewko ma sens tam, gdzie Claude dotyka plików, czyli w Claude Code w przeglądarce.
  W zwykłym czacie zwykle nie ma czego zbierać.
- Próg „zimnego cache" (5 minut, potem godzina) to moje założenie, nie odczyt.

## Test

```bash
python -m http.server 8731
```

i otwórz `http://127.0.0.1:8731/test/harness.html`. Strona udaje zapis rozmowy,
a przyciski u dołu dokładają wywołania narzędzi znak po znaku, jak przy streamowaniu.
Folder `test/` nie jest częścią rozszerzenia; przy wysyłce do sklepu można go pominąć.
