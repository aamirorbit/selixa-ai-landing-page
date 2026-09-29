"""Renders the /brand kit into public/brand: mark SVGs, logo and icon PNGs, LinkedIn banners,
and the zip. PNGs are screenshots from headless Chrome (macOS path below), so type is the
site's own Satoshi Light and Inter. Run: python3 scripts/render-brand-assets.py"""
import base64, json, os, subprocess, tempfile
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT=f"{ROOT}/public/brand"; SP=tempfile.mkdtemp()
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
HALF="M745 448H1150L1068 556H785L648 712L862 966H722L522 740Q512 718 525 698L715 468Q728 450 745 448Z"
VB="500 430 686 800"
def mark(fill, extra=""):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VB}" {extra}><title>Selixa</title><g fill="{fill}"><path d="{HALF}"/><path d="{HALF}" transform="rotate(180 843 829)"/></g></svg>\n'
for name, fill in [("white","#ffffff"),("black","#0d0d10"),("crimson","#f23a2b")]:
    open(f"{OUT}/selixa-mark-{name}.svg","w").write(mark(fill))

sat=base64.b64encode(open(f"{ROOT}/app/fonts/Satoshi-Light.woff2","rb").read()).decode()
HEAD=f'''<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=block">
<style>@font-face{{font-family:Satoshi;src:url(data:font/woff2;base64,{sat}) format("woff2");font-weight:300}}
*{{margin:0;padding:0;box-sizing:border-box}} html,body{{background:transparent;overflow:hidden}}
body{{font-family:Inter,sans-serif;-webkit-font-smoothing:antialiased}}
.grad{{background:linear-gradient(94deg,var(--in) 0%,#ff6a5c 38%,#f23a2b 70%,#d0241a 100%);-webkit-background-clip:text;background-clip:text;color:transparent}}
</style>'''
inline=lambda fill,h: f'<svg viewBox="{VB}" style="height:{h}px;width:auto;display:block" fill="{fill}"><path d="{HALF}"/><path d="{HALF}" transform="rotate(180 843 829)"/></svg>'

def lockup(fg, h=120):
    return f'<div style="display:flex;align-items:center;gap:{h*0.32}px">{inline(fg,h)}<span style="font:500 {h*0.86}px/1 Inter;letter-spacing:0.01em;color:{fg}">Selixa</span></div>'

# The integration marks, straight from the site (components/landing/logos.ts).
LOGOS=json.loads(subprocess.run(["node","--no-warnings","--experimental-strip-types","--input-type=module","-e",
    'const m=await import("./components/landing/logos.ts");console.log(JSON.stringify(m.LOGOS))'],
    cwd=ROOT,check=True,capture_output=True,text=True).stdout)

SCHEMES={
    "dark": dict(bg="#050505",fg="#f5f5f7",fg2="#b9b9c2",ring="255 255 255",glow="226 40 28 / .30",inn="#ffc9c2",
                 tile="#131316",vars="--color-fg:#f5f5f7;--color-bg:#131316;--intercom-lit:#6afdef"),
    "light": dict(bg="#f7f7f5",fg="#0d0d10",fg2="#45454d",ring="13 13 16",glow="242 58 43 / .16",inn="#7a140c",
                  tile="#ffffff",vars="--color-fg:#0d0d10;--color-bg:#ffffff;--intercom-lit:#0e8f86"),
}
W,H=1584,396

def backdrop(c,cx,cy=198,radii=(150,300,470,660),glow=1000):
    rings="".join(f'<div style="position:absolute;left:{cx-r}px;top:{cy-r}px;width:{2*r}px;height:{2*r}px;border-radius:50%;border:1px {"dashed" if i==1 else "solid"} rgb({c["ring"]} / {0.07 if i else 0.09})"></div>' for i,r in enumerate(radii))
    return f'<div style="position:absolute;left:{cx-glow//2}px;top:{cy-glow//2}px;width:{glow}px;height:{glow}px;border-radius:50%;background:radial-gradient(circle,rgb({c["glow"]}),transparent 62%)"></div>{rings}'

def frame(c,inner):
    return f'<div style="position:relative;width:{W}px;height:{H}px;background:{c["bg"]};overflow:hidden;{c["vars"]}">{inner}</div>'

