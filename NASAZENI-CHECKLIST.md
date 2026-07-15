# Checklist nasazení — migrace na gabrielkozik.cz

*Co je hotové v repu a co musíš doklikat ručně. Postupuj shora dolů.*

## ✅ Hotovo v repu (stačí commit + push)

- [x] Všechny URL přepsány z gabrielkozik.com na gabrielkozik.cz (777 výskytů, 87 souborů)
- [x] Doménové 301 redirecty v `_redirects`: .com i apex .cz → https://www.gabrielkozik.cz
- [x] HU/FR mutace smazány, redirecty /index-hu a /index-fr → /index-en
- [x] Open Graph + Twitter Card tagy na všech 82 stránkách (LinkedIn/FB náhledy)
- [x] JSON-LD strukturovaná data: Person (homepage), Article (58 článků)
- [x] Fonty sjednoceny na Inter + Space Grotesk (Roboto odstraněno)
- [x] Obrázky zkomprimovány: ~51 MB → ~23 MB (fotky 1200 px, velké PNG → JPEG)
- [x] Opraven rozbitý EN slug článku o AI agentech + chybějící EN verze v sitemapě
- [x] Úklid: sitemap_new.xml, package.json, blog-data.js, staré obrázky smazány; drafty v `_pracovni/`

## 1. Commit a push (GitHub Desktop)

- [ ] Projdi diff (velký — hlavně meta tagy a obrázky), commitni a pushni
- [ ] Ověř v Cloudflare Pages, že build/deploy proběhl

## 2. Cloudflare (dashboard)

- [ ] **Ověř, že gabrielkozik.com i www.gabrielkozik.com jsou připojené jako custom domény ke STEJNÉMU Pages projektu jako .cz** — jinak doménová pravidla v `_redirects` nebudou fungovat a musíš místo nich použít Bulk Redirects
- [ ] Otestuj redirecty (po deployi):
  - `https://gabrielkozik.com/blog` → `https://www.gabrielkozik.cz/blog` (301)
  - `https://www.gabrielkozik.com/` → `https://www.gabrielkozik.cz/` (301)
  - `https://gabrielkozik.cz/` → `https://www.gabrielkozik.cz/` (301)
  - `https://www.gabrielkozik.cz/index-fr` → `/index-en` (301)
- [ ] **Zapni Web Analytics** pro Pages projekt (Analytics & Logs → Web Analytics, jeden klik, zdarma, bez cookie lišty)

## 3. Google Search Console

- [ ] Přidej property **gabrielkozik.cz** (typ Doména, ověření přes DNS TXT v Cloudflare)
- [ ] Odešli sitemapu: `https://www.gabrielkozik.cz/sitemap.xml`
- [ ] Na property gabrielkozik.com spusť **Nastavení → Změna adresy** → gabrielkozik.cz
- [ ] Za týden zkontroluj Pokrytí/Indexování na nové property

## 4. Bing Webmaster Tools

- [ ] Přidej gabrielkozik.cz (můžeš importovat z GSC jedním klikem)
- [ ] Odešli sitemapu

## 5. Aktualizace odkazů, které máš pod kontrolou

- [ ] LinkedIn profil (web + featured odkazy)
- [ ] Facebook, Instagram (bio), YouTube (popis kanálu)
- [ ] ai-workshop.cz — footer odkaz "O lektorovi" (teď míří na .com)
- [ ] iustoria.cz — profil advokáta
- [ ] E-mailový podpis, Calendly popis
- [ ] Vizitky — při dalším tisku

## 6. Kontrola sdílení a rich results (po deployi)

- [ ] LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/ — vlož homepage a 1 článek
- [ ] Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- [ ] Google Rich Results Test na homepage (Person) a 1 článku (Article)

## 7. Držet v hlavě

- [ ] Doménu **gabrielkozik.com neprodlužuj naslepo, ale drž ji minimálně do poloviny 2028** (redirect)
- [ ] Článek *Filosofie AI v advokacii* nemá vlastní obrázek (používá profilovku jako fallback) — doplnit
- [ ] Integraci ai-workshop.cz → /ai řešit až po stabilizaci migrace (cca říjen 2026), viz STRATEGIE-WEB-2026.md kap. 6.2
- [ ] Složka `_pracovni/` se nasazuje na web (nikde na ni nevede odkaz) — dlouhodobě přesunout mimo repo
