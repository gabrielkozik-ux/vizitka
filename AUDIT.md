# AUDIT webu gabrielkozik.cz

**Datum:** 6. 11. 2026 · **Stav repa:** `main` @ `baad6a1` (pracovní kopie na disku = HEAD, navíc jen neverzovaný `Claude.md.txt`)
**Rozsah:** fáze 1 (průzkum) a fáze 2 (audit). Na webu jsem **nic nezměnil**.

> ⚠️ **Než tenhle soubor commitneš:** Cloudflare Pages nasazuje všechno, co je v repu. `AUDIT.md` v rootu by byl veřejně na `www.gabrielkozik.cz/AUDIT.md`, i s pasážemi o rizikových formulacích a sídle. Doporučuju přidat `AUDIT.md`, `CHANGELOG-optimalizace.md` a `Claude.md.txt` do `.gitignore`, nebo je přesunout do `_pracovni/_privatni/` (ta už ignorovaná je). Udělám to až po tvém souhlasu.

**Legenda:** Priorita **P1** = udělat hned (vysoký dopad nebo právní či reputační riziko), **P2** = další vlna, **P3** = až bude čas. Náročnost **S** < 1 h, **M** = půl dne, **L** = den a víc.

---

## 0. Shrnutí v pěti bodech

1. **Technicky je web v dobré kondici.** Statické HTML, vlastní fonty, consent pro GA udělaný správně, sitemap s hreflang, `llms.txt`, 301 přesměrování. Lighthouse lokálně 88–100.
2. **Největší díra v GEO je mimo repo.** Cloudflare do živého `robots.txt` vkládá vlastní blok, který zakazuje mimo jiné **GPTBot, ClaudeBot, Google-Extended a Applebot-Extended**. Google-Extended přitom řídí i grounding v aplikaci Gemini. Pro lektora Google AI nástrojů je to paradox. Nic jsem neměnil, varianty jsou v D1.
3. **Entita „Gabriel Kožík“ je nekonzistentní.** AK Petráš Rezek se na webu nevyskytuje ani jednou. Sídlo Slovákova 279/11 je zároveň adresa IUSTORIA (viz `events.json`). IUSTORIA je ve 20 HTML souborech a datech, na 8 stránkách s výzvou „Sledujte nás“. U 3 článků jiných autorů je ve schema.org uvedený jako autor Gabriel.
4. **Na mobilu, kde čte většina cílovky, jsou dvě vážné UI chyby.** Navigace ve všech 104 článcích se rozpadá a překrývá obsah. Hlavní CTA v hero je tmavomodré na tmavomodrém pozadí, takže skoro není vidět.
5. **Několik formulací narazí na stavovské předpisy a zákaz klamavé reklamy.** Jde o „ručí za výsledek“, „30+ odborných článků“ (na blogu je jich 20, z toho 3 od jiných autorů) a „Vaše data neopustí kancelář“, což je v rozporu s vlastními zásadami GDPR (Google Workspace, předání do USA). Dále se bez souhlasu načítá 16 YouTube přehrávačů.

---

## 1. Fáze 1 – Průzkum

### 1.1 Stack a jak se generuje HTML

| Vrstva | Stav |
|---|---|
| Generování | **Ručně psané statické HTML** (112 souborů). Žádný build, žádný `package.json`. |
| Šablona článku | `_pracovni/sablona-clanku/sablona-clanku.html` (placeholdery `{{TITULEK}}` atd.) |
| Styly | 1× `style.css` (2 605 řádků, design tokeny v `:root`, kontrasty zdokumentované), `assets/fonts/fonts.css` (self-hosted Inter + Lora) |
| JS | 7 vanilla souborů: `main.js` (menu, reveal, countery), `blog-loader.js`, `events-loader.js`, `consent.js` (GA4 až po souhlasu), `contact-form.js` (→ Google Apps Script → Google Sheet), `share-buttons.js`, `gallery.js` |
| Data | `assets/data/articles.json` (45 položek: 20 odborných, 6 podcastů, 19 reportáží), `assets/data/events.json` (66 akcí). **Vykreslují se až v prohlížeči (klientský JS).** |
| Pomocné skripty | `_pracovni/generuj-llms-txt.py` (generuje `llms.txt` z `articles.json`) |
| Hosting | Cloudflare Pages z GitHubu (`gabrielkozik-ux/vizitka`, veřejné repo), clean URLs, `_redirects`, `404.html`. Bez `_headers`. |
| Jazyky | CS + EN (`-en` suffix), hreflang v HTML i v sitemap |

**Vykreslování:** homepage, články a zásady GDPR jsou plně statické. **Výpis blogu (`/blog`) a seznam akcí na homepage existují jen po spuštění JS.** Ověřeno na živém webu: `/blog` vrací jen „Načítám články…“.

### 1.2 Lokální běh

- Server: `npx wrangler pages dev .` → `http://127.0.0.1:8788`. Emuluje Cloudflare Pages včetně clean URLs, `_redirects` a `404.html`. Ověřeno: `/`, `/blog`, `/index-en`, články, 404 a 301 ze starých URL fungují.
- Lighthouse jsem pouštěl proti vlastnímu malému Python serveru (clean URLs + gzip), protože Lighthouse v mém sandboxu s wranglerem nespolupracoval. Výsledky jsou orientační, viz Slabá místa.
- Build: žádný není. „Build prochází“ tu znamená validní HTML/JSON a funkční odkazy.

### 1.3 Screenshoty (375 px a 1440 px)

Uložené mimo nasazovaný obsah: `_pracovni/_privatni/audit-2026-11/screenshots/` (složka je v `.gitignore`).

| Stránka | Soubory |
|---|---|
| Homepage | `homepage-{375,1440}-fold` (první obrazovka vč. cookie lišty), `homepage-{375,1440}-full` |
| Služby (`#sluzby`) | `sluzby-{375,1440}`, `-section` |
| O mně (`#about`) | `o-mne-{375,1440}`, `-section` |
| Kontakt (`#propojit`) | `kontakt-{375,1440}`, `-section` |
| Blog | `blog-{375,1440}-fold/full` |
| Detail článku | `clanek-*` (Odpovědnost za chyby AI), `clanek-novy-*` (Maiday), `clanek-cta-*`, `clanek-konec-*` |
| 404 | `404-*` |

Pozn.: „O mně“, „Služby“ a „Kontakt“ nejsou samostatné stránky, jen sekce homepage (viz C4).

### 1.4 Lighthouse – výchozí stav (lokálně, simulovaný throttling)

