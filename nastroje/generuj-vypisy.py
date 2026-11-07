"""Vygeneruje staticke vypisy primo do HTML (viditelne i bez JavaScriptu):

- seznam clanku na /blog a /blog-en  (z web/assets/data/articles.json)
- seznam akci na homepage CZ i EN    (z web/assets/data/events.json)

Spusteni z korene repa:  python nastroje/generuj-vypisy.py
(nebo vse najednou:      python nastroje/aktualizuj-web.py)

JavaScript (blog-loader.js, events-loader.js) nad tim dal dela filtry,
strankovani a rozdeleni akci na budouci/probehle podle dnesniho data.
Skript prepisuje jen obsah mezi znackami <!-- ...:START --> a <!-- ...:END -->.
"""
import datetime as dt
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "web"
NA_STRANKU = 9  # musi sedet s articlesPerPage v blog-loader.js
ARCHIV_STATICKY = 12  # kolik probehlych akci dat staticky do HTML (JS stejne vykresli vsechny)

MESICE_CS = ["ledna", "února", "března", "dubna", "května", "června", "července",
             "srpna", "září", "října", "listopadu", "prosince"]
MESICE_EN = ["January", "February", "March", "April", "May", "June", "July",
             "August", "September", "October", "November", "December"]
T = {
    "cs": {"published": "Publikováno", "readMore": "Přečíst celý článek",
           "moreInfo": "Více info", "soldOut": "Vyprodáno", "addToCalendar": "Přidat do kalendáře"},
    "en": {"published": "Published", "readMore": "Read the full article",
           "moreInfo": "More Info", "soldOut": "Sold Out", "addToCalendar": "Add to calendar"},
}
CAL_SVG = ('<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">'
           '<path fill="currentColor" d="M19 19H5V8h14m-3-7v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 '
           '1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1m-1 11h-5v5h5v-5Z"/></svg>')

e = lambda s: html.escape(str(s), quote=True)


def datum_dlouhe(iso, lang):
    d = dt.date.fromisoformat(iso)
    return f"{d.day}. {MESICE_CS[d.month - 1]} {d.year}" if lang == "cs" else f"{MESICE_EN[d.month - 1]} {d.day}, {d.year}"


def datum_kratke(iso, lang):
    d = dt.date.fromisoformat(iso)
    return f"{d.day}. {d.month}. {d.year}" if lang == "cs" else f"{d.month}/{d.day}/{d.year}"


def vloz(soubor, znacka, obsah, odsazeni):
    """Nahradi obsah mezi <!-- ZNACKA:START --> a <!-- ZNACKA:END -->."""
    raw = soubor.read_bytes()
    text = raw.decode("utf-8")
    nl = "\r\n" if "\r\n" in text else "\n"
    vzor = re.compile(rf"(<!-- {znacka}:START[^>]*-->).*?([ \t]*<!-- {znacka}:END -->)", re.S)
    if not vzor.search(text):
        raise SystemExit(f"V {soubor.name} chybi znacky <!-- {znacka}:START/END -->")
    blok = nl.join(odsazeni + radek if radek else "" for radek in obsah.split("\n"))
    text = vzor.sub(lambda m: m.group(1) + nl + blok + nl + m.group(2), text, count=1)
    soubor.write_bytes(text.encode("utf-8"))


def karta_clanku(a, lang, poradi):
    d = a[lang]
    img = a.get("image_en") if lang == "en" and a.get("image_en") else a["image"]
    trida = "article-card" + (" article-card--dalsi" if poradi >= NA_STRANKU else "")
    return (f'<article class="{trida}" data-category="{e(a["category"])}">\n'
            f'    <div class="article-image">\n'
            f'        <img src="{e(img)}" alt="{e(d["title"])}" loading="lazy">\n'
            f'    </div>\n'
            f'    <div class="article-content">\n'
            f'        <p class="article-meta">{T[lang]["published"]}: {datum_dlouhe(a["date"], lang)}</p>\n'
            f'        <h2><a href="{e(d["link"])}">{e(d["title"])}</a></h2>\n'
            f'        <p class="article-excerpt">{e(d["excerpt"])}</p>\n'
            f'        <a href="{e(d["link"])}" class="read-more-btn">{T[lang]["readMore"]}</a>\n'
            f'    </div>\n'
            f'</article>')


