# Strategie webu gabrielkozik.cz — projekt upgradu 2026

*Verze 1.0 | 15. 7. 2026 | Podklad pro rozhodování a implementaci*

---

## 1. Shrnutí

Web gabrielkozik.com je funkční osobní vizitka s aktivním blogem (32 článků, CZ+EN), ale technicky i obsahově narazil na strop formátu "ručně udržované statické HTML". Hlavní strategická rozhodnutí tohoto projektu:

1. **Migrace na gabrielkozik.cz** — správný krok, provést hned (fáze 2).
2. **Integrace ai-workshop.cz pod osobní doménu** — dlouhodobě ano, ale fázovaně a s ponecháním domény jako redirectu (fáze 4).
3. **Redukce na CZ + EN** — zrušit HU/FR mutace homepage.
4. **Přeorientace blogu** — z převahy reportáží (18:14) na expertní obsah, který přivádí právní klienty a buduje autoritu.
5. **Technický dluh** — 46 MB neoptimalizovaných obrázků, chybějící OG tagy, žádná analytika, nekonzistentní fonty, duplicitní sitemapy.

Cílový stav: **jedna doména (gabrielkozik.cz), jeden hub osobní značky** — advokát × AI expert × networker — s jasnými konverzními cestami pro dva primární cíle: akvizici právních klientů a budování osobního brandu (workshopy jako sekundární konverze).

---

## 2. Kontext a cíle

**Kdo je cílovka:**
- **Primární:** majitelé SME, podnikatelé a freelanceři z Brněnska a Tišnovska, kteří řeší právo (smlouvy, s.r.o., AI compliance, GDPR) nebo chtějí prakticky nasadit AI.
- **Sekundární:** networkingová komunita (Pod Pálavou, BforB, Podnikavci) — lidé, kteří tě znají z akcí a web si otevřou jako "ověření" (social proof).

**Co má web dělat (v pořadí priorit):**
1. Budovat osobní značku a autoritu (osobnost regionu: advokát, školitel, networker).
2. Přivádět právní klienty do IUSTORIA (jasná konverzní cesta).
3. Podporovat prodej AI workshopů.
4. Přivádět lidi na networkingové akce.

**Klíčový insight:** Návštěvník, který tě potkal na akci a web si otevře do 24 hodin, je tvůj nejcennější traffic. Web musí do 5 sekund potvrdit: "Tenhle člověk je profík, dává smysl mu zavolat."

---

## 3. Audit současného stavu

### 3.1 Co funguje dobře

- Čistý positioning "Právo. AI. Síla vztahů." — tři pilíře jsou konzistentní s dlouhodobou vizí.
- Blog s pravidelnou kadencí (32 článků za ~15 měsíců) a dvojjazyčností CZ/EN.
- Korektní hreflang, canonical a 301 redirecty (_redirects po reorganizaci blogu).
- Sekce "Kde se můžeme potkat" s events.json — unikátní prvek, který konkurence nemá.
- Kontaktní vrstva: Calendly, Formspree, telefon, e-mail — nízká bariéra kontaktu.

### 3.2 Technické nálezy (podle závažnosti)