| Stránka | Mobil P / A / BP / SEO | Desktop P / A / BP / SEO | Pozn. |
|---|---|---|---|
| Homepage | 88 / 100 / 100 / 100 | 100 / 100 / 100 / 100 | LCP mobil 3,3 s (hero), render-blocking CSS |
| Blog | 92 / 100 / 96* / 100 | 99 / 100 / 96* / 100 | TBT 260 ms; obrázky karet bez `srcset` (úspora 300–500 kB) |
| Článek (Odpovědnost za chyby AI) | 88 / 100 / 100 / 100 | 92 / 100 / 100 / 100 | **CLS 0,18** (obrázky bez rozměrů), LCP obrázek má `loading="lazy"` |
| Článek (Maiday) | 91 / 96 / 100 / 100 | 100 / 96 / 100 / 100 | LCP mobil 3,4 s; odkazy v textu rozlišené jen barvou |
| Ochrana osobních údajů | 94 / 96 / 100 / 100 | 100 / 96 / 100 / 100 | odkazy v textu rozlišené jen barvou |

\* BP 96 na blogu způsobil můj sandbox, který blokuje náhledy z `img.youtube.com`. Na produkci to chyba nebude. Surová JSON data jsou v `_pracovni/_privatni/audit-2026-11/lighthouse-before/`.

### 1.5 Pětisekundový test (375 px, první obrazovka)

| Otázka | Výsledek | Proč |
|---|---|---|
| Kdo jsem? | ✅ | Jméno v navigaci, H1 „Advokát pro novou dobu s AI“ |
| Co dělám? | ⚠️ | Obecné „podnikat bez právního chaosu“. Chybí obory (obchodní a korporátní právo, smlouvy, AI compliance) i druhá role (AI školení). |
| Kde? | ❌ | Brno ani Tišnovsko na první obrazovce nejsou. |
| Jak mě kontaktovat? | ⚠️ | Jediné CTA je tmavé na tmavém. Navíc ho na mobilu z části zakrývá cookie lišta (zabírá ~28 % výšky). |

---

## 2. Fáze 2 – Audit

### A) Grafika a vizuální konzistence

| ID | Co je špatně | Proč to vadí | Návrh řešení | Nár. | Pri. |
|---|---|---|---|---|---|
| A1 | **Hero CTA „Nezávazná konzultace“ je `--navy-800` na tmavém navy overlayi.** Stejně tak „Pojďme se pobavit“ v parallaxu. | Hlavní konverzní prvek splývá s pozadím (kontrast tlačítka vůči okolí ~1,1 : 1). Text je čitelný, tlačítko jako celek nevýrazné. | Na tmavých plochách varianta tlačítka `--bronze-200` + text `--navy-900` (podle tokenů ~10 : 1), např. modifikátor `.cta-button--on-dark`. | S | **P1** |
| A2 | Na 375 px tmavý přechod v hero zakrývá obličej (fotka je pozadí, `background-position: 62%`). | Personal brand stojí na tváři. Na mobilu ji návštěvník nevidí. | Na mobilu fotku nad textem jako `<img>` (výřez portrétu), nebo slabší overlay a jiný ořez. | M | P2 |
| A3 | **Inline styly ve 24 článcích používají neexistující CSS proměnné** (`--gold-soft`, `--secondary-color`, `--primary-color`, `--white`, `--light-gray`, `--text-color`). Zbytek starých tokenů. | CTA box „Chystáte se zavádět AI…“ je bez pozadí a rámečku (ověřeno: `background: transparent`). Konverzní prvek v článku zaniká. | Rychle: aliasy starých tokenů v `:root`. Správně: třída `.article-cta` ve `style.css` a odstranit inline styly. | S | P2 |
| A4 | **Obrázky v článcích bez `width`/`height` (126 ze 139)** a hlavní obrázek s `loading="lazy"` (~53 článků). | CLS 0,18 (nad hranicí 0,1 pro Core Web Vitals), zpožděné LCP. | Doplnit rozměry (skriptem), u úvodního obrázku `loading="eager"` + `fetchpriority="high"`. Úvodní `header.jpg` převést i do WebP. | S–M | **P1** |
| A5 | Obrázky: karty blogu načítají plné `header.jpg` bez `srcset`; 34 nepoužitých souborů (~3,1 MB, např. `kancelar-iustoria.jpg`, `logo-iustoria_white.png`, JPG originály brand fotek) se nasazují. | Zbytečná data na mobilu, veřejně dostupné nepoužívané soubory. | Náhledy 600 px WebP + `srcset`, nepoužité soubory mimo nasazení (po schválení). | M | P2 |
| A6 | Smíšené zarovnání: nadpisy karet na střed, text vlevo; „O mně“ je dlouhý odstavec zarovnaný na střed. | Horší čitelnost delšího textu, méně „advokátní“ dojem. | Karty a O mně zarovnat vlevo, na střed jen krátké nadpisy sekcí. | S | P3 |
| A7 | Vizuální jazyk „AI šablony“: obvodový motiv v parallaxu a hlavičce blogu, vodoznaky §, šablonové tmavé náhledy článků. | Kontrast s autentickými fotkami z akcí. Generické AI motivy oslabují dojem „důvěryhodný advokát“. | Do hlavičky blogu a parallaxu vlastní fotky z přednášek. Náhledy článků sjednotit, ale ozvláštnit (např. portrét + téma). | M | P3 |
| A8 | Loga komunit: BforB nízké rozlišení na šedém JPG; na mobilu každé logo celý řádek (~2 obrazovky jen loga). | Působí neudržovaně, prodlužuje stránku. | Mřížka 2×N na mobilu, logo BforB jako PNG/SVG s průhledností. | S | P3 |
| A9 | Certifikace na 1440 px: 3 + 1 (osiřelá karta). | Nevyvážená kompozice. | Mřížka 4 sloupce nebo 2×2. | S | P3 |

**Co funguje:** design tokeny s doloženými kontrasty (WCAG AA), Lora + Inter self-hosted s `preload`, jednotné stíny a zaoblení, kvalitní reálné fotky z akcí.

### B) UI

