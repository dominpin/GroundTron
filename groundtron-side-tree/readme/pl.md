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

- Gdy Claude właśnie otwiera albo zmienia plik, jego wiersz zapala się na kolor działania
  i zostaje z paskiem z boku przez 8 sekund. Liczba po prawej to liczba dotknięć.
- Przełącznik **podążaj** przewija drzewko do ostatnio dotkniętego pliku.
- Kliknięcie pliku przewija rozmowę do ostatniego miejsca, w którym ten plik się pojawia,
  i na chwilę je podświetla.
- Trójkąt przy folderze zwija go i rozwija. Zwinięcie zapamiętuje się w przeglądarce.

**Miernik u góry** — w duchu `cache-tax`: przybliżona wielkość wątku i czas bezczynności,
a z niego zgadywany stan cache (świeże / może być zimne / najpewniej zimne). To **szacunki
liczone z tego, co widać na stronie**. Rozszerzenie nie widzi prawdziwego cache ani prawdziwej
liczby tokenów, więc nie pokazuje kosztów w złotówkach ani dolarach i niczego nie wysyła, żeby
cache podtrzymać. Krzyżyk w tej samej linii zwija cały panel.

**Pasek postępu** — pod miernikiem, w stylu paska z Windows 7. Rozszerzenie czyta ostatnią listę
zadań widoczną w rozmowie (`[x]` / `[ ]` albo `☑` / `☐`). Bez takiej listy paska nie ma, bo
procentu nie da się zgadnąć. Liczby widać w dymku po najechaniu.

**Podpowiedzi** — zakładka do pisania promptów, oparta na trzech stronach Anthropica
(Prompt engineering overview, Prompting best practices, Prompt library). Piszesz prompt w polu
wiadomości, a sześć wzorców odhacza się samo na podstawie słów: czy opisujesz wynik, czy dajesz
sposób weryfikacji, punkt odniesienia, mierzalny cel, artefakt i format odpowiedzi. Wzorzec,
którego brakuje, pokazuje, po co jest, a kliknięcie wstawia przykład do pola. Pod spodem jest
pięć gotowych promptów (klik wstawia je do pola) i zasady z dokumentacji. Odhaczenia liczone
są ze słów, więc to wskazówka, nie ocena promptu.

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

## Firefox na telefonie (Android)

Panel działa też w wąskim oknie. Na telefonie zajmuje całą szerokość ekranu, ma większe przyciski
i na początku jest zwinięty do uchwytu przy prawej krawędzi; dotknij go, żeby otworzyć. Potrzebny
jest Firefox 128 lub nowszy. Z tego, co wiem, Firefox na Androidzie instaluje dodatki tylko
z `addons.mozilla.org` albo z podpisanego pliku `.xpi`, więc nie wczytasz go jak „rozpakowanego"
w Chrome: trzeba go podpisać na AMO (wystarczy podpis do własnej dystrybucji). Nie testowałem go
na prawdziwym telefonie, tylko w oknie o szerokości 375 px. Podpowiedzi w dymkach (np. liczby
na pasku postępu) wymagają myszy, na ekranie dotykowym ich nie ma.

## Uprawnienia

Żadnych. W `manifest.json` nie ma sekcji `permissions`: rozszerzenie czyta tylko
stronę `claude.ai`, która i tak jest na ekranie, i zapisuje ustawienia panelu
(zwinięcie, zakładka, szerokość, zwinięte foldery) w `localStorage` tej strony, pod kluczami
`cst:`. Nie wysyła niczego nigdzie.

## Czego nie sprawdziłem

- Rozszerzenie **testowałem tylko na własnej stronie testowej**, nie na `claude.ai`.
  Sposób, w jaki zapis rozmowy pokazuje wywołania narzędzi i listy zadań, może się różnić,
  i wtedy drzewko będzie puste albo niepełne, a paska postępu nie będzie.
- Drzewko ma sens tam, gdzie Claude dotyka plików, czyli w Claude Code w przeglądarce.
  W zwykłym czacie zwykle nie ma czego zbierać.
- Próg „zimnego cache" (5 minut, potem godzina) to moje założenie, nie odczyt.
