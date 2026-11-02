#!/usr/bin/env python3
"""Generate original product SVG illustrations and their public URL manifest."""

import csv
import html
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "data" / "products.csv"
OUTPUT = ROOT / "images" / "products"
MANIFEST = ROOT / "data" / "illustration-links.csv"
PUBLIC_BASE = "https://norduz-del.github.io/ferreteria-bellabista/"

PALETTES = [
    ("#e8ede2", "#284335", "#d3ed75", "#a7b49e"),
    ("#e9e9df", "#35473b", "#e5ba72", "#b1b8aa"),
    ("#e4ecea", "#31545a", "#c5d98b", "#a5b8b2"),
    ("#eee7db", "#574b37", "#d79a66", "#c1b19a"),
]

SHAPES = {
    "tool": '<path d="M119 145 77 103l15-15 42 42 36-36a39 39 0 0 1 50-49l-25 25 21 21 25-25a39 39 0 0 1-49 50l-57 57a14 14 0 0 1-20-20z"/><path class="detail" d="m88 99 15-15m35 54 11-11"/>',
    "hammer": '<path d="M104 85 136 53l72 72-32 32zm89-44 34 34-24 24-34-34z"/><rect x="142" y="115" width="25" height="100" rx="12" transform="rotate(-45 154 165)"/><path class="detail" d="m145 88 12-12m4 30 12-12"/>',
    "screwdriver": '<path d="M132 90 181 41l18 18-49 49z"/><path d="m112 108 30-30 20 20-30 30-12 40-20-20z"/><rect x="93" y="154" width="27" height="76" rx="12" transform="rotate(42 106 192)"/><path class="detail" d="m183 46 12 12"/>',
    "drill": '<path d="M91 96h97a23 23 0 0 1 23 23v31h-41v-15h-79a20 20 0 0 1-20-20v-1a18 18 0 0 1 20-18z"/><path d="M156 150h38l-14 40h-39z"/><path d="M211 111h30v22h-30z"/><path class="detail" d="M88 111h50m15-15v18m18-18v18"/>',
    "saw": '<path d="M73 105 232 76l-20 99-139-31z"/><path d="m89 147 17 35 13-27 21 21 9-27 23 19 8-29 23 15 9-34z"/><path class="detail" d="m104 112 4 24m25-29 4 24m25-29 4 24m25-29 4 24"/>',
    "pipe": '<path d="M91 68h34v84a22 22 0 0 0 22 22h48v34h-50a54 54 0 0 1-54-54z"/><path d="M81 57h54v32H81zm103 107h32v54h-32z"/><path class="detail" d="M90 73h36m-36 13h36m69 83v32m13-32v32"/>',
    "faucet": '<path d="M92 124h83V96a34 34 0 0 1 68 0v15h-27V97a7 7 0 0 0-14 0v54H92z"/><path d="M82 112h32v22H82zm62-26V68h30v18"/><path class="detail" d="M192 75h25m-91 70v29m31-29v29m31-29v29"/>',
    "bulb": '<path d="M160 43a62 62 0 0 0-38 111c12 9 17 21 18 34h40c1-13 6-25 18-34A62 62 0 0 0 160 43z"/><path d="M140 193h40v15h-40zm5 20h30v12h-30z"/><path class="detail" d="M142 168h36m-28 15h20m-10-126v20m-54-2 14 15m111-15-14 15"/>',
    "cable": '<path d="M101 68h29v47h-29zm59 0h29v47h-29z"/><path d="M115 113v37a44 44 0 0 0 88 0v-8"/><path d="M188 140h30v-25h-30zm-89-3h30v-22H99z"/><circle cx="203" cy="146" r="13"/><path class="detail" d="M107 77v28m58-28v28m39 60v22"/>',
    "brick": '<path d="M70 101h67v41H70zm73 0h68v41h-68zM70 148h67v41H70zm73 0h68v41h-68z"/><path class="detail" d="M138 106v31m-34 16v31m68-31v31"/>',
    "bag": '<path d="m111 73 18-25h61l18 25-13 146h-72z"/><path d="M108 90h91v33h-91z"/><path class="detail" d="M133 68h52m-35 42h40m-41 22h31m-25 14h25"/>',
    "paint": '<path d="M104 71h113v49H104z"/><path d="M127 120h67l-9 95h-49z"/><path class="detail" d="M115 82h91m-71 15h51"/>',
    "brush": '<path d="M151 64h25v96h-25z"/><path d="M127 42h73v40h-73z"/><path d="M132 82h63l-8 39h-47z"/><path class="detail" d="M136 89v24m12-24v24m13-24v24m13-24v24m12-24v24"/>',
    "roller": '<path d="M82 75h112v36H82z"/><path d="M179 111h22v48h-35"/><path d="M157 151h19v66h-19z"/><path class="detail" d="M94 84h88m-88 17h88"/>',
    "bolt": '<path d="m160 45 39 22v47l-39 22-39-22V67z"/><path d="M151 132h18v85h-18zm-16 32h50v12h-50zm0 22h50v12h-50z"/><path class="detail" d="m139 73 21-12 21 12v25l-21 12-21-12z"/>',
    "tree": '<path d="M153 141h18v77h-18z"/><path d="M160 48c-20 0-34 16-31 34-19 8-20 35-2 46-5 24 24 39 42 24 23 12 48-7 41-31 18-15 8-42-13-45 0-16-16-28-37-28z"/><path class="detail" d="M160 153v45m0-47-21-20m22 13 22-22"/>',
    "shovel": '<path d="M152 95h17v95h-17z"/><path d="M147 190h27l16 31h-59z"/><path d="M145 58a16 16 0 1 1 32 0v23h-32z"/><path class="detail" d="M152 101h17m-17 12h17m-17 12h17"/>',
    "hardhat": '<path d="M90 151a70 70 0 0 1 140 0v18H90z"/><path d="M76 164h168v24H76z"/><path class="detail" d="M160 87v64m-50-41 23 30m77-30-23 30"/>',
    "glove": '<path d="M111 199 92 137q-5-17 8-21 12-4 18 12l12 28-17-70q-4-16 9-20 13-3 18 14l14 56-8-72q-2-16 11-18 14-1 16 16l8 73 3-53q1-16 14-15 13 2 12 18l-3 81q-1 43-34 57l-28 12q-28 11-42-16z"/><path class="detail" d="m123 151 20 42m15-47 10 43m14-46 6 39"/>',
    "lock": '<path d="M112 121V95a48 48 0 0 1 96 0v26h-25V95a23 23 0 0 0-46 0v26z"/><rect x="91" y="116" width="138" height="103" rx="8"/><circle cx="160" cy="157" r="10"/><path d="M155 164h10v25h-10z"/><path class="detail" d="M106 132h108"/>',
    "water": '<path d="M160 45c-18 28-56 68-56 105a56 56 0 0 0 112 0c0-37-38-77-56-105z"/><path class="detail" d="M128 162a32 32 0 0 0 32 28"/>',
    "generic": '<path d="M97 118h126v88H97z"/><path d="M116 95h88v23h-88z"/><path class="detail" d="M117 139h86m-86 18h55m-55 18h72"/>',
}