# The avatar sits over the lower left, so every layout keeps the left third quiet.
right='position:absolute;left:560px;right:96px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;align-items:flex-end;text-align:right'
satoshi=lambda px,c: f'font:300 {px}px/1.04 Satoshi;letter-spacing:-0.035em;color:{c["fg"]}'
grad=lambda c,t: f'<span class="grad" style="--in:{c["inn"]}">{t}</span>'

def b_headline(c):
    return frame(c, backdrop(c,1060)+f'<div style="{right}"><div style="{satoshi(96,c)}">stop building in {grad(c,"chaos.")}</div></div>')

def b_tagline(c):
    return frame(c, backdrop(c,1060)+f'<div style="{right}"><div style="{satoshi(70,c)}">{grad(c,"Agentic")} Operating Systems<br>for Product Management</div></div>')

def logo_svg(l,px):
    paths="".join(f'<path d="{p["d"]}" fill="{p.get("fill") or l["color"]}"/>' for p in l["paths"])
    return f'<svg viewBox="{l["viewBox"]}" width="{px}" height="{px}">{paths}</svg>'

def b_connected(c):
    """Tools on the left flow into Selixa; finished work flows out on the right. Flat field, no haze."""
    dark = c is SCHEMES["dark"]
    fx, fy = 960, 198                       # the Selixa hub
    step = 52                               # vertical rhythm of the tool columns
    # Six near, five far. A far tile sits where its line to the hub crosses the near column
    # exactly in a gap between tiles, scaled by distance (300 / 400), so no line clips a tile.
    near = [(fx - 300, fy + (i - 2.5) * step) for i in range(6)]
    far = [(fx - 400, fy + (i - 2) * step * 400 / 300) for i in range(5)]
    done = ["3 decisions captured", "Roadmap updated", "14 tasks created", "Recap sent"]
    ox, orow = 1120, 64                     # where the outputs start, and their spacing
    tile_bg = "#111114" if dark else "#ffffff"
    edge = f'rgb({c["ring"]} / {".10" if dark else ".09"})'
    fg2 = c["fg2"]
    tiles, lines, defs = "", "", ""
    for i, (l, (x, y)) in enumerate(zip(LOGOS, near + far)):
        defs += (f'<linearGradient id="g{i}" gradientUnits="userSpaceOnUse" x1="{x:.1f}" y1="{y:.1f}" x2="{fx}" y2="{fy}">'
                 f'<stop offset="0" stop-color="rgb({c["ring"]})" stop-opacity=".10"/><stop offset="1" stop-color="#f23a2b" stop-opacity=".7"/></linearGradient>')
        lines += f'<line x1="{x:.1f}" y1="{y:.1f}" x2="{fx}" y2="{fy}" stroke="url(#g{i})" stroke-width="1"/>'
        tiles += (f'<div style="position:absolute;left:{x-22:.1f}px;top:{y-22:.1f}px;width:44px;height:44px;border-radius:12px;'
                  f'background:{tile_bg};border:1px solid {edge};display:grid;place-items:center">{logo_svg(l,22)}</div>')
    rows = ""
    for j, label in enumerate(done):
        y = fy + (j - 1.5) * orow
        defs += (f'<linearGradient id="o{j}" gradientUnits="userSpaceOnUse" x1="{fx}" y1="{fy}" x2="{ox}" y2="{y}">'
                 f'<stop offset="0" stop-color="#f23a2b" stop-opacity=".7"/><stop offset="1" stop-color="rgb({c["ring"]})" stop-opacity=".18"/></linearGradient>')
        lines += f'<line x1="{fx}" y1="{fy}" x2="{ox}" y2="{y:.1f}" stroke="url(#o{j})" stroke-width="1"/>'
        rows += (f'<div style="position:absolute;left:{ox}px;top:{y-23:.1f}px;height:46px;display:flex;align-items:center;gap:12px;'
                 f'padding:0 20px 0 12px;border-radius:12px;background:{tile_bg};border:1px solid {edge}">'
                 f'<span style="width:22px;height:22px;border-radius:50%;background:#f23a2b;display:grid;place-items:center">'
                 f'<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg></span>'
                 f'<span style="font:400 19px/1 Inter;color:{c["fg"]}">{label}</span></div>')
    svg = f'<svg width="{W}" height="{H}" style="position:absolute;inset:0"><defs>{defs}</defs>{lines}</svg>'
    hub = (f'<div style="position:absolute;left:{fx-36}px;top:{fy-36}px;width:72px;height:72px;border-radius:50%;'
           f'background:radial-gradient(circle at 35% 28%,rgb(255 255 255 / .18),transparent 45%),radial-gradient(circle at 50% 62%,rgb(242 58 43 / .35),transparent 70%),#0b0b0e;'
           f'border:1px solid rgb(255 255 255 / .16);box-shadow:0 0 40px -4px rgb(242 58 43 / .55);display:grid;place-items:center">{inline("#ffffff",30)}</div>')
    return frame(c, svg + tiles + rows + hub)

