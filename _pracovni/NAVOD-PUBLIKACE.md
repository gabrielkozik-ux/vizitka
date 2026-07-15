# Návod: publikace nového článku na gabrielkozik.cz

Šablona: `_pracovni/sablona-clanku/sablona-clanku.html`

## Checklist (v tomto pořadí)

1. **Založ složku** `blog/RRRR/slug-clanku/` (slug: malá písmena, pomlčky, bez diakritiky).
2. **Zkopíruj šablonu** jako `slug-clanku.html`, nahraď všechny `{{PLACEHOLDERY}}`.
3. **EN verze** `slug-clanku-en.html`: přelož obsah, změň `lang="en"`, `og:locale` na `en_US`,
   canonical/og:url na `...-en`, v lang-switcheru prohoď `active`, JSON-LD `inLanguage: "en"`.
4. **Hlavní obrázek** ulož jako `header.jpg` do složky článku (ideálně 1200×630 px, do 150 kB).
   Fotky do galerie: `assets/images/blog/RRRR/slug-clanku/`.
5. **articles.json** (`assets/data/articles.json`): přidej záznam NA ZAČÁTEK pole:
   ```json
   {
       "id": "slug-clanku",
       "date": "RRRR-MM-DD",
       "category": "expert",       ← "expert" nebo "report"
       "image": "blog/RRRR/slug-clanku/header.jpg",
       "cs": { "title": "...", "excerpt": "...", "link": "blog/RRRR/slug-clanku/slug-clanku" },
       "en": { "title": "...", "excerpt": "...", "link": "blog/RRRR/slug-clanku/slug-clanku-en" }
   },
   ```
6. **sitemap.xml**: přidej `<url>` blok pro CS i EN verzi (vzor = kterýkoliv článek v sitemapě).
7. **Kontrola před pushem**:
   - soubor končí `</html>` (celý, neoříznutý),
   - articles.json je validní JSON (žádná chybějící čárka),
   - odkazy v lang-switcheru fungují (CS↔EN),
   - CTA blok odpovídá tématu článku.
8. **Push** přes GitHub Desktop → zkontroluj živě `/blog` a detail článku.
9. **Sdílení**: LinkedIn post (vlož URL, zkontroluj náhled v Post Inspectoru).

## Zásady obsahu (dle brand strategie)

- Hlas rozumu: žádný AI hype, žádné strašení. Fakta, praxe, srozumitelnost.
- Piš pro majitele menších firem — bez žargonu, žargon vždy přelož.
- Právní tvrzení jen ověřená; u zahraničních kauz uveď, že jde o analogii, ne českou judikaturu.
- Nepravomocná rozhodnutí označuj jako nepravomocná.
- Vždy uveď zdroje.
- Každý expertní článek končí kontextovým CTA.
- ČAK: žádné superlativy, žádné srovnávání s konkurencí, žádné sliby výsledku.
