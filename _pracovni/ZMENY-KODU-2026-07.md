# Změny kódu — červenec 2026

Souhrn čtyř etap práce na branchi `pokusy`: úklid, design tokeny, vlna 1
(zklidnění vizuálu), vlna 2 (dokončení systému) a dva bugfixy z produkčního
náhledu. Nahrazuje dílčí reporty, které jsou v `_pracovni/_archiv/`.

---

## Stav před a po

| Metrika | Před | Po |
|---|---|---|
| `style.css` | 2 274 řádků, 322 pravidel | 2 330 řádků, 297 pravidel |
| `!important` | 5 | **0** |
| Tokenů v `:root` | 8 | 52, **0 nepoužitých** |
| Aliasů proměnných | 8 | **0** |
| Hardcoded barev mimo `:root` | 24 | 2 (lightbox) |
| Hardcoded `box-shadow` | 20 | **0** |
| Hardcoded `border-radius` | 13 | 2 (šipky lightboxu) |
| Duplicitních selektorů s kolizí | 9 | **0** |
| `transition: all` | 8 | **0** |
| `min-height` hacky | 2 | **0** |
| Emoji v CSS | 1 | **0** |
| Mrtvých 3rd-party skriptů | 3 | **0** |
| Nepoužitých CSS komponent | 13 | **0** |
| Externích požadavků na článek | 4 | 1 |

Verifikace na konci každé etapy: tinycss2 0 chyb, 5/5 JS souborů syntakticky
OK, 103 HTML strukturálně v pořádku, 0 nespárovaných `<svg>`.

---

## 1. Úklid (bez změny vzhledu)

Ověřeno strojově: pro každý selektor porovnán výsledný stav deklarací
před/po. Všech 46 rozdílů bylo záměrných.

**Smazaný mrtvý kód** — ověřeno proti 103 HTML **a 5 JS** souborům (loadery
generují markup dynamicky): `.hero-kicker`, `.service-card-fr`, celá sekce
workshopu (`.workshop-*`), `#mission blockquote` (v žádném HTML není
`id="mission"`), sezónní ID z 2025, `.article-detail-content`,
`.gallery-stack`, `.hidden-svg`, `.services-grid-3`.

**Devět kolizí**, kde výsledek závisel na pořadí pravidel v souboru. Sloučeno
na hodnotu, která reálně vyhrávala. Nejzávažnější: `.form-input` vs.
`.form-container input` — **dva systémy stylovaly stejná pole** a polovina
deklarací v `.form-input` byla mrtvá.

**Pět `!important`** bylo tam kvůli tomu, že globální `h1 { font-size: 2.5em
!important }` se na mobilu bil s `.hero h1` a `.article-header h1`. Ověřeno,
že každý `<h1>` na webu je v `.hero`, `.article-header` nebo `.page-header`,
takže globální pravidlo dopadalo jen na `.page-header h1`. Nahrazeno
explicitním selektorem.

**Fonty:** Space Grotesk se načítal v 93 souborech a nepoužíval se nikde.
Lora se tahala `@import`em uvnitř `style.css` → řetězený požadavek, nadpisy
problikávaly. Přesunuta do `<link>`. Odstraněno 8 duplicitních `preconnect`.

**Mrtvé skripty:** smsticket.cz widget vkládal `main.js` na *každou* stránku
webu, nepoužíval se nikde. Vercel Analytics stub v `main.js` + 5 článcích —
web běží na Netlify/Cloudflare, žádný Vercel skript se nenačítá. Calendly se
načítal i na blogu, kde není žádný popup call.

**Struktura:** `style.css` má obsah nahoře a 16 sekcí, kde každá komponenta
včetně své responsivity leží na jednom místě. Dřív se `.hero` řešil na třech
místech a mobilní chování bylo v jednom 117řádkovém `@media` bloku na konci,
který míchal nav, hero, akce, blog i patičku.

---

## 2. Design tokeny

`:root` má 52 tokenů: barvy, prostor na 4px mřížce, fluidní typografická
stupnice, tři zaoblení, čtyři úrovně elevace, dva obrysy, jedna easing funkce.

