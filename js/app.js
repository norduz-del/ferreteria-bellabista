import { SHEETS_CSV_URL } from "./sheets-config.js";
import { productsFromCSV } from "./catalog.js";
import { productIllustration } from "./illustrations.js";

const $ = (selector) => document.querySelector(selector);
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[char]));
const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});
const collator = new Intl.Collator("es");
const CART_KEY = "bellabista-cart-v1";
const WHATSAPP_PHONE = "573154187423";
let products = [];
let cart = loadCart();

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter((item) =>
      item && typeof item.id === "string" && Number.isInteger(item.quantity) && item.quantity > 0
    );
  } catch (error) {
    console.warn("No se pudo leer el carrito guardado en este navegador.", error);
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.warn("No se pudo guardar el carrito en este navegador.", error);
  }
}

function productById(id) {
  return products.find((product) => product.id === id);
}

function renderCategories() {
  const categories = [...new Set(products.map((product) => product.category))].sort(collator.compare);
  const select = $("#category");
  const selected = select.value;
  select.innerHTML = '<option value="">Todas las categorías</option>' +
    categories.map((category) => `<option value="${esc(category)}"${category === selected ? " selected" : ""}>${esc(category)}</option>`).join("");
}

function filteredProducts() {
  const query = $("#search").value.trim().toLocaleLowerCase("es");
  const category = $("#category").value;
  return products.filter((product) =>
    (!category || product.category === category) &&
    String(product.name).toLocaleLowerCase("es").includes(query)
  );
}

function renderCatalog() {
  const visible = filteredProducts();
  $("#catalog").innerHTML = visible.map((product) => {
    const stock = Math.max(0, Math.floor(product.stock));
    const hasPhoto = Boolean(product.photo);
    const image = product.photo || productIllustration(product);
    return `
      <article class="product-card">
        <div class="product-photo${hasPhoto ? "" : " is-illustration"}">
          <img src="${esc(image)}" data-product-id="${esc(product.id)}" data-illustration="${hasPhoto ? "false" : "true"}" alt="${esc(hasPhoto ? product.name : `Ilustración referencial de ${product.name}`)}" loading="lazy">
          <span class="illustration-note"${hasPhoto ? " hidden" : ""}>Ilustración referencial</span>
          <span class="photo-badge">${esc(product.category)}</span>
        </div>
        <div class="product-info">
          <h3>${esc(product.name)}</h3>
          <p class="product-stock ${stock > 0 ? "" : "out-of-stock"}"><span></span>${stock > 0 ? `Disponible · ${stock} und.` : "Agotado"}</p>
          <div class="product-buy"><strong>${currency.format(product.price)}</strong>
            <button class="add-button" type="button" data-add="${esc(product.id)}" ${stock === 0 ? "disabled" : ""} aria-label="Agregar ${esc(product.name)} al carrito">
              <span aria-hidden="true">＋</span> Agregar
            </button>
          </div>
        </div>
      </article>`;
  }).join("");
  $("#catalog-count").textContent = products.length ? `${visible.length} ${visible.length === 1 ? "producto" : "productos"}` : "";
  if (products.length) {
    $("#status").textContent = visible.length ? "" : "No encontramos productos con esa búsqueda.";
  }
}

function renderCart() {
  const items = cart.map((entry) => ({ ...entry, product: productById(entry.id) }))
    .filter((entry) => entry.product);
  const units = items.reduce((total, entry) => total + entry.quantity, 0);
  const subtotal = items.reduce((total, entry) => total + entry.product.price * entry.quantity, 0);
  const count = $("#cart-count");
  count.textContent = String(units);
  $(".cart-link").setAttribute("aria-label", `Ver carrito, ${units} ${units === 1 ? "producto" : "productos"}`);
  $("#cart-summary").textContent = `${units} ${units === 1 ? "producto" : "productos"}`;
  $("#cart-subtotal").textContent = currency.format(subtotal);
  $("#cart-empty").hidden = items.length > 0;
  $("#cart-items").innerHTML = items.map(({ product, quantity }) => `
    <article class="cart-item">
      <div class="cart-item-copy"><strong>${esc(product.name)}</strong><small>${currency.format(product.price)} c/u</small></div>
      <div class="cart-item-actions">
        <div class="quantity-control" aria-label="Cantidad de ${esc(product.name)}">
          <button type="button" data-quantity="${esc(product.id)}" data-change="-1" aria-label="Quitar una unidad de ${esc(product.name)}">−</button>
          <span>${quantity}</span>
          <button type="button" data-quantity="${esc(product.id)}" data-change="1" aria-label="Agregar una unidad de ${esc(product.name)}" ${quantity >= Math.floor(product.stock) ? "disabled" : ""}>+</button>
        </div>
        <strong class="item-total">${currency.format(product.price * quantity)}</strong>
        <button class="remove-button" type="button" data-remove="${esc(product.id)}" aria-label="Eliminar ${esc(product.name)} del carrito">Eliminar</button>
      </div>
    </article>`).join("");
  const checkout = $("#checkout");
  checkout.classList.toggle("is-disabled", items.length === 0);
  checkout.setAttribute("aria-disabled", String(items.length === 0));
  checkout.href = items.length ? whatsappUrl(items) : "#";
}

