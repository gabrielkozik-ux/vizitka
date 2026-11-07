# gabrielkozik.cz – zdrojové soubory webu

Osobní web Mgr. Gabriela Kožíka. Ručně psané statické HTML, bez buildu a frameworku. Hostuje Cloudflare Pages z větve `main`.

## Mapa repa

| Složka / soubor | Co v ní je | Jde na web? |
|---|---|---|
| `web/` | **Celý web.** Vše, co je tady, je veřejně na www.gabrielkozik.cz. | ✅ ano |
| `web/blog/RRRR/slug/` | Článek (`slug.html` + `slug-en.html`) a jeho obrázky | ✅ |
| `web/assets/` | Fonty, obrázky, JS a data (`articles.json`, `events.json`). Styly jsou ve `web/style.css`. | ✅ |
| `nastroje/` | Pomocné skripty: `aktualizuj-web.py` (spouští `generuj-llms-txt.py` a `generuj-vypisy.py`) | ❌ |
| `sablony/` | Šablona nového článku | ❌ |
| `zdroje/` | Zdroje, ze kterých se něco vyrábí: SVG grafiky, texty, skript kontaktního formuláře (Google Apps Script), archiv nepoužitých originálů obrázků | ❌ |
| `_privatni/` | Jen na disku, **mimo git**: originály fotek, audit webu (`AUDIT.md`), `CHANGELOG-optimalizace.md`, pravidla pro AI asistenta (`Claude.md.txt`), screenshoty, pracovní verze | ❌ |

Pravidlo: **na web patří jen to, co leží ve `web/`.** Pracovní a zdrojové soubory nikdy do `web/` nedávej, jinak budou veřejně dostupné.

## Nastavení Cloudflare Pages

- Build command: *(prázdné)*
- **Build output directory: `web`**
- Produkční větev: `main`

## Jak přidat článek

1. Zkopíruj `sablony/sablona-clanku.html` do `web/blog/RRRR/slug/slug.html` (a EN verzi jako `slug-en.html`). Nahraď všechny `{{PLACEHOLDERY}}`.
2. Obrázky článku dej do stejné složky (`header.jpg` = úvodní obrázek). Zdrojové soubory grafik (SVG apod.) patří do `zdroje/grafiky/slug/`, ne k článku.
3. Přidej záznam do `web/assets/data/articles.json` (výpis blogu se generuje z něj).
4. Přidej obě URL do `web/sitemap.xml`.
5. Spusť z kořene repa `python nastroje/aktualizuj-web.py`. Přegeneruje `web/llms.txt` a statický výpis článků na `/blog` (a akcí na homepage). Bez toho se nový článek bez JavaScriptu na `/blog` neukáže.
6. Commit + push v GitHub Desktop → Cloudflare web nasadí do pár minut.

**Aktualizace článku:** při věcné změně obsahu přepiš v JSON-LD článku `dateModified` na datum úpravy (`datePublished` nech).

## Akce na homepage

Novou akci přidej do `web/assets/data/events.json` a spusť `python nastroje/aktualizuj-web.py`. JavaScript na webu akce sám rozdělí na budoucí a proběhlé podle dnešního data; statický výpis v HTML (pro vyhledávače a prohlížeče bez JS) se aktualizuje jen spuštěním skriptu.

## Fotky

Originály dávej do `_privatni/fotky-original/` (mimo git). Do webu patří jen zmenšené webové verze (WebP/JPG) ve `web/assets/images/`.

## Lokální náhled

Z kořene repa: `npx wrangler pages dev web`. Emuluje Cloudflare Pages včetně čistých URL, `_redirects` a `404.html`.
