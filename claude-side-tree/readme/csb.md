# Claude Side Tree

Rozszérzenié do Chrome / Brave / Firefox, chtërné dodôwô panel z prawi stronë `claude.ai`.
Wëzdrzatk i farwë te same, co w mòdze [cc-combo](https://github.com/dominpin/Ultron).

> Tuwò je pierwszô wersjô tekstu pò kaszëbskù. Czekô na przezérk przez rodzonégò mòwcã.

## Co pòkazëje

**Plikë** — drzewò plików, chtërné rëszałë sã w tëch rozmòwie, zrobioné z wëwòłaniów
nôrzãdzów, widzónëch w zapisu rozmòwë (`Read(...)`, `Edit(...)`, `Write(...)`, `Update(...)`,
`Grep`, `Glob`). Farwa gôdô, co sã z plikã stało:

| | |
| --- | --- |
| `◦` blękitnô | czëtóny |
| `●` glëna | edytowóny |
| `✚` zelonô | ùtwòrzony |
| `·` szarô | le wspòminóny |

- Czej Claude prawie òtmëkô abò zmieniô plik, jegò rządk zacządnie swiécëc w farwie
  dzejaniô i òstôwô z pasã z bòkù na 8 sekùndów. Lëczba z prawi stronë to lëczba rëszeniów.
- Przełączënk **pòdążôj** przewijô drzewò do ostatno rëszonégò pliku.
- Kliknienié na plik przewijô rozmòwã do slédnégò môlowiska, dze ten plik sã zjawiô,
  i na chwilã je pòdswiécô.
- Trójkąt przë katalogù zwijô gò i rozwijô. Zwinienié zapamiãtiwô sã w przezérnikù.

**Miérnik na górze** — w dëchù `cache-tax`: przëbëlnô wiôlgòsc wątkù i czas nieczënnoscë,
a z nich zgadiwóny stan cache (swiéżé / mòże bëc zëmné / nôwicy zëmné). To są **szacunczi
lëczoné z tegò, co je widzec na starnie**. Rozszérzenié nie widzy prôwdzëwégò cache ani
prôwdzëwi lëczbë tokenów, tej nie pòkazëje kòsztów w pieniãdzach i nick nie wësyłô, żebë
cache wëtrzimac. Krziż w tim samim rządkù zwijô cały panel.

**Pasek pòstãpù** — pòd miérnikã, w stilu paska z Windows 7. Rozszérzenié czëtô slédną lëstã
zadaniów widzóną w rozmòwie (`[x]` / `[ ]` abò `☑` / `☐`). Bez taczi lëstë paska nie ma, bò
procentù nie je jak zgadnąc. Lëczbë widac w dymkù pò najechanim.

**Pòdpòwiescë** — kartka do pisaniô promptów, òprzëta na trzech starnach Anthropica
(Prompt engineering overview, Prompting best practices, Prompt library). Piszesz prompt w pòlu
wiadomòscë, a sztërë wzorce òdhaczają sã same na zôkłôdzie słów: czë òpisëjesz wińik, czë
dôjesz spòsóbk weryfikacji, pùnkt òdniesieniô, mierzalny cél, artefakt i format ùdpòwiescë.
Wzorzéc, chtërnégò felëje, pòkazëje, pò co je, a kliknienié wstôwiô przëmiar do pòla. Pòd spódkã
je pięc gòtowëch promptów (klik wstôwiô je do pòla) i zasadë z dokùmentacji. Òdhaczeniô są
lëczoné ze słów, tej to je pòdpòwiésc, a nie òcena promptu.

## Instalacjô

### Chrome / Brave

1. `chrome://extensions` (w Brave `brave://extensions`), włączë **Tryb deweloperski**.
2. **Załadëjë rozpakòwané** i pòkażë ten katalog.

Chrome wëpisze òstrzeżenié ò nieznónym klëczu `browser_specific_settings` — to je klëcz
dlô Firefoxa, rozszérzenié dzejô mimò niegò.

### Firefox

1. `about:debugging#/runtime/this-firefox`.
2. **Wczëtôj tymczasowi dodatk** i pòkażë `manifest.json` w tim katalogù.

Tymczasowi dodatk zniko pò restarce przezérnika. Na stałé trzeba gò pòdpisac na
`addons.mozilla.org`.

## Prawa

Żódnëch. W `manifest.json` nie ma sekcji `permissions`: rozszérzenié le czëtô starnã
`claude.ai`, chtërnô je na ekranie, i zapisëje ùstawieniô panelu (zwinienié, kartkã, szérzã,
zwinioné katalogi) w `localStorage` tëji starnë, pòd klëczama `cst:`. Nick nigdze nie wësyłô.

## Czegò nie sprawdzëłem

- Rozszérzenié **testowôł le na swòji testowi starnie**, nie na `claude.ai`. Jak zapis
  rozmòwë pòkazëje wëwòłania nôrzãdzów i lëstë zadaniów, mòże sã różnic, i tej drzewò
  bãdze prôzné abò niecałé, a paska pòstãpù nie bãdze.
- Drzewò mô sens tam, dze Claude rëszô plikë, czilé w Claude Code w przezérnikù.
  W zwëkłim czace zazwëczôj nie ma czegò zbierac.
- Prôg „zëmnégò cache" (5 minut, pózni gòdzëna) to mòje założenié, nie òdczëtanié.