def polozka_akce(ev, lang):
    t = T[lang]
    title = ev["title"].get(lang) or ev["title"]["cs"]
    theme = (ev.get("theme") or {}).get(lang) or (ev.get("theme") or {}).get("cs") or ""
    if ev.get("isSoldOut"):
        tl = f'<span class="cta-button event-button disabled" style="background:grey;cursor:default">{t["soldOut"]}</span>'
    elif not ev.get("link") or ev["link"] == "#":
        tl = f'<span class="cta-button event-button disabled" style="background:grey;cursor:default;opacity:0.6">{t["moreInfo"]}</span>'
    else:
        tl = f'<a href="{e(ev["link"])}" target="_blank" rel="noopener noreferrer" class="cta-button event-button">{t["moreInfo"]}</a>'
    kal = ""
    if ev.get("calendarLink") and not ev.get("isSoldOut"):
        kal = (f'\n        <a href="{e(ev["calendarLink"])}" target="_blank" rel="noopener noreferrer" class="calendar-button"'
               f' aria-label="{e(t["addToCalendar"] + ": " + title)}" title="{t["addToCalendar"]}">{CAL_SVG}</a>')
    return (f'<li>\n'
            f'    <div class="event-date-time">\n'
            f'        <span class="date">{datum_kratke(ev["date"], lang)}</span>\n'
            f'        <span class="time">{e(ev.get("time", ""))}</span>\n'
            f'    </div>\n'
            f'    <div class="event-details-new">\n'
            f'        <h3>{e(title)}</h3>\n'
            + (f'        <p class="event-theme">{e(theme)}</p>\n' if theme else "") +
            f'        <p>{e(ev.get("place", ""))}</p>\n'
            f'    </div>\n'
            f'    <div class="event-actions">\n'
            f'        {tl}{kal}\n'
            f'    </div>\n'
            f'</li>')


def faq_schema(soubor):
    """FAQPage JSON-LD presne podle viditelnych otazek a odpovedi na strance."""
    text = soubor.read_text(encoding="utf-8")
    polozky = re.findall(r'<details class="faq-item[^"]*">\s*<summary[^>]*>(.*?)</summary>\s*'
                         r'<div class="faq-body">(.*?)</div>', text, re.S)
    cisty = lambda s: html.unescape(" ".join(re.sub(r"<[^>]+>", " ", s).split()))
    data = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": cisty(q), "acceptedAnswer": {"@type": "Answer", "text": cisty(a)}}
        for q, a in polozky]}
    return len(polozky), '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False) + "</script>"


def main():
    for soubor in ("index.html", "index-en.html"):
        pocet, blok = faq_schema(ROOT / soubor)
        vloz(ROOT / soubor, "FAQ-SCHEMA", blok, " " * 4)
        print(f"{soubor}: FAQ schema, {pocet} otázek")

    articles = json.loads((ROOT / "assets/data/articles.json").read_text(encoding="utf-8"))
    for lang, soubor in (("cs", "blog.html"), ("en", "blog-en.html")):
        clanky = [a for a in articles if a.get(lang)]
        obsah = "\n".join(karta_clanku(a, lang, i) for i, a in enumerate(clanky))
        vloz(ROOT / soubor, "CLANKY", obsah, " " * 16)
        print(f"{soubor}: {len(clanky)} článků")

    events = json.loads((ROOT / "assets/data/events.json").read_text(encoding="utf-8"))
    events.sort(key=lambda ev: ev["date"])
    dnes = dt.date.today().isoformat()
    budouci = [ev for ev in events if ev["date"] >= dnes]
    probehle = [ev for ev in reversed(events) if ev["date"] < dnes][:ARCHIV_STATICKY]
    for lang, soubor in (("cs", "index.html"), ("en", "index-en.html")):
        vloz(ROOT / soubor, "AKCE", "\n".join(polozka_akce(ev, lang) for ev in budouci), " " * 24)
        vloz(ROOT / soubor, "ARCHIV", "\n".join(polozka_akce(ev, lang) for ev in probehle), " " * 24)
        print(f"{soubor}: {len(budouci)} budoucích akcí, {len(probehle)} v archivu (k {dnes})")


if __name__ == "__main__":
    main()