| # | Nález | Dopad | Náprava |
|---|-------|-------|---------|
| 1 | **Žádná analytika** (ani GA4, ani Cloudflare Web Analytics) | Rozhoduješ naslepo — nevíš, co lidi čtou, odkud chodí, kde odpadají | Cloudflare Web Analytics (zdarma, bez cookie lišty) + Google Search Console |
| 2 | **Chybí Open Graph / Twitter tagy** na všech stránkách | Sdílení na LinkedIn/FB — tvůj hlavní kanál! — vypadá chudě, nižší CTR | Doplnit OG tagy + náhledové obrázky do všech šablon |
| 3 | **46 MB obrázků**, fotky z akcí ~1 MB/kus, PNG kde má být WebP | Pomalé načítání na mobilu, horší Core Web Vitals a SEO | Konverze do WebP, max šířka 1600 px, cíl ~8–12 MB celkem |
| 4 | **Chybí structured data** (schema.org: Person, Attorney/LegalService, Article, Event) | Google nechápe entity — přicházíš o rich results a knowledge panel | JSON-LD do šablon |
| 5 | **Nekonzistentní fonty**: style.css chce Inter/Space Grotesk, index je nenačítá, blog načítá Roboto | Web se vykresluje v systémovém fallbacku, brand nekonzistence | Sjednotit na jeden font-stack, self-host nebo preload |
| 6 | **Duplicitní sitemapy** (sitemap.xml vs sitemap_new.xml, 67 vs 70 URL) | Riziko zmatení crawlerů, ruční údržba = chyby | Jedna generovaná sitemapa, druhou smazat |
| 7 | Placeholder obrázky v articles.json (placehold.co u článku Filosofie AI) | Působí nedodělaně ve výpisu blogu | Doplnit reálné obrázky |
| 8 | Pracovní složky v repu (blog/k_publikaci, blog/publikovano, scripts prázdné) | Nepořádek, riziko nasazení draftů na produkci | Přesunout mimo web root nebo do .gitignore |
| 9 | 4 jazykové mutace homepage, ale blog jen CZ/EN; HU/FR bez údržby | Mrtvá váha, dvojí práce při každé změně homepage | Zrušit HU/FR s 301 na EN |

### 3.3 Obsahové nálezy (blog)

- **Poměr 18 reportáží : 14 expertních článků.** Reportáže budují komunitu, ale nepřivádějí klienty z vyhledávání. Expertní články (převod podílu, odpovědnost za AI, platformová práce, AI Act) jsou přesně ten obsah, který SME podnikatel googlí — a těch je málo.
- **Chybí evergreen pilíře.** Nemáš "cornerstone" stránky typu "AI compliance pro SME — kompletní průvodce" nebo "Právní minimum pro e-shop", na které by odkazovaly dílčí články.
- **Reportáže z workshopů jsou téměř identické šablony** — pro SEO duplicitní slabý obsah, pro čtenáře malá hodnota. Lepší: jedna živá stránka "Workshopy v číslech + galerie" a reportáže jen pro výjimečné akce.
- **Žádné CTA v článcích.** Článek o převodu podílu nekončí nabídkou "Řešíte převod podílu? Ozvěte se." — necháváš konverze ležet na stole.
- **Kategorie jen expert/report.** Chybí členění podle pilířů značky (Právo / AI / Networking), podle kterého se čtenář orientuje.

---

## 4. Nová struktura webu

```
gabrielkozik.cz
├── /                        Homepage (hub tří pilířů, sociální důkaz, CTA)
├── /pravo                   NOVÁ podstránka: právní služby pro SME
│                            (specializace, proces spolupráce, FAQ, CTA → IUSTORIA/Calendly)
├── /ai                      NOVÁ podstránka: AI služby
│                            (workshopy, konzultace, AI compliance — po integraci ai-workshop.cz)
├── /networking              NOVÁ podstránka: akce, kluby, "Kde se potkáme" (events.json)
├── /blog                    Blog s filtrací: Právo | AI | Networking | Reportáže
│   └── /blog/rok/slug/
├── /o-mne                   Příběh, hodnoty, média, foto ke stažení (press kit)
└── /kontakt                 Samostatná kontaktní stránka (Calendly, formulář, mapa)
```

**Principy:**
- Homepage = rozcestník, ne skladiště. Každý pilíř dostane vlastní podstránku s vlastním CTA a vlastní SEO ambicí ("advokát AI compliance Brno", "AI workshop Brno/Tišnov", "networking Tišnov").
- Každá podstránka má **jedno primární CTA**: /pravo → Calendly konzultace; /ai → přihláška na workshop; /networking → registrace na akci.
- Sekce "Kde se potkáme" povýšit z homepage sekce na plnohodnotnou stránku — je to tvůj unikát.

---

## 5. Obsahová strategie blogu

### 5.1 Obsahové pilíře (poměr 50 : 30 : 20)

