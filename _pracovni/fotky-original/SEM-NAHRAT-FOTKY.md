# Originály fotek

Tato složka je v `.gitignore` — originály se **necommitují** na GitHub ani
nenasazují na web. Zpracované webové verze patří do `assets/images/brand/`.

Tenhle soubor je z `.gitignore` naopak vyjmutý (`!`), aby složka existovala
i v čerstvě naklonovaném repu. Nemaž ho, jinak složka z repa zmizí.

## Stav: fotky nahrané ✅

K 25. 7. 2026 je tu ~70 originálů — akce (Pod Pálavou, BforB, Podnikavci,
CS-Tech, Alveno, Smart Network), portréty, certifikáty, kancelář, kontaktní
listy. Původní verze tohoto souboru byla výzva „sem nahraj fotky"; to je
splněné.

## Co v zásobě chybí

Podle plánu vlny 3 (viz `_privatni/`) na prémiový vizuál pořád nejsou:

- **Hero záběr s prostorem vlevo pro text** — min. 2000 px šířky, pohled mimo
  objektiv, hloubka ostrosti. Současné hero je fotka z networkingu 2200×779.
- **Čistý portrét na neutrálním pozadí** — 3/4 profil, na výšku i na šířku.
- **Detaily:** ruka nad smlouvou, plnicí pero, monitor s AI nástrojem
  (zaslepený — žádný klientský obsah).
- **Textury** (papír, dřevo, sklo, kůže) v paletě navy/bronz — jako pozadí
  tmavých sekcí a citátů.
- **Workshop u tabule** s rozostřenými obličeji účastníků (GDPR i estetika).

## Postup, když přidáš nové

1. Nakopíruj sem (GitHub Desktop je bude ignorovat).
2. Napiš v Cowork „fotky jsou nahrané" + čí a jaká akce to je (kvůli popiskům).
3. Vyberu, zpracuji do webových velikostí a navrhnu nasazení.
4. Odsouhlasíš → nasadím → push.

**Pozor na vlnu 3:** cílem je AVIF/WebP se `srcset`, ne jen zmenšené JPEG.
Aktuálně má `profilova-fotka.jpg` 197 kB a zobrazuje se ve 36 px v navigaci.
