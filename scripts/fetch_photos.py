#!/usr/bin/env python3
"""Descarga fotos de Pexels para la portada y para cada producto.

Uso (desde la raíz del repositorio):
    PEXELS_KEY=tu_clave python3 scripts/fetch_photos.py

Clave gratis: https://www.pexels.com/api/
Licencia de las fotos: https://www.pexels.com/license/
Las fotos que ya existan no se vuelven a descargar.
"""
import json
import os
import time
import urllib.parse
import urllib.request
from pathlib import Path

KEY = os.environ.get("PEXELS_KEY")
if not KEY:
    raise SystemExit("Falta la variable PEXELS_KEY")

ROOT = Path(__file__).resolve().parent.parent
PRODUCTS_DIR = ROOT / "images" / "products"
PRODUCTS_DIR.mkdir(parents=True, exist_ok=True)


def photo_url(query):
    params = urllib.parse.urlencode({"query": query, "per_page": 1, "orientation": "landscape"})
    req = urllib.request.Request(f"https://api.pexels.com/v1/search?{params}", headers={"Authorization": KEY})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.load(r)
    photos = data.get("photos") or []
    if not photos:
        return None
    src = photos[0].get("src") or {}
    return src.get("large") or src.get("large2x") or src.get("original")


def fetch(query, dest):
    if dest.exists():
        return
    try:
        url = photo_url(query)
        if not url:
            print("sin resultados:", query)
            return
        with urllib.request.urlopen(url, timeout=60) as r:
            dest.write_bytes(r.read())
        print("ok:", dest.name, "<-", query)
    except Exception as err:
        print("error:", query, err)
    time.sleep(0.5)


# Portada
fetch("hardware store tools", ROOT / "images" / "hero.jpg")

# Productos: el id es p001, p002, ... en el mismo orden que data/products.json
items = json.loads((ROOT / "data" / "products.json").read_text(encoding="utf-8"))["items"]
for i, (name, *_rest) in enumerate(items, start=1):
    fetch(name, PRODUCTS_DIR / f"p{i:03d}.jpg")