| ID | Co je špatně | Proč to vadí | Návrh řešení | Nár. | Pri. |
|---|---|---|---|---|---|
| B1 | **Navigace ve všech 104 článcích na mobilu je rozbitá.** Odkazy se zalomí pod fixní 72px lištu, „Kontaktujte mě“ a „CZ“ překrývají text článku. Hamburger v článcích chybí (homepage, blog i 404 ho mají). | Většina čtenářů přichází na článek z vyhledávání a na mobilu. První dojem je rozbitá stránka. | Sjednotit `<nav>` článků s homepage/404 (hamburger + `main.js` místo inline skriptu). Hromadně skriptem přes všechny články + šablonu. | M | **P1** |
| B2 | **Patička článků je jen copyright.** Chybí kontakt, identifikace advokáta i autor box. | Mrtvý konec (viz C2) a právní bod E1. | Stejná patička jako na homepage + autor box nad patičkou (foto, „advokát, ev. č. ČAK 19320“, CTA). | M | **P1** |
| B3 | Kontakt nabízí 4 rovnocenné cesty (e-mail, telefon, kalendář, formulář) a CTA se jmenují pětkrát jinak („Nezávazná konzultace“, „Domluvit konzultaci“, „Pojďme se pobavit“, „Napište mi e-mail“, „Vybrat termín online schůzky“). Podnadpis „rezervujte si online call“ je malým písmenem. | Rozhodovací paralýza, nejasné, co je hlavní krok. | Jedno primární CTA „Rezervovat 30 min zdarma“ (kalendář), sekundárně telefon a formulář. Texty v sekci 4. | S | P2 |
| B4 | Na mobilu chybí trvalé CTA. Kontakt je až na ~20. z 21 obrazovek. | Kdo se rozhodne uprostřed stránky, musí hledat. | Sticky lišta dole na mobilu „Zavolat · Rezervovat“ (čisté HTML a CSS, bez nového JS). | S–M | P2 |
| B5 | Hamburger je `<div role="button">` bez výchozího `aria-expanded` a `aria-controls`, chybí skip-link. | Přístupnost s klávesnicí a čtečkou. | `<button>`, `aria-controls`, `aria-expanded="false"` v HTML, skip-link „Přejít na obsah“. | S | P3 |
| B6 | „Kde se potkáme osobně“ ukazuje jedinou budoucí akci (24. 11. 2026). Po tomto datu bude seznam prázdný a bez vysvětlení. Seznam je jen v JS. | Prázdná sekce působí jako opuštěný web. | Fallback text („Další termíny brzy, sledujte LinkedIn“) a statické vykreslení (viz D2). | S | P3 |
| B7 | Filtry blogu se na 375 px lámou do tří řádků. Stránkování je jen v JS. | Kosmetika, ale první věc, kterou na `/blog` uvidíš. | Horizontální scroll „chips“ nebo 2×2. | S | P3 |
| B8 | Odkazy v textu rozlišené jen barvou (Lighthouse `link-in-text-block`: zásady GDPR, Maiday). | WCAG 1.4.1. | Podtržení odkazů v textu článků. | S | P2 |
| B9 | `.reveal { opacity: 0 }` nemá fallback bez JS. | Když JS selže nebo je vypnutý, většina sekcí homepage je neviditelná. Při rychlém skoku z menu se obsah „dorovnává“. | `@media (scripting: none) { .reveal { opacity: 1; transform: none } }` nebo třída `no-js`. | S | P2 |
| B10 | Dark mode neexistuje. | Pro tuhle cílovku nízký přínos. | Neřešit teď. | – | P3 |

**Co funguje:** formulář (labely, `aria-live`, honeypot, `noscript` fallback, rozumný placeholder o citlivých datech), FAQ přes `<details>`, cookie lišta se dvěma rovnocennými tlačítky, žádný horizontální scroll na 375 px.

### C) UX

| ID | Co je špatně | Proč to vadí | Návrh řešení | Nár. | Pri. |
|---|---|---|---|---|---|
| C1 | **Pětisekundový test projde ze 2 ze 4** (viz 1.5). Hero neříká obory, lokalitu ani druhou roli (AI školení). | Návštěvník z Google/AI odpovědi neví, jestli je na správném místě. | Doplnit pod H1 obory + „Brno a Tišnovsko“ + „AI školení pro týmy“. Návrh textu v sekci 4. | S | **P1** |
| C2 | **Cesta článek → důvěra → kontakt končí „Zpět na přehled“.** 11 ze 20 odborných článků nemá na konci žádné CTA, žádný článek nemá autor box ani „Související články“. | Článek je nejčastější vstupní bod a končí slepou uličkou. | Standardní konec článku: autor box → CTA box (opravený A3) → 2–3 související články. Vše statické HTML. | M | **P1** |
| C3 | **Interní prolinkování: 17 ze 20 odborných článků neodkazuje na žádný jiný článek.** Homepage neodkazuje na konkrétní článek. | Slabé tematické clustery pro Google i AI. Návštěvník nemá kam pokračovat. | Clustery: *AI Act* (ai-act-byznys, slovník, AI Act pro zaneprázdněné, označování AI obsahu), *Odpovědnost a soudy* (odpovědnost za chyby AI, AI před soudem, AI slop před NSS), *Korporát a pracovní právo*. Na homepage blok „Vybrané články“ (3). | M | P2 |
| C4 | Web je one-page: „O mně“, „Služby“ ani „Školení“ nemají vlastní URL. | AI vyhledávače citují URL. Bez samostatné stránky o tobě a o službách není co citovat jako zdroj entity a specializace. | Stránky `/o-mne`, `/sluzby` (příp. podstránky: smlouvy, korporát, AI compliance), `/skoleni`. Mění strukturu webu, takže **potřebuje tvoje schválení** (pravidlo 4). | L | P2 |
| C5 | Homepage na mobilu ~17 400 px (≈ 21 obrazovek). „O mně“ je až kolem 9. obrazovky, kontakt na konci, certifikace zabírají ~3 obrazovky. | Únava, odpadání před kontaktem. | Pořadí: hero → trust bar → služby → krátce o mně → jak pracuji → akce a fotky → FAQ → kontakt. Certifikace 2 sloupce na mobilu. | M | P2 |
| C6 | Rychlost: render-blocking `style.css` (62 kB, neminifikovaný) + `fonts.css` stojí na mobilu ~1,5 s (simulace). Bez `_headers` se assety ukládají do cache krátce. | LCP 3,3–3,4 s na mobilu (hranice „dobré“ je 2,5 s). | Minifikovat CSS (bez nové závislosti, jednorázově), `_headers` s `Cache-Control` pro `/assets/*` a fonty, zvážit inline kritické CSS hero. | S–M | P2 |
| C7 | **Mrtvé a nedokončené stránky:** 18 veřejných stránek (9 akcí × CZ/EN, např. `/blog/2025/klubove-setkani-pod-palavou/…`) obsahuje placeholder **„(Zde doplňte text reportáže…)“**. Nejsou v sitemapě ani ve výpisu blogu, ale jsou dostupné a bez `noindex`. Dál 2 rozbité odkazy (`networking-palava-14` odkaz „…“, relativní favicon v `ai-agenti-nova-era-byznysu`). | Riziko, že je zaindexuje Google nebo je najde AI. Vypadá to neprofesionálně. | Rozhodnout: dopsat, smazat (po schválení), nebo do té doby `<meta name="robots" content="noindex">`. Opravit 2 odkazy. | S | **P1** |
| C8 | Přístupnost: Lighthouse 96–100. Ručně viz B5, B8, B9. | – | – | – | – |