**Dvě věci, které stojí za zapamatování:**

Všechny stíny jsou v navy odstínu, ne v neutrální černé. Neutrálně černý stín
dělá weby „špinavé".

Barvy pro tmavé pozadí mají vlastní dvojici (`--on-deep`, `--on-deep-muted`).
Při přechodu na tokeny se málem rozbila patička: `--ink-muted` má na bílé
5,44:1, ale na navy jen **2,9:1** — původní `#94a3b8` tam mělo 6,16:1.

**Prostor** jede na 4px mřížce s tokeny pojmenovanými podle hodnoty
(`--sp-4` … `--sp-128`). Osmičkový základ nefungoval — v souboru bylo 29× 20px
a 5× 12px, tedy třetina hodnot mimo mřížku. Postup byl ověřený skriptem, který
dopočítal efektivní pixely u všech 271 deklarací: přejmenování 0 rozdílů,
snapnutí hodnot na mřížce 0 rozdílů, pak 32 záměrných posunů o 1–4px.
**Hodnoty pod 20px zůstaly literálem** — jsou to optická doladění.

---

## 3. Vlna 1 — zklidnění vizuálu

**Zebra pruhy ven.** `section:nth-child(2n)` bylo největší „2015 Bootstrap"
znamení — automatické střídání bílá/šedá říká „nevěděl jsem, jak sekce
oddělit, tak jsem je obarvil". Povrchy se teď přiřazují v HTML třídou:
tint na *Situaci*, *Certifikace*, *O mně*, *FAQ*, zbytek bílá, tři tmavé
kotvy (trust bar, citát, patička) na jednom odstínu `--navy-900`.

**Vzduch** v sekcích z 52px na `clamp(64px, 8vw, 128px)`.

**Navigace ztichla:** odkazy z `1.15em / weight 700` na `0.95rem / weight 500`,
logo z 1.3em na 1.05rem, fotka z 40px s šedým prstencem na 36px s vlasovou
linkou, hover je podtržení vyjíždějící zleva místo změny barvy.
Vedlejší nález: mobilní roletka měla `top: 60px`, ale navigace byla vysoká
~70px — plavala s mezerou. Teď z `--nav-h`.

**Hovery:** karty z `translateY(-12px) scale(1.03)` na `-4px`, žádné
`scale(1.1)` na ikonách a logách, galerie jen stín.

**Kontrasty:** odkazy z 3,20 na 5,29 (`--bronze-600`), meta z 2,56 na 5,44
(`--ink-muted`), patička na 8,69 (`--on-deep-muted`). Bronz `#b8873b` zůstal
**jen na dekoraci** — devět míst s bronzem na textu přepnuto.

**Hero:** zrušen `background-attachment: fixed` (u `fixed` se `cover` počítá
proti viewportu, ne proti elementu → crop byl loterie napříč rozlišeními),
odstraněn `.hero:hover` (měnil `background-image`, což neinterpoluje — jen
probliklo; na dotyku nefungoval vůbec), zahozen `text-shadow` a zesílen scrim.

**Typografie:** prostrkání se skaluje (`-0.025em` na h1/h2, **0 na h4–h6**).
Nadpisy jedou na `clamp()` stupnici, takže zmizely dva mobilní `@media`
přepisy i globální `h1 { !important }`.

---

## 4. Vlna 2 — dokončení systému

**`min-height` hacky ven.** `4rem` na `h3` a `6rem` na prvním `<p>` fungovaly
na jednom rozlišení. Subgrid, který byl v plánu, jsem **nepoužil** — při
kontrole markupu se ukázalo, že `.service-card` má dvě podoby (6 dětí ve
Službách, 2 v Jak pracuji) a subgrid potřebuje pevný počet řádků.

**Nález: primární karta služby měla akcent dvakrát** — `border-top: 4px` na
kartě *a navíc* 4px gradientní pruh z `::before`, tedy 8 px bronzu.
Silové linky ztenčené: pruhy na 2–3px, `border-left` u akcí a pain listu
ze 4px na 2px, zvýrazněná akce z 5px na 3px.

