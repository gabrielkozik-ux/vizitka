"""Po kazde zmene articles.json nebo events.json spust z korene repa:

    python nastroje/aktualizuj-web.py

Prepise web/llms.txt a staticke vypisy clanku a akci v HTML.
"""
import runpy
from pathlib import Path

NASTROJE = Path(__file__).resolve().parent
for skript in ("generuj-llms-txt.py", "generuj-vypisy.py"):
    runpy.run_path(str(NASTROJE / skript), run_name="__main__")