### D) AI search optimalizace (GEO)

#### D1 – `robots.txt` (jen popis, nic neměním) · **P1 (rozhodnutí), S**

**V repu:** `User-agent: * / Allow: /` + Sitemap.

**Na živém webu** (staženo 6. 11. 2026) Cloudflare **předřazuje „Cloudflare Managed content“**:

```
User-agent: *
Content-Signal: search=yes,ai-train=no,use=reference
Allow: /
# Training crawlers
User-agent: Amazonbot / Applebot-Extended / Bytespider / CCBot / ClaudeBot / Diffbot /
  Google-Extended / GPTBot / omgili / anthropic-ai / Claude-Web / cohere-ai /
  MistralAI-Training / meta-externalagent / GoogleOther / Baiduspider / PetalBot /
  Awario* / Google-CloudVertexBot / … (celkem ~30 agentů)
Disallow: /
```

Nastavuje se to v Cloudflare dashboardu (AI Crawl Control / Bot Preference Sync), ne v repu. Úprava `robots.txt` v repu to **nepřebije**.

| Bot | Stav | Co blokace znamená (podle dokumentace provozovatelů, viz pozn.) |
|---|---|---|
| Googlebot (Search, AI Overviews, AI Mode) | ✅ povolen | Google Search a AI Overviews se řídí Googlebotem. Tady v pořádku. |
| **Google-Extended** | ❌ zakázán | Trénink modelů Gemini **a grounding v aplikacích Gemini / Vertex AI**. Gemini tvůj web nemusí použít jako zdroj odpovědi. |
| GoogleOther, Google-CloudVertexBot | ❌ | R&D crawly Googlu, resp. Vertex AI agenti zákazníků. |
| GPTBot | ❌ | Jen trénink OpenAI. **ChatGPT search** používá OAI-SearchBot a ChatGPT-User, ty nejsou blokované. |
| ClaudeBot, anthropic-ai, Claude-Web | ❌ | Trénink Anthropic. Claude-SearchBot a Claude-User blokované nejsou. |
| PerplexityBot, Perplexity-User | ✅ | Nejsou v seznamu. |
| OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, Bingbot | ✅ | Nejsou v seznamu. Bing je zdroj i pro Copilot. |
| Applebot-Extended | ❌ | Trénink Apple modelů. Applebot pro Siri/Spotlight povolen. |

Pozn.: Chování botů vychází z dokumentace Googlu, OpenAI, Anthropicu, Perplexity a Applu, jak ji znám. Oficiální stránky jsem v této session nemohl znovu načíst (nepotvrzený přístup), takže před rozhodnutím doporučuju rychle ověřit hlavně Google-Extended.

**Varianty:**
- **A – nechat (dnešní stav).** Výhoda: obsah se netrénuje do modelů. Nevýhoda: slabší přítomnost v Gemini, ve tvé hlavní „AI“ značce.
- **B – povolit jen Google-Extended** (případně i Applebot-Extended). Gemini grounding funguje, ostatní tréninkoví boti zůstanou blokovaní. *Za mě nejlepší poměr pro lektora Google nástrojů.*
- **C – vypnout managed robots.txt úplně.** Maximální viditelnost, obsah půjde i do tréninku (GPTBot, ClaudeBot, CCBot…). Může zvýšit šanci, že tě modely znají i bez vyhledávání (neověřitelný efekt).
- **D – granularně:** povolit tréninkové boty velkých hráčů (GPTBot, ClaudeBot, Google-Extended), blokovat agregátory a scrapery (Bytespider, Diffbot, omgili…).
- Zároveň ověř v dashboardu, jestli neběží i **„Block AI bots“ na úrovni WAF**. To blokuje požadavky bez ohledu na `robots.txt`.

#### D2 – Obsah bez JavaScriptu · **P1, M**

| Stránka | Obsah v HTML bez JS |
|---|---|
| Homepage | ✅ vše kromě seznamu akcí |
| Články | ✅ |
| `/blog` | ❌ jen „Načítám články…“ (ověřeno i na produkci). Pro crawlery bez JS tam není jediný odkaz na článek. |
| Akce na homepage | ❌ |

Dnes to zachraňuje jen sitemap a `llms.txt`. **Návrh:** Python skript (stejný princip jako `generuj-llms-txt.py`, bez nových závislostí) vygeneruje do `blog.html` / `blog-en.html` mezi značky `<!-- ARTICLES:START/END -->` statický seznam všech článků. `blog-loader.js` nad ním dál dělá filtry a stránkování (progressive enhancement). Totéž pro akce.

#### D3 – Strukturovaná data (JSON-LD) · **P1, S (opravy) + M (rozšíření)**

Zjištěný stav (JSON syntakticky ověřen lokálně u všech 112 souborů):

| Typ | Stav |
|---|---|
| Person | jen `index` + `index-en`; bez `@id`, `worksFor`/`affiliation`, `identifier` (ev. č. ČAK), `hasCredential`, `alumniOf`, `areaServed`, `knowsLanguage` |
| LegalService / ProfessionalService | ❌ chybí |
| WebSite | ❌ chybí |
| Article | 83 ze 104 souborů blogu. Chybí v 18 placeholder stránkách + `novela-hlaseni-zamestnancu-2025` (CZ) + `ai-agenti-nova-era-byznysu` (EN). **`ai-slop-pred-nss` (CZ) má nevalidní JSON**: ASCII uvozovka v „AI slop" ukončí řetězec. Stejná chyba rozbije i `meta description` (zbude 45 znaků). |
| `dateModified` | ❌ **0×** na celém webu |
| Autor | **3 články (6 souborů) mají ve schema autora „Mgr. Gabriel Kožík“, ale viditelně jiného autora** (Natálie Bayerová: *Převod podílu*, *AI akt pro zaneprázdněné*; Nikola Schwarzová: *Slovník pojmů AI Actu*). Rozpor viditelného obsahu se schema porušuje pravidla Googlu a připisuje ti cizí práci. |
| BreadcrumbList | ❌ chybí (ani viditelná drobečková navigace) |
| FAQPage | ❌ chybí, přitom FAQ na homepage je skutečně ve formě otázek. (Google dnes FAQ rich results běžným webům nezobrazuje, přínos je hlavně pro ostatní parsery. Neověřený efekt.) |