def choose_shape(name, category):
    name = name.casefold()
    category = category.casefold()
    checks = [
        (("taladro", "atornillador", "esmeril", "pulidora", "sierra circular", "lijadora"), "drill"),
        (("martillo",), "hammer"),
        (("destornillador",), "screwdriver"),
        (("serrucho", "segueta", "disco de corte"), "saw"),
        (("alicate", "llave", "pinza"), "tool"),
        (("brocha",), "brush"),
        (("rodillo",), "roller"),
        (("pintura", "barniz", "esmalte", "anticorrosivo", "thinner", "masilla"), "paint"),
        (("bombillo", "portalámparas"), "bulb"),
        (("cable", "breaker", "interruptor", "tomacorriente", "extensión", "regleta"), "cable"),
        (("tubo", "codo", "tee pvc", "unión", "sifón", "flexible", "pegante para pvc"), "pipe"),
        (("grifo", "llave de paso"), "faucet"),
        (("tornillo", "tuerca", "arandela", "clavo"), "bolt"),
        (("candado", "cerradura", "cerrojo", "chapa", "bisagra"), "lock"),
        (("guante",), "glove"),
        (("casco", "chaleco", "gafa"), "hardhat"),
        (("manguera", "aspersor"), "water"),
        (("pala", "rastrillo", "tijera de podar", "podadora"), "shovel"),
        (("árbol", "tierra", "fertilizante"), "tree"),
        (("ladrillo", "malla", "varilla", "alambre", "cemento", "arena", "cal"), "brick"),
        (("espuma", "silicona", "impermeabilizante"), "bag"),
    ]
    for words, shape in checks:
        if any(word in name for word in words):
            return shape
    category_shapes = {
        "herramientas manuales": "tool",
        "herramientas eléctricas": "drill",
        "pinturas": "paint",
        "electricidad": "bulb",
        "tornillería": "bolt",
        "jardinería": "tree",
        "seguridad": "hardhat",
        "cerraduras": "lock",
        "construcción": "brick",
        "plomería": "pipe",
    }
    return category_shapes.get(category, "generic")