| Pilíř | Podíl | Účel | Příklady témat |
|-------|-------|------|----------------|
| **Právo pro podnikání** | 50 % | SEO akvizice klientů | Převod podílu, souběh funkcí, smlouva o dílo v IT, odpovědnost za AI výstupy, AI Act v praxi, GDPR + AI nástroje, platformová práce, whistleblowing pro SME |
| **AI v praxi** | 30 % | Autorita + podpora workshopů | Návody Gemini/NotebookLM, use-casy pro SME, srovnání nástrojů, AI governance ve firmě |
| **Networking & komunita** | 20 % | Vztahy, social proof | Reportáže z výjimečných akcí, rozhovory s podnikateli z regionu, lekce z budování Pod Pálavou |

### 5.2 Konkrétní kroky

1. **Cornerstone obsah (Q3 2026):** 3 pilířové stránky — "AI compliance pro české firmy: kompletní průvodce", "Právní minimum pro freelancery a SME", "Jak začít s AI ve firmě (bezpečně)". Dlouhé, aktualizované, interně prolinkované s dílčími články.
2. **CTA bloky do všech expertních článků** — kontextové ("Řešíte X? 30 minut zdarma → Calendly").
3. **Rozhovory s podnikateli z regionu** — nový formát. Buduje vztahy (networking!), přináší jejich publikum na tvůj web a je to obsah, který nikdo v regionu nedělá. 1× měsíčně.
4. **Redukce workshop-reportáží** — nahradit jednou průběžně aktualizovanou stránkou s referencemi a galerií.
5. **Redakční kadence:** 2 expertní články + 1 lehčí formát měsíčně. Draft pipeline přes Claude (viz kap. 8).
6. **Recyklace:** každý článek → LinkedIn post (tvůj hlavní kanál) + newsletter tease. Zvážit jednoduchý newsletter (Buttondown/MailerLite) — vlastníš kontakty, nejsi závislý na algoritmu LinkedIn.

---

## 6. Doménová strategie

### 6.1 Migrace gabrielkozik.com → gabrielkozik.cz — DOPORUČUJI, proveditelné hned

**Proč ano:**
- Cílovka je česká; .cz doména zvyšuje důvěru i lokální relevanci (signál pro Google i pro člověka z Tišnova).
- Konzistence s ostatními aktivy (.cz: iustoria.cz, ai-workshop.cz, pod-palavou.cz).
- Web je mladý s nízkou doménovou autoritou — cena migrace je teď nejnižší, jaká kdy bude. Každý další rok čekání ji zvyšuje.

**Migrační postup (pořadí je závazné):**
1. Odpojit současný obsah gymnaziální prezentace od gabrielkozik.cz (zadáno ✔).
2. Nasadit web na .cz jako Cloudflare Pages projekt (stejný repo), ověřit funkčnost na 100 %.
3. Hromadně přepsat absolutní URL v repu: canonical, hreflang, sitemap, OG tagy → gabrielkozik.cz (213+ výskytů, skriptem).
4. Nastavit **301 redirect celé .com → .cz** (Cloudflare Bulk Redirects / Page Rule, 1:1 mapování cest).
5. Google Search Console: přidat .cz property, použít **nástroj Změna adresy** na .com property, odeslat novou sitemapu. Totéž Bing Webmaster Tools (BingSiteAuth.xml).
6. Aktualizovat odkazy, kde je máš pod kontrolou: LinkedIn, FB, IG, YouTube, ai-workshop.cz footer, iustoria.cz, e-mailový podpis, vizitky (další tisk).
7. **Doménu .com držet a redirectovat minimálně 2 roky** (je na vizitkách a v historii sdílení). Náklad ~350 Kč/rok je pojistka.

### 6.2 Integrace ai-workshop.cz — ANO, ale fázovaně

**Analýza vhodnosti vůči dlouhodobému cíli** (stabilní pozice: advokát, networker, školitel, osobnost regionu):

*Pro integraci:*
- Tvá značka je **Gabriel Kožík**, ne "AI Workshop". Lidé si z akcí pamatují tebe. Roztříštěnost mezi 5+ domén (gabrielkozik.com/.cz, ai-workshop.cz, ai-strateg.cz, ai-podnikani.cz, retro-arkady.cz) ředí autoritu — SEO i mentální.
- Blogový AI obsah na gabrielkozik.cz dnes posiluje jinou doménu, než která workshopy prodává. Sloučením se linkjuice i důvěra sčítají.
- Jedna doména = jedna údržba, jedna analytika, jeden funnel: článek → /ai → workshop → právní klient (cross-sell mezi pilíři je tvá hlavní konkurenční výhoda).

