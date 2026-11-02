import { SHEETS_CSV_URL } from "./sheets-config.js";
import { productsFromCSV } from "./catalog.js";

const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmt = (n) => "$" + Number(n).toLocaleString("es-CO");
const collator = new Intl.Collator("es");

const ICONS = {
  "Herramientas manuales": "🔧", "Herramientas eléctricas": "⚡", "Tornillería": "🔩", "Plomería": "🚰",
  "Electricidad": "💡", "Pinturas": "🎨", "Construcción": "🧱", "Jardinería": "🌱", "Seguridad": "🦺", "Cerraduras": "🔑",
};
const placeholder = (cat) => "data:image/svg+xml," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#fff3c4"/><text x="200" y="180" font-size="120" text-anchor="middle">${ICONS[cat] || "🛠️"}</text></svg>`
);

let all = [];

function renderCategories() {
  const cats = [...new Set(all.map((p) => p.category))].sort(collator.compare);
  const sel = $("#category"), current = sel.value;
  sel.innerHTML = '<option value="">Todas las categorías</option>' +
    cats.map((c) => `<option${c === current ? " selected" : ""}>${esc(c)}</option>`).join("");
}

function renderCatalog() {
  const q = $("#search").value.trim().toLocaleLowerCase("es");
  const cat = $("#category").value;
  const list = all.filter((p) => {
    const name = String(p.name ?? "").toLocaleLowerCase("es");
    return (!cat || p.category === cat) && name.includes(q);
  });
  $("#catalog").innerHTML = list.map((p) => `
    <article class="card">
      <div class="ph"><img src="${esc(p.photo || `images/products/${encodeURIComponent(p.id)}.jpg`)}" data-cat="${esc(p.category)}" alt="${esc(p.name)}" loading="lazy"></div>
      <div class="body">
        <span class="tag">${esc(p.category)}</span>
        <h3>${esc(p.name)}</h3>
        <p class="price">${fmt(p.price)}</p>
        <p class="${p.stock > 0 ? "ok" : "no"}">${p.stock > 0 ? `Disponible · ${p.stock} und.` : "Agotado"}</p>
      </div>
    </article>`).join("");
  if (!all.length) return;
  $("#status").textContent = list.length ? "" : "No encontramos productos con esa búsqueda.";
}

async function loadCatalog() {
  if (!SHEETS_CSV_URL.trim()) {
    $("#status").textContent = "El inventario aún no está configurado. Publica la hoja de Google Sheets y pega su URL CSV en js/sheets-config.js.";
    return;
  }
  try {
    const response = await fetch(SHEETS_CSV_URL);
    if (!response.ok) throw new Error(`Google Sheets respondió con HTTP ${response.status}.`);
    all = productsFromCSV(await response.text())
      .sort((a, b) => collator.compare(a.category, b.category) || collator.compare(a.name, b.name));
    renderCategories();
    renderCatalog();
    if (!all.length) $("#status").textContent = "La hoja está publicada, pero todavía no tiene productos.";
  } catch (error) {
    $("#status").textContent = `No se pudo cargar el inventario: ${error.message}`;
  }
}

// Si una foto no existe, mostrar el ícono de la categoría.
$("#catalog").addEventListener("error", (e) => {
  const img = e.target;
  if (img.tagName === "IMG" && !img.dataset.fallback) {
    img.dataset.fallback = "1";
    img.src = placeholder(img.dataset.cat);
  }
}, true);

$("#search").addEventListener("input", renderCatalog);
$("#category").addEventListener("change", renderCatalog);
loadCatalog();
