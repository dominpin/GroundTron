# Claude Side Tree

Rozsyrzynie do Chrome / Brave / Firefox, co dokłada panel po prawyj stronie `claude.ai`.
Wyglōnd i farby te same, co w modzie [cc-combo](https://github.com/dominpin/Ultron).

> To je piyrsa wersyjo tekstu po góralsku. Cekajom na przejrzenie przez prawdziwego gazdę godki.

## Co pokazuje

**Pliki** — drzewko plików, co były ruszane w tyj rozmowie, zrobione z wywołań
narzędzi, widocnych w zapisie rozmowy (`Read(...)`, `Edit(...)`, `Write(...)`, `Update(...)`,
`Grep`, `Glob`). Farba godo, co sie z plikiem stało:

| | |
| --- | --- |
| `◦` niebieski | cytany |
| `●` glina | poprawiany |
| `✚` zielony | zrobiony |
| `·` siwy | ino wspomnioany |

- Jak Claude akurat otwiyro abo zmiynio plik, jego wiersz sie zaświyci na farbe
  roboty i zostanie z pasem z boku na 8 sekund. Liba po prawyj to liba ruszań.
- Przełącnik **chodź za** przewijo drzewko do ostatnio ruszanego pliku.
- Kliknięcie w plik przewijo rozmowe do ostatniego miejsca, kie sie ten plik zjawio,
  i na chwile go podświytlo.
- Trójkąt przy katalogu zwijo go i rozwijo. Zwiniynie sie zapamiętuje w przeglądarce.

**Miernik na wirchu** — w duchu `cache-tax`: z grubsa wielkość wątku i cas postoju,
a z nich zgadnięty stan cache (świyże / mozno byc zimne / chyba zimne). To som **rachunki na
oko z tego, co widać na stronie**. Rozsyrzynie nie widzi prawdziwego cache ani prawdziwyj liby
tokenów, to nie pokazuje kosztów w pieniądzak i nic nie wysyłó, coby cache utrzymać.
Krzyzyk w tyj samyj linii zwijo cały panel.

**Pasek postępu** — pod miernikiem, w stylu paska ze Windows 7. Rozsyrzynie cyto ostatnio
liste zadań widocno w rozmowie (`[x]` / `[ ]` abo `☑` / `☐`). Bez takij listy paska nie ma,
bo procentu nie idzie zgadnąć. Liby widać w dymku, jak sie najedzie.

**Porady** — zakładka do pisania promptów, oparto na trzech stronak Anthropica
(Prompt engineering overview, Prompting best practices, Prompt library). Piśes prompt w polu
na wiadomość, a ses wzorów ptaśkuje sie samo ze słów: cy opisujes wynik, cy dajes sposób,
coby to sprawdzić, cy pokazujes, na cym sie wzorować, cel, co idzie zmierzyć, artefakt i format
odpowiedzi. Wzór, ktorego brakuje, pokazuje, po cosik je, a kliknięcie wstawio przykład do
pola. Pod spodem je pięć gotowych promptów (klik wstawio je do pola) i zasady z dokumentacji.
Ptaśki som licone ze słów, to ino porada, nie ocena promptu.

## Instalacyjo

### Chrome / Brave

1. `chrome://extensions` (w Brave `brave://extensions`), włącz **Tryb deweloperski**.
2. **Załaduj rozpakowane** i pokoz ten katalog.

Chrome wypisze ostrzeżynie o nieznanym kluczu `browser_specific_settings` — to je klucz
dlo Firefoxa, rozsyrzynie robi mimo niego.

### Firefox

1. `about:debugging#/runtime/this-firefox`.
2. **Wczytaj tymczasowy dodatek** i pokoz `manifest.json` w tym katalogu.

Tymczasowy dodatek zniko po restarcie przeglądarki. Na stałe trza go podpisać na
`addons.mozilla.org`.

## Prawa

Żodnyk. W `manifest.json` nie ma sekcji `permissions`: rozsyrzynie ino cyto strone
`claude.ai`, co je na ekranie, i zapisuje ustawiynia panelu (zwiniynie, zakładke, szyrokość,
zwiniynte katalogi) w `localStorage` tyj strony, pod kluckami `cst:`. Nic nikaj nie wysyłó.

## Cego nie sprawdziłem

- Rozsyrzynie **testowołek ino na swojyj testowyj stronie**, nie na `claude.ai`. Jak zapis
  rozmowy pokazuje wywołania narzędzi i listy zadań, mozno byc inaksy, i wtedy drzewko
  bedzie puste abo niepełne, a paska postępu nie bedzie.
- Drzewko ma sens tam, kaj Claude rusa pliki, cyli w Claude Code w przeglądarce.
  W zwykłym cacie casem nie ma co zbirać.
- Próg „zimnego cache" (5 minut, potem godzina) to moje założynie, nie odcyt.
