# Checkpoint — červenec 2026

Branch `pokusy`. Uzavírá úklid + vlnu 1 + vlnu 2 + dva bugfixy z produkčního
náhledu. Design systém je hotový, vizuál zklidněný, kód bez dluhů z minulosti.

Opravy v tomto kroku: **15 souborů** — `style.css` (+45/−34),
`share-buttons.js` (+10/−15), 13 HTML po 3–4 řádcích.

---

## Dva bugy ze screenshotů — a co za nimi bylo

### 1. Sociální ikony v patičce byly šedé čtverce

Můj `filter: brightness(0) invert(1)` byl **principiálně vadný nápad.**

Zkontroloval jsem PNG pixel po pixelu: rohy jsou průhledné (alfa 0), ale logo
samotné **není silueta glyfu — je to plná dlaždice s vyseknutým bílým glyfem.**
`brightness(0)` udělá ze všech neprůhledných pixelů černou (včetně bílého „in"
nebo „f"), `invert(1)` je pak všechny obarví na bílo. Výsledek: jednolitý bílý
zaoblený čtverec. Přesně to, co jsi viděl.

Žádná varianta CSS filtru to nespraví — filtr neumí něco vyseknout.
Ani `mask-image` z toho PNG ne, protože alfa kanál je celá dlaždice.

**Oprava:** monochromatická inline SVG, 43 ikon ve 13 souborech. Dědí barvu
přes `currentColor`, takže v patičce jsou `--on-deep-muted` a v článcích
`--ink-muted`, hover bronz. Glyfy jsem si před nasazením vyrenderoval
a zkontroloval — všechny čtyři jsou čitelné a konzistentní jako sada.

**Dva vedlejší úklidy, které z toho vypadly:**

`share-buttons.js` pořád tahal `facebook.png` a `linkedin.png`, takže by
sdílecí tlačítka v článcích zůstala plnobarevná, zatímco patička je
monochromatická. Přešly taky na inline SVG — a tím **padla celá funkce
`getIconBase()`**, která dopočítávala relativní cestu k ikonám z odkazu na
favicon podle hloubky složky. Inline SVG žádnou cestu nepotřebuje.
Skript je o 5 řádků kratší a o jednu chytrost hloupější.

**Čtyři PNG jsou teď nepoužité** — dohromady **80 kB**, z toho Instagram sám
48 kB. Ze sandboxu je nesmím smazat, udělej to prosím ty:

```
git rm assets/images/linkedin.png assets/images/facebook.png assets/images/instagram.png assets/images/youtube.png
```

### 2. Text v kartách „Jak sám pracuji s AI" plaval u dna

Můj vlastní fix z vlny 2. Zrušil jsem `min-height` hacky a přidal:

```css
.service-card > p:last-child { margin-top: auto; }
```

Záměr: přilepit CTA odkaz ke dnu karty, aby byly odkazy zarovnané.
Problém: `.service-card` má **dvě různé podoby**, což jsem v tom selektoru
nedomyslel. V sekci Služby je posledním potomkem odstavec s odkazem — správně.
V sekci Jak pracuji je odstavec **jediný obsah karty**, takže dostal
`margin-top: auto` a text spadl ke dnu. U delšího textu to nebylo vidět,
u kratších dvou ano.

**Oprava:** `.service-card > ul + p:last-child` — vazba na předcházející `<ul>`,
který mají jen karty v Službách. Napsané v komentáři přímo u pravidla, ať to
příště někdo (včetně mě) nerozbije stejným způsobem.

---

## Poznámka k mé práci

Oba bugy jsem způsobil já a oba jsem nemohl odhalit bez prohlížeče — u ikon
by stačilo podívat se, u karet taky. Předtím jsem to psal do každého reportu
jako slabé místo; teď je to potvrzené: **strojová verifikace odhalí syntax,
kontrast a mrtvý kód, ale ne to, jak věc vypadá.**

Chrome extension se mi ani teď nepřipojila (`Claude in Chrome is not
connected`), takže i tenhle fix je ověřený jen výpočtem a rasterizací SVG
mimo stránku. Screenshoty od tebe jsou pořád nejrychlejší cesta.

---

## Stav po checkpointu

| Metrika | Před | Nyní |
|---|---|---|
| `!important` | 5 | **0** |
| Tokenů v `:root` | 8 | 52, **0 nepoužitých** |
| Aliasů proměnných | 8 | **0** |
| Hardcoded barev mimo `:root` | 24 | 2 (lightbox) |
| Hardcoded stínů | 20 | **0** |
| Duplicitních selektorů | 9 | **0** |
| `min-height` hacky | 2 | **0** |
| Emoji v CSS | 1 | **0** |
| Mrtvých 3rd-party skriptů | 3 | **0** |
| Nepoužitých CSS komponent | 13 | **0** |
| Externích požadavků na článek | 4 | 1 |
| Váha nepoužitých PNG | — | 80 kB k smazání |

Verifikace: tinycss2 0 chyb, 5/5 JS souborů syntakticky OK, 103 HTML
strukturálně v pořádku, 0 nespárovaných `<svg>`, 0 odkazů na smazané PNG.

---

## Co po checkpointu zkontrolovat v prohlížeči

- [ ] **patička** — ikony jsou glyfy, ne čtverce; hover je bronzový
- [ ] **karty Jak pracuji s AI** — text začíná nahoře u všech třech
- [ ] **karty Služby** — CTA odkazy pořád zarovnané u dna
- [ ] **sdílecí tlačítka v článku** — monochromatická, hover bronz
      (zkus článek `podcast-dohody-pres-whatsapp`)
- [ ] ikony v článcích, které mají sociální odkazy v těle textu

---

## Co zbývá

**Vlna 3 — obrázky.** Největší zbývající výhra a jediná věc, která reálně
posune „dechberoucí":

| Soubor | Váha | Problém |
|---|---|---|
| `profilova-fotka.jpg` | 197 kB | 1118×1118 px zobrazená ve **36 px** v navigaci |
| `workshop-ai-google.jpg` | 240 kB | bez AVIF/WebP |
| `hero-pod-palavou.jpg` | 217 kB | jediná velikost pro mobil i 4K |
| `uvodni-obrazek.jpg` | 155 kB | bez responzivních variant |

Plus hero jako `<picture>` se `srcset` a focení podle shot listu.

**Osiřelé 4 články** s vlastním inline CSS ve staré tyrkysové paletě.

**Dva známé bugy**, které jsem nechal záměrně (opravy na jeden řádek):
40px mezera nad titulky blogových karet, focus ring formuláře bez animace.

**Stylelint v CI** — konvence v hlavičce souboru vydrží jen dokud je někdo čte.

---

## Slabá místa

- **Instagram glyf přišel o tečku.** V simple-icons cestě je malý kruh
  (blesk objektivu), ale jako subpath ve vyplněném tvaru se nevykreslí jako
  výsek. Renderuje se zaoblený čtverec s vyseknutým kolečkem objektivu.
  Je to čitelné a čisté, ale není to přesně oficiální logo Instagramu.
  Pokud ti to vadí, chce to cestu s `fill-rule="evenodd"`.
- **Nekontroloval jsem hover stavy.** `footer .social-icon:hover` je
  `--bronze-200` (10,9:1 na navy), `.share-btn:hover` je `--bronze-600` na
  `--bronze-50`. Spočítané ano, viděné ne.
- **43 ikon jsem nahradil regexem.** Ověřil jsem, že žádné `<svg>` neskončilo
  mimo `.social-icon` nebo `.share-btn` a že jsou všechny spárované. Ale
  regex na HTML je vždycky sázka — kdyby někde byl `<img>` s jiným pořadím
  atributů, přeskočil bych ho. Kontrola „zbyly PNG odkazy?" vyšla na nulu,
  takže to sedí.
- **Selektor `ul + p:last-child` je křehký jinak než ten předchozí.** Když
  do karty ve Službách přidáš za odkaz další odstavec nebo obrázek, zarovnání
  ke dnu přestane fungovat. Robustnější by byla vlastní třída
  `.service-card-cta` v HTML — to je jeden řádek v obou index souborech,
  jestli chceš.
- **Konkurenční pohled se nemění.** Kód je teď v dobrém stavu, vizuál tichý
  a přístupný. Ale pořád tam není ani jedna case study s čísly a ani jedna
  fotka z profesionálního focení. To rozhoduje o tom, jestli si tě klient
  vybere — ne `border-radius`.