**Návrh (kostra `@graph`, finální hodnoty doplníme po tvém rozhodnutí v sekci 5):**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://www.gabrielkozik.cz/#gabriel",
      "name": "Mgr. Gabriel Kožík",
      "honorificPrefix": "Mgr.",
      "jobTitle": "advokát",
      "url": "https://www.gabrielkozik.cz/",
      "image": "https://www.gabrielkozik.cz/assets/images/profilova-fotka.jpg",
      "identifier": { "@type": "PropertyValue", "propertyID": "ev. č. ČAK", "value": "19320" },
      "affiliation": { "@type": "LegalService", "name": "AK Petráš Rezek s.r.o." },
      "founder": { "@type": "Organization", "name": "Pálava Horizons, s.r.o." },
      "knowsAbout": ["obchodní právo", "korporátní právo", "smluvní právo", "AI Act", "GDPR", "AI compliance", "Google Gemini", "NotebookLM"],
      "knowsLanguage": ["cs", "en"],
      "hasCredential": [{ "@type": "EducationalOccupationalCredential", "name": "Základy kybernetické bezpečnosti", "recognizedBy": { "@type": "GovernmentOrganization", "name": "NÚKIB" } }],
      "sameAs": ["https://www.linkedin.com/in/gabriel-kozik/", "https://www.youtube.com/@gabriel-kozik", "…"]
    },
    {
      "@type": "LegalService",
      "@id": "https://www.gabrielkozik.cz/#advokat",
      "name": "Mgr. Gabriel Kožík, advokát",
      "provider": { "@id": "https://www.gabrielkozik.cz/#gabriel" },
      "address": { "@type": "PostalAddress", "streetAddress": "‹ověřit sídlo›", "addressLocality": "Brno", "postalCode": "‹›", "addressCountry": "CZ" },
      "areaServed": ["Brno", "Tišnov", "Jihomoravský kraj", "Česká republika"],
      "telephone": "+420720265713",
      "email": "info@gabrielkozik.cz",
      "taxID": "05187559"
    },
    { "@type": "WebSite", "@id": "https://www.gabrielkozik.cz/#web", "url": "https://www.gabrielkozik.cz/", "name": "Gabriel Kožík", "inLanguage": ["cs", "en"], "publisher": { "@id": "https://www.gabrielkozik.cz/#gabriel" } }
  ]
}
```

V článcích: `BlogPosting` s `author: {"@id": "…#gabriel"}` (nebo skutečný autor), `datePublished` + `dateModified`, `isPartOf` → WebSite, `BreadcrumbList`. Po nasazení validovat v Rich Results Test a validator.schema.org (offline jsem ověřil jen syntaxi).

#### D4 – Konzistence entity · **P1, S–M (po tvých rozhodnutích)**

| Údaj | Homepage text | Patička | Schema | Zásady GDPR | `llms.txt` | Stav |
|---|---|---|---|---|---|---|
| Jméno a titul | Mgr. Gabriel Kožík | ✅ | ✅ | ✅ | ✅ | ✅ |
| Profesní status | „advokacii vykonávám samostatně“ | „samostatný advokát“ | jen „Advokát“ | „advokát zapsaný… ev. č. 19320“ | „Samostatný advokát“ | ⚠️ **spolupráce s AK Petráš Rezek nikde** |
| Sídlo | – | Slovákova 279/11, Brno | totéž | totéž | „se sídlem v Brně“ | ⚠️ **Stejná adresa jako IUSTORIA** (`events.json`: „IUSTORIA, advokátní kancelář, Slovákova 279/11, Brno“). Ověřit proti seznamu advokátů ČAK po 1. 10. 2026. |
| Kontakty | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Komunita BforB | „Business for Breakfast Tišnov“ (foto) | – | – | – | – | ⚠️ zároveň „BforB Na Svratce“ a „logo BforB Tišnov“ |
| AI Act | „AI Act“ | – | „AI Act“ | – | i „AI akt“ | drobnost |

**IUSTORIA na webu (20 HTML souborů + `articles.json` 19× + `events.json` 7×):**
- **Historie, v pořádku nechat:** podcasty natočené v době IUSTORIA, reportáže (Týden inovací, CS-Tech Summit: „naše advokátní kancelář IUSTORIA byla partnerem“). Případně doplnit kontext „(v době, kdy jsem byl společníkem IUSTORIA)“.
- **Problematické (přítomný čas, aktivní propagace):** 8 stránek podcastů s blokem **„Sledujte nás i na sociálních sítích“** → YouTube, FB a IG IUSTORIA; excerpt „Sledujte novou epizodu podcastu advokátní kanceláře IUSTORIA“; „…proč stavíme na transparentnosti“. AI z toho může odvodit, že jsi stále v IUSTORIA.
- **Autor článku „Převod podílu“:** viditelně „Natálie Bayerová (IUSTORIA, AK)“, ve schema ty (viz D3).

#### D5 – Struktura článků · **P2, S (šablona) + M (obsah, po schválení textů)**

Kontrola 20 odborných článků:

| Kritérium | Stav |
|---|---|
| Odpověď na hlavní otázku hned v úvodu | ⚠️ Většina začíná příběhem nebo kontextem, odpověď přijde ve 3.–5. odstavci (např. *Když AI udělá chybu*). |
| Jasné H2/H3 | ✅ ano. H2 ve formě otázky jen výjimečně (Maiday, Označování AI obsahu). |
| Samostatně citovatelné shrnutí nebo definice | ❌ 0 ze 20 nemá blok „Ve zkratce“ nebo „Klíčové body“. |
| Autor a datum publikace viditelně | ✅ |
| Datum aktualizace | ❌ 0 ze 20. Problém hlavně u časově citlivých textů (AI Act, novela zaměstnávání cizinců). |
| Zdroje | ✅ Silná stránka, většina článků má sekci „Zdroje“. Pro GEO výborné. |

**Návrh šablony:** pod H1 box **„Ve zkratce“** (3 odrážky, první je přímá odpověď), řádek **„Aktualizováno: … · Stav právní úpravy k …“**, u pojmů krátké definice („**AI slop** je…“), na konci autor box. Obsah jednotlivých článků měnit jen po tvém schválení, návrhy budu dávat ve formátu před → po.

#### D6 – Meta tagy, canonical, hreflang, sitemap · **P2, S**

| Bod | Stav |
|---|---|
| Canonical | ✅ na všech stránkách |
| hreflang | ✅ CS/EN + x-default v HTML i sitemap (4 stránky bez EN verze správně bez hreflang) |
| `<title>` homepage | „Advokát pro novou dobu s AI \| Mgr. Gabriel Kožík“. Chybí obor a lokalita. Návrh v sekci 4. |
| Délka title | 56 ze 112 stránek má > 70 znaků (useknutí ve výsledcích). P3. |
| Meta description | `advokati-a-ai` (CZ) **chybí**; `ai-slop-pred-nss` rozbitá uvozovkou; excerpt *AI akt pro zaneprázdněné* v `articles.json`/`llms.txt` začíná „Cíl: … Obsah: …“ (únik zadání). |
| Sitemap | 92 URL, lastmod ✅, hreflang ✅. 18 placeholder stránek mimo sitemap (správně, ale viz C7). `priority` Google ignoruje (neškodí). |
| 301 ze starých URL | ✅ |

#### D7 – `llms.txt` · **P3, S**

**Už existuje** (od 3. 11. 2026), generuje se skriptem, struktura odpovídá návrhu llmstxt.org. **Přínos pro viditelnost v AI vyhledávačích zatím není ověřený:** žádný velký provozovatel veřejně nepotvrdil, že ho používá pro ranking nebo citace. Je to levná pojistka, ne páka.

Návrhy úprav:
- doplnit profesní status (spolupráce s AK Petráš Rezek, pokud ji budeš komunikovat) a ověřené sídlo,
- sekce **„AI školení“** s odkazem na `ai-workshop.cz` (dnes chybí, druhá role tam není),
- opravit popis *AI akt pro zaneprázdněné* („Cíl:…“),
- Maiday reportáž přesunout z „Odborné články“ do reportáží, nebo ponechat záměrně,
- u článků jiných autorů uvést autora.

#### D8 – Veřejně dostupné pracovní soubory · **P2, S**

Ověřeno na produkci (HTTP 200): `/_pracovni/sablona-clanku/sablona-clanku` (title `{{TITULEK}} | Mgr. Gabriel Kožík`, s canonical na placeholder URL) a `/Claude%20outputs/Code.gs`. Nasazují se i SVG zdroje a `zakon_o_platformove_praci.txt`. Řešení (po schválení): přesunout mimo repo nebo do ignorované složky, případně nastavit výstupní adresář Pages.

### E) Profesní a právní kontrola (jen označuji, neřeším)

| ID | Zjištění | Opora | Riziko |
|---|---|---|---|
| E1 | **§ 435 OZ:** na homepage, blogu a v zásadách GDPR je jméno, sídlo, IČO a údaj o zápisu (ev. č. ČAK). **104 stránek článků (a 404) má patičku jen s copyrightem.** | § 435 odst. 1 OZ (znění od 1. 1. 2026): podnikatel uvádí „v rámci informací zpřístupňovaných veřejnosti prostřednictvím dálkového přístupu své jméno a sídlo… údaj o svém zápisu… Byl-li podnikateli přidělen identifikující údaj, uvede i ten.“ Na úrovni webu je povinnost splněna. Jednotná patička je bezpečnější a pomáhá i entitě. | nízké |
| E2 | **Sídlo:** Slovákova 279/11 = adresa IUSTORIA. Pokud se po 1. 10. 2026 změnila adresa sídla v seznamu advokátů, je údaj na webu, ve schema, v zásadách GDPR i v `llms.txt` nesprávný. | § 435 OZ; správnost identifikace správce v zásadách GDPR (čl. 13 odst. 1 písm. a) GDPR) | **ověřit** |
| E3 | **Údaje o advokátovi:** ev. č. 19320 ✅, odkaz na ČAK ✅ (vede na homepage cak.cz; lepší je přímý odkaz do vyhledávače advokátů). **Spolupráce s AK Petráš Rezek s.r.o. nezmíněna.** Zda a jak ji uvádět, záleží na smlouvě o spolupráci a vaší dohodě. | zákon č. 85/1996 Sb.; smlouva o spolupráci | rozhodnutí |
| E4 | **Cookies:** GA4 až po souhlasu ✅, rovnocenná tlačítka ✅, odvolání v patičce ✅. **16 vložených YouTube přehrávačů (`www.youtube.com/embed`) se ale načte bez souhlasu** a ukládá do zařízení identifikátory Googlu. | § 89 odst. 3 zákona č. 127/2005 Sb. (souhlas s ukládáním neopomenutelných dat) | **střední až vyšší** |
| E5 | **Zásady GDPR** nezmiňují YouTube (přehrávače a náhledy `img.youtube.com`), rezervaci přes Google Kalendář, hosting a logy Cloudflare. Poznámka u formuláře říká „použiji jen k tomu, abych vám odpověděl“, zásady i „domluvit spolupráci“. Ověřit, že Apps Script běží pod Workspace účtem s DPA, ne pod soukromým Gmailem. | čl. 13 GDPR | střední |
| E6 | **Reklamní formulace** (konkrétní texty před → po v sekci 4): **„…a ručí za výsledek“** (příslib výsledku); „strategickou koncepci smlouvy, která má doručit víc, než čekáte“ / FAQ „doručit výsledek nad vaše očekávání“; „Dostanete komplexnější službu za kratší čas“ (skryté srovnání s jinými advokáty); „Právníci na vás chrlí třicetistránkové dokumenty žargonem…“ (paušálně o kolezích); „Nejsem školitel, který zná zákony“ (nízké). Superlativ „nejlepší“ ani „garantujeme“ na webu **nenalezen** ✅. | Etický kodex ČAK (usn. představenstva č. 1/1997 Věstníku), **čl. 25**: informace musí být „přesné, nejsou klamavé a respektují povinnost mlčenlivosti“ (podle Advokátního deníku 2024). Ustanovení o důstojnosti stavu a kolegialitě (čísla článků ověřit v aktuálním znění, cak.cz se mi nepodařilo načíst). OZ § 2976 (generální klauzule nekalé soutěže), **§ 2977** (klamavá reklama), **§ 2980** (srovnávací reklama). | **„ručí za výsledek“ vyšší**, ostatní nízké až střední |
| E7 | **„30+ odborných článků o právu a AI“** (trust bar): blog má 20 odborných článků, z toho 3 od jiných autorek, plus 6 podcastů. Bez doložení jinde (LinkedIn, odborná periodika) jde o nepřesné tvrzení. | EK čl. 25; OZ § 2977 | **střední** |
| E8 | **Absolutní tvrzení o datech:** „Vaše data neopustí kancelář“, „žádná klientská data nikdy neprocházejí veřejnými AI nástroji“, „Pracuji výhradně v uzavřeném, zabezpečeném prostředí“. Vlastní zásady GDPR přitom uvádějí zpracování v Google Workspace s možným předáním do USA. | EK čl. 25 (přesnost); OZ § 2977; konzistence se zásadami GDPR | **střední** |
| E9 | **Autorství:** schema připisuje tobě 3 články kolegyň. Článek z doby IUSTORIA („Natálie Bayerová (IUSTORIA, AK)“) na osobním webu: ověřit souhlas autorky / IUSTORIA s dalším zveřejněním. | autorské právo, poctivost informací (čl. 25 EK) | nízké až střední |
| E10 | **IUSTORIA v přítomném čase** (výzvy „Sledujte nás“ na kanály IUSTORIA). Zkontroluj, zda vypořádací dokumentace neobsahuje ujednání o užívání značky nebo materiálů. | smluvní | rozhodnutí |
| E11 | Tvrzení „10+ let právní praxe“ jsem neověřoval. Pravděpodobně v pořádku (včetně koncipientské praxe), jen mít podklad. | EK čl. 25 | nízké |

---

## 3. TOP 10 změn (dopad ÷ náročnost)

| # | Změna | Řeší | Nár. | Pri. | Potřebuje tvoje rozhodnutí/texty? |
|---|---|---|---|---|---|
| 1 | **Hero: viditelné CTA na tmavém pozadí + doplnit obory, lokalitu a AI školení pod H1** | A1, C1 | S | P1 | ano, texty (sekce 4) |
| 2 | **Opravy schema a meta bez rizika:** nevalidní JSON-LD (`ai-slop`), správní autoři u 3 článků, chybějící Article ve 2 článcích, chybějící/rozbité meta description, `dateModified` | D3, D6, E9 | S | P1 | ne |
| 3 | **18 placeholder stránek „Zde doplňte…“ → `noindex`** (smazat nebo dopsat po tvém rozhodnutí) + 2 rozbité odkazy | C7 | S | P1 | ano (smazat × noindex) |
| 4 | **CLS/LCP v článcích:** rozměry obrázků, úvodní obrázek bez lazy-load, `fetchpriority` | A4 | S–M | P1 | ne |
| 5 | **Rizikové formulace a čísla** („ručí za výsledek“, „30+“, „data neopustí kancelář“, „Právníci na vás chrlí…“) | E6–E8 | S | P1 | ano, texty |
| 6 | **Navigace v článcích na mobilu** (hamburger jako na homepage) | B1 | M | P1 | ne |
| 7 | **Konec článku:** jednotná patička s identifikací + autor box + opravený CTA box (staré CSS proměnné) | B2, C2, A3, E1 | M | P1 | ano, text autor boxu |
| 8 | **YouTube bez souhlasu → `youtube-nocookie` + načtení až po kliknutí** (statický náhled, bez nové knihovny) + doplnění zásad GDPR | E4, E5 | M | P1 | ano, text zásad |
| 9 | **Statický výpis článků na `/blog` (a akcí)** generovaný Python skriptem, JS jen filtruje | D2, B6 | M | P1 | ne |
| 10 | **Entita:** rozšířené `@graph` (Person + LegalService + WebSite + BreadcrumbList + FAQPage), sjednocení sídla, spolupráce a IUSTORIA výzev, úprava `llms.txt` | D3, D4, D7, E2, E3, E10 | M | P1 | ano (sekce 5) |

**Mimo TOP 10, ale vlastně jen jedno kliknutí:** rozhodnutí o Google-Extended v Cloudflare (D1). Je to zásah mimo repo, proto ho nedělám, jen ho doporučuju zvážit hned.

---

## 4. Návrhy textových úprav (před → po), čekají na schválení

| Místo | Před | Po (návrh) |
|---|---|---|
| Hero – podtitulek | „Pomáhám majitelům firem podnikat bez právního chaosu. Srozumitelně, bez třiceti stran paragrafů — a s jistotou, že vaše data a firemní know-how zůstanou v bezpečí.“ | „Obchodní a korporátní právo, smlouvy a AI compliance pro majitele malých a středních firem v Brně, na Tišnovsku i online. Srozumitelně, bez třiceti stran paragrafů. A k tomu praktická AI školení pro týmy, která vede advokát.“ |
| Hero – CTA | „Nezávazná konzultace“ | „Rezervovat 30 min zdarma“ (+ sekundárně „Zavolat“) |
| `<title>` homepage | „Advokát pro novou dobu s AI \| Mgr. Gabriel Kožík“ | „Mgr. Gabriel Kožík – advokát Brno \| obchodní právo a AI compliance“ |
| #situace | „Potřebujete partnera, který vám obojí přeloží — a ručí za výsledek.“ | „Potřebujete partnera, který vám obojí přeloží a za svou práci nese plnou profesní odpovědnost.“ |
| #situace | „Právníci na vás chrlí třicetistránkové dokumenty žargonem, kterému nerozumíte.“ | „Dostáváte třicetistránkové dokumenty plné žargonu, kterému nerozumíte?“ |
| Trust bar | „30+ odborných článků o právu a AI“ | „20+ odborných článků o právu a AI“ *(nebo „40+ článků, podcastů a reportáží“, obojí odpovídá blogu)* |
| Jak pracuji | „…stavím strategickou koncepci smlouvy, která má doručit víc, než čekáte.“ | „…stavím strategickou koncepci smlouvy šitou na míru vašemu byznysu.“ |
| Jak pracuji | „Dostanete komplexnější službu za kratší čas.“ | „Rutinu automatizuji, takže víc času zbude na strategii pro váš byznys.“ |
| Jak pracuji – nadpis | „Vaše data neopustí kancelář“ | „S vašimi daty zacházím jako s advokátním tajemstvím“ |
| Jak pracuji / FAQ | „Sám používám výhradně oddělené, zabezpečené prostředí…“ / „žádná klientská data nikdy neprocházejí veřejnými AI nástroji“ | „Do AI nástrojů nevkládám nic, co by vás mohlo identifikovat, a používám jen služby, které vaše data smluvně nepoužívají k tréninku.“ *(uprav podle skutečného nastavení, musí to sedět na 100 %)* |
| FAQ | „…která má doručit výsledek nad vaše očekávání.“ | větu vypustit |
| O mně (pokud budeš chtít) | „…a advokacii vykonávám samostatně — se mnou jednáte vždy napřímo.“ | „…advokacii vykonávám samostatně, ve výhradní spolupráci s AK Petráš Rezek s.r.o. Se mnou jednáte vždy napřímo.“ |
| Konec článku (nový) | – | **Autor box:** „Mgr. Gabriel Kožík – advokát (ev. č. ČAK 19320) se zaměřením na obchodní a korporátní právo a AI compliance. Vede AI školení pro firmy.“ + CTA „Řešíte podobnou situaci? Úvodních 30 minut je zdarma.“ |

Drobné překlepy, na které jsem narazil (opravím jen se souhlasem): *Odpovědnost za chyby AI*: „nepřekonatelná překážku“ → „nepřekonatelnou překážku“, „pod taktovkem“ → „pod taktovkou“; patička téhož článku „vyhrazená“ → „vyhrazena“. Obsahovou a právní správnost článků jsem v tomto auditu nekontroloval.

---

## 5. Co potřebuju rozhodnout od tebe

1. **Sídlo:** platí v seznamu advokátů pořád Slovákova 279/11, 602 00 Brno?
2. **AK Petráš Rezek s.r.o.:** komunikovat na webu a ve schema? Jakou formulací (a smí se použít název nebo logo)?
3. **Cloudflare a AI boti:** varianta A / B / C / D (D1)?
4. **18 placeholder stránek:** smazat, nebo zatím `noindex`?
5. **IUSTORIA:** historii nechat, výzvy „Sledujte nás“ odstranit? Přidat kontextovou poznámku?
6. **Články kolegyň:** ponechat se správným autorem, nebo stáhnout?
7. **`AUDIT.md`, `CHANGELOG-optimalizace.md`, `Claude.md.txt`:** do `.gitignore`?
8. **Samostatné stránky** `/o-mne`, `/sluzby`, `/skoleni` (C4): chceš je? Jde o změnu struktury.

---

### 5.1 Rozhodnutí (6. 11. 2026)

| # | Otázka | Rozhodnutí |
|---|---|---|
| 1 | Sídlo | Slovákova 279/11, 602 00 Brno **platí**. |
| 2 | AK Petráš Rezek | **Zatím veřejně neoznamovat.** Na webu, ve schema ani v `llms.txt` nic. |
| 3 | AI boti | **Varianta C:** managed robots.txt v Cloudflare vypnout úplně (provede Gabriel v dashboardu). |
| 4 | 18 placeholder stránek | **Zatím `noindex`.** ✅ hotovo (dávka 1) |
| 5 | IUSTORIA | Výzvy „Sledujte nás“ **odstranit** ✅ hotovo (dávka 1). **Přidat kontextovou poznámku** (text čeká na schválení). |
| 6 | Články kolegyň | **Ponechat** se správným autorem ✅ schema opraveno (dávka 1). |
| 7 | `.gitignore` | **Ano** ✅ hotovo (dávka 1). |
| 8 | Samostatné stránky `/o-mne`, `/sluzby`, `/skoleni` | **Ne.** |
| – | Hero / TOP 10 #1 | **Lokalitu doplnit.** AI školení zatím vynechat (žádný aktivní kurz). Případně transformovat na AI compliance / školení na míru. |
| – | Repo | Udělat pořádek ve struktuře (pracovní a staré verze). Plán navržen v chatu. |

### 5.2 Nové zjištění: regrese obrázků z commitu „obrazky profi“ (8d54752, 17. 7. 2026)

Hromadná náhrada hlavních obrázků za nové `header.jpg` přepsala i **ilustrace uvnitř článků**. Články teď místo screenshotů ukazují opakovaně úvodní obrázek, a alt texty přitom popisují něco jiného:

| Článek | Odpojený obrázek (soubor v repu stále je) | Stav |
|---|---|---|
| Jak si jednoduše personifikovat Gemini (CZ+EN) | `gemini-context-settings.png`, `gemini-menu.png` | jisté: `header.jpg` je v článku 3× |
| Jak správně označovat AI obsah (CZ+EN) | `oznacovani-ai-obsahu.jpg`, `ailoga.jpg` | jisté: `header.jpg` je v článku 2× |
| AI Act pro zaneprázdněné | `eu-ai-act.jpg` | ověřit (možná záměrná náhrada hlavního obrázku) |
| Zákon o platformové práci | `zakon_o_platformove_praci.jpg` (infografika) | ověřit |

**Tyto soubory při úklidu nemazat.** Patří zpět do článků.

## 6. Slabá místa (pohled skeptika)

- **Lighthouse není produkce.** Měřil jsem lokálně, bez HTTP/2, Brotli a CDN cache Cloudflare. Absolutní čísla berte orientačně. Před i po změnách doporučuju PageSpeed Insights na produkční URL (reálná data CrUX, pokud jich web má dost).
- **GEO je pohyblivý cíl.** Efekt `llms.txt`, FAQPage i rozšířeného schema na citace v ChatGPT, Gemini nebo Perplexity nikdo nezaručí. Spolehlivě pomáhá jen čitelné HTML, jasná entita a kvalitní, citovatelný obsah. Na to je audit postavený.
- **Povolení Google-Extended je trade-off.** Získáš grounding v Gemini, ale obsah půjde i do tréninku. Konkurent nebo AI pak může tvoje vysvětlení používat bez odkazu. Je to rozhodnutí o značce, ne technika.
- **Opravené formulace oslabí marketingový náboj.** „Ručí za výsledek“ prodává líp. Jeden screenshot od kolegy ve stížnosti na ČAK ale stojí víc než pár konverzí.
- **Citace stavovských předpisů jsou z druhé ruky.** Etický kodex jsem nemohl načíst z cak.cz. Čl. 25 vychází z Advokátního deníku (2024). Čísla dalších článků před použitím ověř v aktuálním znění.
- **Údržba.** Víc stránek, statický výpis blogu a autor boxy přidávají práci solo praxi. Proto navrhuju generovat je jedním Python skriptem (stejně jako `llms.txt`), ne ručně.
- **Skeptický klient** stále nevidí sociální důkaz: reference, případové studie ani jména klientů (mlčenlivost to omezuje). Důvěru dnes nesou jen přednášky, certifikáty a fotky. Do budoucna zvážit anonymizované „typické situace, které řeším“.
- **Duplicitní cesta ke školení.** Karta školení odkazuje hned ven na `ai-workshop.cz`. Pro AI vyhledávače tak druhá role na `gabrielkozik.cz` skoro neexistuje.

---

*Metodika: statická analýza všech 112 HTML souborů skriptem (titulky, meta, canonical, hreflang, JSON-LD, obrázky, autoři), crawl interních odkazů proti lokálnímu serveru, screenshoty Playwright (375 a 1440 px), Lighthouse 12 (mobil i desktop), ruční kontrola textů a živého `robots.txt`, `/blog` a `_pracovni` na produkci.*
