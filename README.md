# gabrielkozik.cz – zdrojové soubory webu

Osobní web Mgr. Gabriela Kožíka. Ručně psané statické HTML, bez buildu a frameworku. Hostuje Cloudflare Pages z větve `main`.

## Mapa repa

| Složka / soubor | Co v ní je | Jde na web? |
|---|---|---|
| `web/` | **Celý web.** Vše, co je tady, je veřejně na www.gabrielkozik.cz. | ✅ ano |
| `web/blog/RRRR/slug/` | Článek (`slug.html` + `slug-en.html`) a jeho obrázky | ✅ |
| `web/assets/` | Fonty, obrázky, JS a data (`articles.json`, `events.json`). Styly jsou ve `web/style.css`. | ✅ |
| `nastroje/` | Pomocné skripty (např. `generuj-llms-txt.py`) | ❌ |
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
5. Odborný článek: spusť z kořene repa `python nastroje/generuj-llms-txt.py` (přegeneruje `web/llms.txt`).
6. Commit + push v GitHub Desktop → Cloudflare web nasadí do pár minut.

## Fotky

Originály dávej do `_privatni/fotky-original/` (mimo git). Do webu patří jen zmenšené webové verze (WebP/JPG) ve `web/assets/images/`.

## Lokální náhled

Z kořene repa: `npx wrangler pages dev web`. Emuluje Cloudflare Pages včetně čistých URL, `_redirects` a `404.html`.