def illustration(product):
    product_id = product["id"].strip()
    name = product["nombre"].strip()
    category = product["categoria"].strip()
    seed = 0
    for char in product_id + name:
        seed = (seed * 31 + ord(char)) & 0xFFFFFFFF
    bg, ink, accent, shade = PALETTES[seed % len(PALETTES)]
    shape = SHAPES[choose_shape(name, category)]
    rotation = seed % 7 - 3
    label = html.escape(name[:27])
    category_label = html.escape(category.upper())
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 260" role="img" aria-label="Ilustración referencial de {html.escape(name, quote=True)}">
  <rect width="320" height="260" fill="{bg}"/>
  <path d="M0 214 320 168v92H0z" fill="{shade}" opacity=".18"/>
  <circle cx="246" cy="59" r="49" fill="{accent}" opacity=".36"/>
  <circle cx="246" cy="59" r="62" fill="none" stroke="{ink}" stroke-opacity=".08"/>
  <g fill="{ink}" stroke="{ink}" stroke-linecap="round" stroke-linejoin="round" transform="rotate({rotation} 160 135)">{shape}</g>
  <g fill="none" stroke="{accent}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" transform="rotate({rotation} 160 135)">{shape}</g>
  <path d="M20 220h280" stroke="{ink}" stroke-opacity=".16"/>
  <text x="20" y="239" fill="{ink}" font-family="Arial,sans-serif" font-size="12" font-weight="700">{label}</text>
  <text x="300" y="239" text-anchor="end" fill="{ink}" fill-opacity=".62" font-family="Arial,sans-serif" font-size="8" font-weight="700" letter-spacing="1.2">{category_label}</text>
  <text x="20" y="25" fill="{ink}" fill-opacity=".56" font-family="Arial,sans-serif" font-size="8" font-weight="700" letter-spacing="1.4">ILUSTRACIÓN REFERENCIAL</text>
</svg>
'''


def main():
    with CATALOG.open(encoding="utf-8-sig", newline="") as source:
        products = list(csv.DictReader(source))
    OUTPUT.mkdir(parents=True, exist_ok=True)
    with MANIFEST.open("w", encoding="utf-8", newline="") as output:
        writer = csv.writer(output, lineterminator="\n")
        writer.writerow(["id", "nombre", "categoria", "image_url"])
        for product in products:
            product_id = product["id"].strip()
            if not product_id:
                raise ValueError(f"Product without an id: {product}")
            (OUTPUT / f"{product_id}.svg").write_text(illustration(product), encoding="utf-8")
            writer.writerow([
                product_id,
                product["nombre"],
                product["categoria"],
                f"{PUBLIC_BASE}images/products/{product_id}.svg",
            ])
    print(f"Generated {len(products)} product illustrations and {MANIFEST.relative_to(ROOT)}.")


if __name__ == "__main__":
    main()
