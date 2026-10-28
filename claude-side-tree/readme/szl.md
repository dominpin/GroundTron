# Claude Side Tree

Rozszyrzynie do Chrome / Brave / Firefox, kere dokłado panel po prawyj zajtce `claude.ai`.
Wyglōnd i farby te same, co w modzie [cc-combo](https://github.com/dominpin/Ultron).

> To je piyrsza wersyjŏ tekstu po ślōnsku. Czeko na przejzdrzyniy bez ôrygynalnygo godŏcza.

## Co pokazuje

**Pliki** — drzewko plikōw, kere były ruszane w tyj rozmowie, zrobiōne ze wywołań
noczynia, widocznych w zapisie rozmowy (`Read(...)`, `Edit(...)`, `Write(...)`, `Update(...)`,
`Grep`, `Glob`). Farba pado, co sie ze plikym stało:

| | |
| --- | --- |
| `◦` niebieski | czytany |
| `●` glina | edytowany |
| `✚` zielōny | zrobiōny |
| `·` szary | yno wspōmniany |

- Jak Claude akuratnie ôtwiyro abo zmiyniŏ plik, jego wiersz sie zaświyci na farbã
  dziaułaniŏ i zostanie z pasym z boku na 8 sekund. Liczba po prawyj to liczba ruszań.
- Przełōnczka **idź za** przewijo drzewko do ôstatnio ruszanego pliku.
- Kliknyniy na plik przewijo rozmowã do ôstatnigo placu, kaj sie tyn plik zjawio,
  i na chwila go podświytlo.
- Trōjkōnt przi katalogu zwijo go i rozwijo. Zwiniyniy sie spamiyntuje w przeglōndarce.

**Miernik na wiyrchu** — w duchu `cache-tax`: przibliżōno wielkość wōntku i czas bezczynności,
a ze nich zgadniynty stan cache (świyże / mŏże być zimne / nojpewniyj zimne). To sōm **szacunki
liczōne z tego, co widać na zajtce**. Rozszyrzynie niy widzi prawdziwego cache ani prawdziwyj
liczby tokenōw, tōż niy pokazuje kosztōw we pieniōndzach i niczego niy wysyłŏ, coby cache
utrzymać. Krziż we tyj samyj linii zwijo cołki panel.

**Pasek postympu** — pod miernikym, w stylu paska ze Windows 7. Rozszyrzynie czyto ôstatniõ
listã zadań widocznõ w rozmowie (`[x]` / `[ ]` abo `☑` / `☐`). Bez tako listy paska niy ma, bo
procyntu niy idzie zgadnōńć. Liczby widać w dymku po najechaniu.

**Wskazōwki** — zakładka do pisaniŏ promptōw, ôparto na trzech zajtach Anthropica
(Prompt engineering overview, Prompting best practices, Prompt library). Piszesz prompt w polu
wiadōmości, a sze wzorcōw ôdhaczo sie samo na zŏkłŏdzie słōw: czy ôpisujesz wynik, czy dowosz
sposōb na sprawdzyniy, punkt, ô kery sie ôprzeć, cel do zmierzyniŏ, artefakt i format ôdpowiydzi.
Wzōr, kerego niy ma, pokazuje, na co je, a kliknyniy wstawio przikłod do pola. Pod spodym je
piyńć gotowych promptōw (klik wstawio je do pola) i zasady z dokumyntacyji. Ôdhaczyniy sōm
liczōne ze słōw, tōż to je wskazōwka, a niy ocyna promptu.

## Instalacyjŏ

### Chrome / Brave

1. `chrome://extensions` (w Brave `brave://extensions`), włōncz **Tryb deweloperski**.
2. **Załaduj rozpakowane** i pokoż tyn katalog.

Chrome wypisze ôstrzeżynie ô niyznanym kluczu `browser_specific_settings` — to je klucz
dlŏ Firefoxa, rozszyrzynie dziaułŏ mimo niego.

### Firefox

1. `about:debugging#/runtime/this-firefox`.
2. **Wczytej tymczasowy dodatek** i pokoż `manifest.json` w tym katalogu.

Tymczasowy dodatek znika po restarcie przeglōndarki. Na sztyjc trza go podpisać na
`addons.mozilla.org`.

## Prawa

Żŏdne. W `manifest.json` niy ma sekcyji `permissions`: rozszyrzynie yno czyto zajtã
`claude.ai`, kero je na ekranie, i zapisuje ustawiyniy panelu (zwiniyniy, zakładka, szyrokość,
zwiniynte katalogi) w `localStorage` tyj zajty, pod kluczami `cst:`. Niczego nikaj niy wysyłŏ.

## Czego żech niy sprawdziōł

- Rozszyrzynie **testowołech yno na swojyj testowyj zajcie**, niy na `claude.ai`. Jak zapis
  rozmowy pokazuje wywołaniŏ noczynia i listy zadań, może sie różnić, i wtedy drzewko
  bydzie prōzne abo niycołke, a paska postympu niy bydzie.
- Drzewko ma sens tam, kaj Claude rusza pliki, czyli w Claude Code w przeglōndarce.
  W szarym czacie zwykle niy ma co zbiyrać.
- Prōg „zimnego cache" (5 minut, potym godzina) to mōje założyniy, niy ôdczyt.