function whatsappUrl(items) {
  const lines = [
    "Hola, Ferretería Bellabista. Quiero solicitar este pedido para confirmar disponibilidad y pagar en la ferretería:",
    "",
    ...items.map(({ product, quantity }) => `- ${product.name} x${quantity} — ${currency.format(product.price * quantity)}`),
    "",
    `Subtotal estimado: ${currency.format(items.reduce((total, entry) => total + entry.product.price * entry.quantity, 0))}`,
    "",
    "Entiendo que este pedido queda pendiente de confirmación y que el pago se realiza en la ferretería.",
  ];
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function updateCart(id, quantity) {
  const product = productById(id);
  if (!product) return;
  const limit = Math.floor(product.stock);
  const existing = cart.find((entry) => entry.id === id);
  if (quantity <= 0 || limit <= 0) {
    cart = cart.filter((entry) => entry.id !== id);
  } else if (existing) {
    existing.quantity = Math.min(quantity, limit);
  } else {
    cart.push({ id, quantity: Math.min(quantity, limit) });
  }
  saveCart();
  renderCart();
}

$("#catalog").addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const id = button.dataset.add;
  const current = cart.find((entry) => entry.id === id)?.quantity || 0;
  updateCart(id, current + 1);
  window.location.hash = "carrito";
  $("#carrito").scrollIntoView({ behavior: "smooth", block: "start" });
  button.classList.add("added");
  button.setAttribute("aria-label", "Producto agregado al carrito");
  window.setTimeout(() => {
    if (!button.isConnected) return;
    button.classList.remove("added");
    button.setAttribute("aria-label", `Agregar ${productById(id)?.name || "producto"} al carrito`);
  }, 900);
});

$("#cart-items").addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  if (quantityButton) {
    const entry = cart.find((item) => item.id === quantityButton.dataset.quantity);
    if (entry) updateCart(entry.id, entry.quantity + Number(quantityButton.dataset.change));
    return;
  }
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) updateCart(removeButton.dataset.remove, 0);
});

$("#search").addEventListener("input", renderCatalog);
$("#category").addEventListener("change", renderCatalog);
$(".category-grid").addEventListener("click", (event) => {
  const tile = event.target.closest("[data-category-link]");
  if (!tile) return;
  const category = tile.dataset.categoryLink;
  const select = $("#category");
  if ([...select.options].some((option) => option.value === category)) {
    select.value = category;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }
  $("#inventario").scrollIntoView({ behavior: "smooth" });
});
$("#year").textContent = String(new Date().getFullYear());

$("#catalog").addEventListener("error", (event) => {
  const image = event.target;
  if (image.tagName !== "IMG" || image.dataset.illustration === "true") return;
  const product = productById(image.dataset.productId);
  if (!product) return;
  image.dataset.illustration = "true";
  image.alt = `Ilustración referencial de ${product.name}`;
  image.src = productIllustration(product);
  image.parentElement.classList.add("is-illustration");
  image.parentElement.querySelector(".illustration-note").hidden = false;
}, true);

async function loadCatalog() {
  if (!SHEETS_CSV_URL.trim()) {
    $("#status").textContent = "El inventario aún no está configurado. Publica la hoja de Google Sheets y pega su URL CSV en js/sheets-config.js.";
    return;
  }
  try {
    const response = await fetch(SHEETS_CSV_URL);
    if (!response.ok) throw new Error(`Google Sheets respondió con HTTP ${response.status}.`);
    products = productsFromCSV(await response.text())
      .sort((a, b) => collator.compare(a.category, b.category) || collator.compare(a.name, b.name));
    const validIds = new Set(products.map((product) => product.id));
    cart = cart.filter((entry) => validIds.has(entry.id))
      .map((entry) => ({ ...entry, quantity: Math.min(entry.quantity, Math.floor(productById(entry.id).stock)) }))
      .filter((entry) => entry.quantity > 0);
    saveCart();
    renderCategories();
    renderCatalog();
    renderCart();
    if (!products.length) $("#status").textContent = "La hoja está publicada, pero todavía no tiene productos.";
  } catch (error) {
    $("#status").textContent = `No se pudo cargar el inventario: ${error.message}`;
  }
}

renderCart();
loadCatalog();