**Citát v článcích:** kurzíva 1.2em v šedém boxu se `border-radius: 0 5px 5px 0`
nahrazena Lorou bez kurzívy a 2px bronzovým pravidlem.

**Dva bugy vypadlé při rušení aliasů:**

`--light-gray` jako 1px border byl **neviditelný** — `.article-header` a
`.sources-section` měly `border: 1px solid #f7f8fa`, což je proti bílé
kontrast 1,06:1.

Hover na CTA tlačítku **propadal kontrastem**: bílý text na `#b8873b` = 3,20:1.
Teď `--bronze-600` = 5,29:1.

---

## 5. Bugfixy z produkčního náhledu

Oba bugy jsem způsobil já a ani jeden nešel odhalit bez prohlížeče.

**Sociální ikony v patičce byly šedé čtverce.** Můj `filter: brightness(0)
invert(1)` byl principiálně vadný nápad. PNG nejsou siluety glyfů, ale **plné
dlaždice s vyseknutým bílým glyfem** — `brightness(0)` udělá ze všech
neprůhledných pixelů černou *včetně bílého „in"*, `invert(1)` je obarví na
bílo. Výsledek: jednolitý čtverec. Žádný CSS filtr to nespraví, filtr neumí
vysekávat; `mask-image` taky ne, protože alfa kanál je celá dlaždice.

Nahrazeno 43 monochromatickými inline SVG ve 13 souborech, dědí barvu přes
`currentColor`. `share-buttons.js` přešel taky — a tím **padla celá funkce
`getIconBase()`**, která dopočítávala relativní cestu k ikonám podle hloubky
složky. Čtyři PNG (80 kB, z toho Instagram 48 kB) jsou nepoužité.

**Text v kartách „Jak sám pracuji s AI" plaval u dna.** Můj vlastní fix z vlny
2: `.service-card > p:last-child { margin-top: auto }` měl přilepit CTA odkaz
ke dnu. Ale v sekci Jak pracuji je odstavec *jediný obsah karty*, takže
dostal `margin-top: auto` a text spadl dolů. Opraveno vazbou na předcházející
`<ul>`, který mají jen karty ve Službách.

---

## Konvence pro další práci

Zapsané v hlavičce `style.css`:

- Každá komponenta má svou responsivitu hned pod sebou, ne na konci souboru.
- Breakpointy jen 680 / 768 / 900 / 1024 px.
- Žádné `!important` — když ho potřebuješ, je špatně napsaný selektor.
- Jeden selektor = jedno místo v souboru.
- Barvy, stíny, zaoblení a velikosti písma vždy z tokenu.
- Layoutový prostor (≥ 20px) z `--sp-*`, pod 20px literál.
- `--bronze-500` dekorace, `--bronze-600` text na světlém, `--bronze-200`
  text na tmavém. Na tmavém pozadí `--on-deep*`, nikdy `--ink-*`.

---

## Co zbývá

**Vlna 3 — obrázky.** Největší zbývající výhra:

| Soubor | Váha | Problém |
|---|---|---|
| `profilova-fotka.jpg` | 197 kB | 1118×1118 px zobrazená ve **36 px** v navigaci |
| `workshop-ai-google.jpg` | 240 kB | bez AVIF/WebP |
| `hero-pod-palavou.jpg` | 217 kB | jediná velikost pro mobil i 4K |
| `uvodni-obrazek.jpg` | 155 kB | bez responzivních variant |

Plus hero jako `<picture>` se `srcset` a focení podle shot listu.

**Čtyři osiřelé články** nepoužívají `style.css` vůbec — mají 160 řádků
inline CSS se starou tyrkysovou paletou (`#0a2342` + `#2ca58d`, font Roboto):
`cs-tech-summit-2025` a `firemni-kultura-alveno`, obě jazykové verze.
Vypadají jako z jiného webu.

**Dva známé bugy**, záměrně nechané (opravy na jeden řádek): 40px mezera nad
titulky blogových karet (`.article-card .article-content h2` nepřepisuje
`margin-top: 40px`), focus ring formuláře bez animace.

**Stylelint v CI** — konvence v hlavičce vydrží jen dokud je někdo čte.
