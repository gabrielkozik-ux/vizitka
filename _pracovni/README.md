# Pracovní složka

Podklady k obsahu a provozu webu. **Cloudflare Pages nasazuje vše, co je
v repu** — tedy i tuhle složku. Nikde na ni nevede odkaz a není v sitemapě,
ale kdo zná cestu, přečte si ji na `www.gabrielkozik.cz/_pracovni/...`.
Podle toho je složka od 7/2026 rozdělená.

## Co kde je

| Cesta | Verzuje se? | Nasazuje se? | K čemu |
|---|---|---|---|
| `sablona-clanku/` | ano | ano | Šablona pro nový článek. Je to kód, patří do gitu. |
| `NAVOD-PUBLIKACE.md` | ano | ano | Publikační postup. Není v něm nic citlivého. |
| `ZMENY-KODU-2026-07.md` | ano | ano | Historie změn CSS/JS. Technická, ne strategická. |
| `publikovano/` | ano | ano | Zdrojové texty publikovaných článků. |
| `fotky-original/` | **ne** | **ne** | Originály fotek. Těžké soubory, v `.gitignore`. |
| `_privatni/` | **ne** | **ne** | Strategie, redakční plán, deployment checklist. |
| `_archiv/` | **ne** | **ne** | Splněné checklisty a nahrazené reporty. |

## Pozor při přidávání nových podkladů

Cokoli, co obsahuje **strategii, ceny, plán obsahu, interní úvahy nebo
sebekritiku**, dej do `_privatni/`. Jinak to skončí veřejně na webu
i na GitHubu (repo je public).

Rychlá kontrola, co je reálně nasazené:

```
git ls-files _pracovni/
```

Co vypíše, to je na webu.

## Jednorázový krok, pokud ještě nebyl proveden

`.gitignore` sám nestačí u souborů, které už git zná. Aby `_privatni/`
a `_archiv/` skutečně zmizely z repa (na disku zůstanou):

```
git rm -r --cached _pracovni/_privatni _pracovni/_archiv
git commit -m "chore: privatni podklady mimo repo a deploy"
```

Historie na GitHubu ale zůstává veřejná — starší commity ty dokumenty
obsahují. Pokud to má být opravdu skryté, přepni repo na private
(Settings → General → Change repository visibility). Cloudflare Pages
s private repem funguje bez problémů.
