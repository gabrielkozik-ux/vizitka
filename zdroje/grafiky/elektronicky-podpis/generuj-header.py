import sys, asyncio
from playwright.async_api import async_playwright
L = {
 'cs': dict(kicker='Průvodce pro podnikatele', title='Elektronický podpis<br>v roce 2026', sub='Co stačí, co ne a kde se firmy nejčastěji spálí', tiers=['Kvalifikovaný','Uznávaný','Zaručený','Prostý'], axis='síla důkazu', out='header.jpg'),
 'en': dict(kicker='A guide for businesses', title='Electronic signatures<br>in 2026', sub='What is enough, what isn’t and where companies get burned', tiers=['Qualified','Recognised','Advanced','Simple'], axis='strength of evidence', out='header-en.jpg'),
}
def html(d):
    tiers=''
    n=len(d['tiers'])
    for i,t in enumerate(d['tiers']):
        top=i/n; bot=(i+1)/n
        # trapezoid: width grows with depth
        w0=0.40+0.60*top; w1=0.40+0.60*bot
        x0=(1-w0)/2*100; x1=(1-w1)/2*100
        bg=['#c9964a','#b8873b','#8a6528','#6b4f22'][i]; fg=['#081a2e','#081a2e','#f5eddd','#f5eddd'][i]
        tiers+=f'''<div class="tier" style="clip-path:polygon({x0}% 0,{100-x0}% 0,{100-x1}% 100%,{x1}% 100%);background:{bg}"><span style="color:{fg}">{t}</span></div>'''
    return f'''<html><head><style>
body{{margin:0;width:1200px;height:630px;background:#081a2e;font-family:Inter;color:#dbe3ee;overflow:hidden}}
.wrap{{position:absolute;inset:0;padding:64px 72px;display:flex;justify-content:space-between;align-items:center}}
.l{{width:560px}}
.k{{font-weight:700;font-size:18px;letter-spacing:.14em;text-transform:uppercase;color:#e3c98a;margin-bottom:26px}}
h1{{font-family:Lora;font-weight:700;font-size:60px;line-height:1.12;color:#fff;margin:0 0 26px}}
.s{{font-size:25px;line-height:1.4;color:#aab8c9}}
.line{{width:72px;height:3px;background:#b8873b;margin:30px 0 0}}
.site{{position:absolute;left:72px;bottom:46px;font-size:18px;color:#aab8c9;letter-spacing:.04em}}
.p{{width:440px;display:flex;flex-direction:column;gap:6px;position:relative}}
.tier{{height:92px;display:flex;align-items:center;justify-content:center}}
.tier span{{font-weight:700;font-size:21px;color:#081a2e}}
.ax{{position:absolute;right:-34px;top:0;bottom:0;width:2px;background:#e3c98a}}
.ax:before{{content:'';position:absolute;top:-2px;left:-7px;border:8px solid transparent;border-bottom:12px solid #e3c98a;border-top:0}}
.axl{{position:absolute;right:-64px;top:50%;transform:translateY(-50%) rotate(-90deg);transform-origin:center;white-space:nowrap;font-size:16px;letter-spacing:.08em;text-transform:uppercase;color:#e3c98a;width:0;display:flex;justify-content:center}}
</style></head><body><div class="wrap"><div class="l"><div class="k">{d['kicker']}</div><h1>{d['title']}</h1><div class="s">{d['sub']}</div><div class="line"></div></div>
<div class="p">{tiers}<div class="ax"></div><div class="axl">{d['axis']}</div></div></div><div class="site">gabrielkozik.cz</div></body></html>'''
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1200,'height':630})
        for k,d in L.items():
            await pg.set_content(html(d)); await pg.wait_for_timeout(300)
            await pg.screenshot(path=d['out']+'.png')
        await b.close()
asyncio.run(main())
