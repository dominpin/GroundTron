# groundtron-combo

Cztery mody Claude Code w jednym pluginie:

| Część | Źródło | Co robi | Komendy |
| --- | --- | --- | --- |
| savvy-progress 1.2.1 | [JohnnyVizz/claude-kit](https://github.com/JohnnyVizz/claude-kit/tree/main/plugins/savvy-progress) | pasek postępu nad promptem dla /savvy-flow i panel subagentów | `/agents-info` |
| filetree 0.2.26 | [data-goblin/claude-code-filetree](https://github.com/data-goblin/claude-code-filetree) | drzewo plików jak w IDE, pokazuje co Claude czyta i zapisuje | `/filetree [ścieżka]` |
| cache-tax 2.2.2 | [karanb192/cache-tax](https://github.com/karanb192/cache-tax) | trzyma cache promptu „ciepły” podczas przerw i zatrzymuje drogie „zimne” wysłanie | `/keepwarm`, `/cache-tax` |
| blast-radius 0.1.0 | [anthropics/claude-code-playground](https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/blast-radius) | wstrzymuje ryzykowne komendy Bash (`rm -rf`, `git reset --hard`, force push...) z przyciskami Proceed / Cancel | — |

## Jak to jest złożone

- `hooks/register.tsx` to jedyny moduł hooków: wywołuje `register` każdej części.
- Silnik pozwala jednemu pluginowi zahaczyć zdarzenie bez matchera tylko raz, a trzy części
  używają tych samych (`session.start`, `classic.SessionStart`, `prompt.submit`,
  `turn.complete`, `turn.step`). Te hooki są wyjęte jako funkcje i połączone w jeden łańcuch
  w `register.tsx` (`hooks/compose.ts` → `link`).
- Stan (`$.state`) obu części z panelami jest teraz pod nazwą `groundtron-combo`; kontrakt w `types/index.d.ts`.
- Opcje (`userConfig`) obu części są w jednym manifeście; nazwy się nie pokrywały.

## Wspólny wygląd

Wszystkie cztery części korzystają z jednej palety (`hooks/theme.ts`), w wersji ciemnej i jasnej:

| Rola | Ciemny | Jasny | Gdzie |
| --- | --- | --- | --- |
| accent (glina Claude) | `#D97757` | `#B8532F` | pasek postępu, foldery, nagłówek drzewa |
| success | `#5FBF8F` | `#1E7B4F` | ukończone, ciepły cache, dodane pliki |
| warning | `#E5C07B` | `#8A5A00` | zimny cache, wstrzymana komenda, zmienione pliki |
| danger | `#E06C75` | `#B42318` | błąd, usunięte pliki, co komenda by zniszczyła |
| info | `#61AFEF` | `#1E4FA3` | przemianowane / skopiowane pliki |
| muted | `#8A8F98` | `#5B6270` | tekst drugorzędny |

- Wiersze nad promptem (savvy-progress, cache-tax) mają ten sam kształt: `●` w kolorze stanu, nazwa, stan, szczegóły przyciemnione.
- Okno blast-radius ma ramkę i tytuł w kolorze warning, a skutki komendy w kolorze danger.

## Ustawienia, które się powtarzały

- **Jasny/ciemny motyw:** cache-tax i filetree czytały go osobno. Teraz czyta go jedno miejsce (`theme.ts`), a korzystają z niego wszystkie cztery części. savvy-progress i blast-radius dotąd miały kolory na sztywno.
- **NO_COLOR:** wcześniej obsługiwał go tylko cache-tax. Teraz respektują go oba wiersze nad promptem i blast-radius. Panel agentów (kolory poziomów modeli) i drzewo plików zostają kolorowe.
- Opcje w `userConfig` nie powtarzały się (`language`, `autoOpen` z savvy, reszta z filetree), więc wszystkie zostały.
- Plik motywu omarchy, który obsługuje filetree, dalej ma pierwszeństwo w drzewie plików.

## Różnice względem oryginałów

- **savvy-flow:** narzędzia savvy-progress nazywają się teraz `mcp__groundtron-combo__progress` i
  `mcp__groundtron-combo__step` (nazwa zależy od nazwy pluginu). Skill i agenci savvy-flow szukają
  `mcp__savvy-progress__*`, więc bez zmiany ich tekstów pomijają raportowanie postępu.
- **blast-radius** uruchamia `bash` i `sleep`; na Windowsie potrzebny jest Git Bash w PATH.
- **cache-tax:** podtrzymywanie cache wysyła zapytania do modelu i kosztuje tokeny.

## Licencje

savvy-progress, filetree i cache-tax: MIT; blast-radius: Apache-2.0. Teksty licencji w `licenses/`.