def mono_logo(l,px,fill,bg):
    """A logo in one flat colour (the "Integrated with" row); cut-outs take the background."""
    paths="".join(f'<path d="{p["d"]}" fill="{bg if p.get("rest") else fill}"/>' for p in l["paths"])
    return f'<svg viewBox="{l["viewBox"]}" width="{px}" height="{px}" style="display:block">{paths}</svg>'

def stars(c,seed=7):
    """A starfield that thins out to the right, as in the Integrated layout."""
    import random
    rnd=random.Random(seed); dots=""
    for _ in range(1400):
        x=rnd.random()**1.8*760; y=rnd.random()*H
        a=rnd.uniform(.12,.7)*(1-x/820); r=rnd.choice([1,1,1,1.5,2])
        dots+=f'<div style="position:absolute;left:{x:.0f}px;top:{y:.0f}px;width:{r}px;height:{r}px;border-radius:50%;background:rgb({c["ring"]} / {a:.2f})"></div>'
    return dots

def b_integrated(c):
    accent = "#ff6a5c" if c is SCHEMES["dark"] else "#d0241a"
    grey = "#7c7c86" if c is SCHEMES["dark"] else "#8a8a92"
    row="".join(mono_logo(l,26,grey,c["bg"]) for l in LOGOS)
    return frame(c, stars(c)+f'''
<div style="position:absolute;left:600px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center">
  <div style="{satoshi(64,c)};line-height:1.08">Agentic Operating Systems<br>for <span style="color:{accent}">Product Management.</span></div>
  <div style="margin-top:34px;display:flex;align-items:center;gap:28px">
    <span style="font:400 17px/1 Inter;color:{grey};margin-right:6px">Integrated with</span>{row}
  </div>
</div>''')

def b_plain(c):
    """Nothing but the line, on a flat field."""
    return f'''<div style="position:relative;width:{W}px;height:{H}px;background:{c["bg"]};overflow:hidden">
<div style="position:absolute;right:112px;top:50%;transform:translateY(-50%);text-align:right;{satoshi(72,c)}">
  stop building in {grad(c,"chaos.")}
</div></div>'''

BANNERS={"headline":b_headline,"tagline":b_tagline,"connected":b_connected,"integrated":b_integrated,"plain":b_plain}

def icon():
    return f'''<div style="width:1024px;height:1024px;border-radius:0;background:
radial-gradient(circle at 35% 26%,rgb(255 255 255 / .16),transparent 42%),
radial-gradient(circle at 50% 62%,rgb(242 58 43 / .38),transparent 68%),#0b0b0e;display:grid;place-items:center">{inline("#ffffff",440)}</div>'''

def shot(name, body, w, h, transparent=False, scale=1):
    html=f"{SP}/{name}.html"; open(html,"w").write(HEAD+body)
    args=[CHROME,"--headless=new","--disable-gpu","--hide-scrollbars",f"--force-device-scale-factor={scale}",
          f"--window-size={w},{h}","--virtual-time-budget=5000",f"--screenshot={OUT}/{name}.png"]
    if transparent: args.append("--default-background-color=00000000")
    subprocess.run(args+[f"file://{html}"],check=True,capture_output=True)

for v,fn in BANNERS.items():
    for sc,c in SCHEMES.items(): shot(f"linkedin-banner-{v}-{sc}", fn(c), W, H, scale=2)
shot("selixa-icon", icon(), 1024, 1024)
pad='<div style="width:1400px;height:440px;display:grid;place-items:center">%s</div>'
shot("selixa-logo-white", pad%lockup("#ffffff",150), 1400, 440, True)
shot("selixa-logo-black", pad%lockup("#0d0d10",150), 1400, 440, True)
subprocess.run("rm -f selixa-brand-kit.zip && zip -q selixa-brand-kit.zip selixa-mark-*.svg selixa-logo-*.png selixa-icon.png linkedin-banner-*.png",shell=True,cwd=OUT,check=True)
print("Rendered into public/brand")
