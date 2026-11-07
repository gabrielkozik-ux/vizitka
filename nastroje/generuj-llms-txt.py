"""Vygeneruje web/llms.txt z web/assets/data/articles.json.

Spusteni z korene repa:  python nastroje/generuj-llms-txt.py
Po pridani noveho odborneho clanku do articles.json staci skript pustit znovu.
Uvodni text upravuj zde v HLAVICKA / ZAPATI, ne primo v llms.txt (prepise se).
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "web"  # slozka nasazovana na web
BASE = "https://www.gabrielkozik.cz/"

HLAVICKA = """# Mgr. Gabriel Kožík – advokát pro novou dobu s AI

> Samostatný advokát (ČAK, ev. č. 19320) se sídlem v Brně, působící v Brně
> a na Tišnovsku. Pomáhá majitelům malých a středních firem s obchodním
> a korporátním právem, ochranou dat (GDPR), AI compliance (AI Act)
> a bezpečným zaváděním AI do firem, včetně školení na míru pro firemní týmy.

Komunikace v češtině, anglická verze webu je k dispozici.
Kontakt: info@gabrielkozik.cz, +420 720 265 713. Úvodní konzultace 30 minut zdarma.

## Služby a kontakt
- [Právní služby a AI compliance](https://www.gabrielkozik.cz/#sluzby): obchodní a korporátní právo, AI Act, GDPR, e-commerce, pracovní právo, školení na míru
- [Jak pracuji s AI](https://www.gabrielkozik.cz/#jak-pracuji): transparentní a bezpečné využití AI v advokátní praxi
- [Kontakt a rezervace konzultace](https://www.gabrielkozik.cz/#propojit)

## Odborné články
"""

ZAPATI = """
## Optional
- [Podcasty a reportáže z akcí](https://www.gabrielkozik.cz/blog)
- [English version](https://www.gabrielkozik.cz/index-en)
- [Ochrana osobních údajů](https://www.gabrielkozik.cz/ochrana-osobnich-udaju)
"""


def main():
    articles = json.loads((ROOT / "assets/data/articles.json").read_text(encoding="utf-8"))
    expert = sorted((a for a in articles if a.get("category") == "expert"),
                    key=lambda a: a["date"], reverse=True)
    lines = []
    for a in expert:
        cs = a["cs"]
        excerpt = " ".join(cs.get("excerpt", "").split())
        line = f"- [{cs['title']}]({BASE}{cs['link']})"
        if excerpt:
            line += f": {excerpt}"
        lines.append(line)
    out = HLAVICKA + "\n".join(lines) + "\n" + ZAPATI
    (ROOT / "llms.txt").write_text(out, encoding="utf-8", newline="\n")
    print(f"llms.txt: {len(expert)} odborných článků")


if __name__ == "__main__":
    main()
