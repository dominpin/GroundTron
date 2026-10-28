# Ultron: my Claude tools

Two things, both with the same look: a Claude Code mod and a browser extension.

## cc-combo (mod do Claude Code)

Plugin marketplace (`my-mods`) z jednym modem, **cc-combo**: savvy-progress, filetree,
cache-tax i blast-radius w jednej wtyczce ze wspólną paletą.
Opis w [cc-combo/README.md](cc-combo/README.md).

Potrzebny Claude Code 2.1.287 lub nowszy (`claude update`). W Claude Code:

```
/plugin marketplace add dominpin/Ultron
/plugin install cc-combo@my-mods
```

Wybierz zakres **user**, żeby ładował się w każdej sesji.

## claude-side-tree (rozszerzenie do przeglądarki)

Panel po prawej stronie `claude.ai`: drzewko plików dotkniętych w rozmowie z
podświetlaniem na żywo, licznik bezczynności wątku w duchu cache-tax i ściągawka
promptowa z dokumentacji Anthropica. Bez żadnych uprawnień, nic nie wysyła.
Instalacja i ograniczenia w [claude-side-tree/README.md](claude-side-tree/README.md).