*Proti integraci (a proč nepřevažují):*
- ai-workshop.cz je popisná, dobře zapamatovatelná doména pro offline marketing → **řešení: doménu držet jako 301 redirect na gabrielkozik.cz/ai** a klidně ji dál tisknout na letáky.
- Samostatná landing page konvertuje líp než podstránka → **řešení: /ai zachová konverzní strukturu současného webu** (program, reference, cena, vstupenka), jen dostane navigaci osobního brandu.
- Riziko: v očích části publika "advokát" a "AI školitel" nesedí dohromady → tohle už dnes řešíš positioningem "workshop pod vedením advokáta" a je to tvůj diferenciátor, ne slabina.

**Doporučené pořadí:** nejdřív migrace .com→.cz a stabilizace (2–3 měsíce, čisté Search Console), pak teprve přesun obsahu ai-workshop.cz na /ai. Dvě migrace najednou = dvojnásobné riziko a nečitelná data.

*Poznámka: ai-strateg.cz a ai-podnikani.cz dlouhodobě též směřovat (redirect) pod hlavní doménu, ať se autorita nedrobí.*

---

## 7. Technická optimalizace

1. **Obrázky:** jednorázová konverze do WebP (kvalita 82, max 1600 px šířka), `srcset` pro responsive načítání. Skript v repu, spouštět při každém přidání fotek. Očekávaný výsledek: 46 MB → pod 10 MB.
2. **Meta vrstva:** OG + Twitter Card tagy do všech šablon; výchozí sdílecí obrázek s tvým brandem (1200×630).
3. **Structured data (JSON-LD):** `Person` + `Attorney` na homepage, `Article` na článcích, `Event` generované z events.json.
4. **Fonty:** sjednotit na Inter + Space Grotesk (jak zamýšlí style.css), self-host WOFF2, `preload`. Odstranit Roboto z blog šablon.
5. **Sitemapa:** smazat sitemap_new.xml; sitemap.xml generovat skriptem z articles.json + statických stránek (jeden zdroj pravdy).
6. **Analytika:** Cloudflare Web Analytics beacon (bez cookies, bez lišty) + GSC + Bing WT. Volitelně GA4 později, pokud budeš chtít konverzní trychtýře — pak ale cookie lišta.
7. **Šablonový dluh:** navigace/footer jsou copy-paste v ~70 HTML souborech. Doporučení: **zavést Eleventy (11ty)** jako generátor — Markdown článek + šablona → build v Cloudflare Pages automaticky při push. Publikace článku se změní z "edituj 2 HTML + articles.json + sitemap" na "přidej 1 markdown soubor". Alternativa: zůstat u čistého HTML a nechat rutinu na Claude Cowork (viz níže) — funguje, ale dluh dál poroste.
8. **Úklid repa:** pracovní složky (k_publikaci, publikovano) mimo web root; package.json bez využití — smazat nebo použít pro build skripty.

---

## 8. Implementační plán

| Fáze | Obsah | Kdy | Nástroje |
|------|-------|-----|----------|
| **1. Quick wins** | Analytika, OG tagy, komprese obrázků, sjednocení fontů, úklid sitemap a repa, oprava placeholderů | týden 1–2 | Claude Cowork přímo v repu, GitHub Desktop push, Cloudflare |
| **2. Migrace domény** | Postup z kap. 6.1 — nasazení na .cz, přepis URL, 301, Search Console | týden 2–4 | Cloudflare Pages + Bulk Redirects, GSC, Cowork (hromadný přepis URL) |
| **3. Restrukturalizace** | Podstránky /pravo, /ai, /networking, /o-mne, /kontakt; zrušení HU/FR; CTA do článků; kategorie blogu | měsíc 2 | Cowork (generování stránek ze šablon), případně přechod na Eleventy |
| **4. Integrace ai-workshop.cz** | Přesun obsahu na /ai, 301 z ai-workshop.cz, sjednocení referencí | měsíc 3–4 (po stabilizaci migrace) | Cloudflare redirect, Cowork |
| **5. Obsahový provoz** | Cornerstone stránky, rozhovory, kadence 3 články/měsíc, newsletter | průběžně od měsíce 2 | Claude (drafty, korektury, překlady EN), NotebookLM (rešerše), Buttondown |

**Role Claude Cowork v provozu (doporučené workflow):**
- **Publikační rutina:** dáš Claude text/podklady článku → vygeneruje CZ+EN HTML dle šablony, záznam do articles.json, aktualizuje sitemapu, zkomprimuje obrázky → ty jen zkontroluješ diff v GitHub Desktop a pushneš. Stojí za to si na to nechat vytvořit vlastní **skill** (Nastavení → Capabilities), ať je postup 100% opakovatelný.
- **Údržba events.json:** měsíční session "aktualizuj akce podle webů klubů".
- **Kvartální audit:** naplánovaná kontrola rozbitých odkazů, zastaralých údajů a výkonu.

**KPI (měřit od fáze 1):**
- Návštěvnost a zdroje (CF Analytics), pozice na cílové dotazy: "advokát AI compliance", "AI workshop Brno", "advokát Tišnov" (GSC).
- Konverze: rezervace Calendly / měsíc, odeslané formuláře, prokliky na vstupenky workshopů.
- Obsah: 3 publikované články / měsíc, podíl expertního obsahu > 50 %.

---

## 9. Slabá místa (pohled protistrany a skeptika)

1. **"Migrujete dvě domény během půl roku — to je SEO ruleta."** Oprávněná námitka. Mitigace: striktní pořadí (nejdřív .com→.cz, pak ai-workshop.cz), 1:1 redirect mapy, Change of Address v GSC, 2 roky držení starých domén. I tak počítej s 4–8 týdny poklesu z vyhledávání — proto migrovat teď, dokud je organic traffic malý a hlavní kanál je LinkedIn + osobní kontakt.
2. **"Tři pilíře = žádná specializace. Klient hledá advokáta, ne renesančního člověka."** Nejsilnější námitka konkurence. Mitigace: podstránka /pravo musí být plnohodnotná prezentace advokáta, která obstojí sama o sobě — návštěvník z dotazu "advokát smlouvy Brno" nesmí mít pocit, že přišel na web školitele. Pilíře se propojují na homepage, ne v hloubce webu.
3. **"Kadence 3 články měsíčně při tvém vytížení neudržíš."** Historicky jsi ji zhruba držel, ale z velké části reportážemi, které jsou rychlé. Expertní článek je 3–5× dražší na čas. Mitigace: pipeline s Claude (draft → tvoje odbornost → publikace) a snížení laťky: raději 2 kvalitní než 3 vynucené. Pokud 2 měsíce po sobě nestíháš, škrtni EN mutace expertních článků (čte je někdo? — ověří analytika).
4. **"Zrušením reportáží ztratíš komunitní goodwill."** Lidé z akcí se rádi vidí na fotkách. Mitigace: reportáže neruším, jen je přesouvám z blogu do galerie na /networking — fotky zůstanou, blog se pročistí.
5. **"Eleventy je pro ne-vývojáře nový závazek."** Pravda — pokud build spadne, bez pomoci ho neopravíš. Alternativa je legitimní: zůstat u statického HTML a nechat rutinu na Cowork skillu. Rozhodnutí odlož do fáze 3; quick wins ani migrace domény generátor nepotřebují.
6. **"Bez analytiky teď nevíš, jestli něco z toho funguje."** Přesně proto je analytika krok č. 1 — každé další rozhodnutí (rušení EN, výběr témat, hodnota reportáží) má být podložené daty, ne pocitem.
7. **ČAK compliance:** web advokáta podléhá stavovským předpisům o publicitě. Reference a formulace na /pravo (a přebírané reference z ai-workshop.cz) projít optikou etického kodexu ČAK — zejména srovnávání a sliby výsledku.

---

*Další krok: odsouhlas fázi 1 (quick wins) — můžu ji začít implementovat rovnou v tomto repu.*
