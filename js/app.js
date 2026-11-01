import { firebaseConfig, ADMIN_EMAIL } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, doc, onSnapshot, setDoc, deleteDoc, writeBatch } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const products = collection(db, "productos");

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

const normalizeProduct = (raw = {}) => {
  const data = raw && typeof raw === "object" ? raw : {};
  const name = String(data.name ?? "").trim() || "Producto sin nombre";
  const category = String(data.category ?? "").trim() || "General";
  const price = Number(data.price) || 0;
  const stock = Number(data.stock) || 0;
  return {
    id: String(data.id ?? ""),
    name,
    category,
    price,
    stock,
    photo: String(data.photo ?? "").trim(),
  };
};

let all = [];

function renderCategories() {
  const cats = [...new Set(all.map((p) => p.category))].sort(collator.compare);
  $("#categories").innerHTML = cats.map((c) => `<option value="${esc(c)}"></option>`).join("");
  const sel = $("#category"), current = sel.value;
  sel.innerHTML = '<option value="">Todas las categorías</option>' +
    cats.map((c) => `<option${c === current ? " selected" : ""}>${esc(c)}</option>`).join("");
}

function renderCatalog() {
  const q = $("#search").value.trim().toLowerCase();
  const cat = $("#category").value;
  const list = all.filter((p) => {
    const name = String(p.name ?? "").toLowerCase();
    return (!cat || p.category === cat) && name.includes(q);
  });
  $("#catalog").innerHTML = list.map((p) => `
    <article class="card">
      <div class="ph"><img src="${esc(p.photo || `images/products/${p.id}.jpg`)}" data-cat="${esc(p.category)}" alt="${esc(p.name)}" loading="lazy"></div>
      <div class="body">
        <span class="tag">${esc(p.category)}</span>
        <h3>${esc(p.name)}</h3>
        <p class="price">${fmt(p.price)}</p>
        <p class="${p.stock > 0 ? "ok" : "no"}">${p.stock > 0 ? `Disponible · ${p.stock} und.` : "Agotado"}</p>
      </div>
    </article>`).join("");
  $("#status").textContent = !all.length
    ? "Aún no hay productos. El administrador puede importar el catálogo inicial."
    : list.length ? "" : "No encontramos productos con esa búsqueda.";
}

function renderAdmin() {
  $("#admin-list").innerHTML = all.map((p) => `
    <div class="row item">
      <span class="grow"><strong>${esc(p.name)}</strong> <span class="muted">${esc(p.category)}</span></span>
      <label>Precio <input type="number" min="0" step="100" value="${p.price}" data-id="${p.id}" data-field="price"></label>
      <label>Cant. <input type="number" min="0" value="${p.stock}" data-id="${p.id}" data-field="stock"></label>
      <button class="btn ghost small" data-del="${p.id}">Eliminar</button>
    </div>`).join("");
}

// Catálogo en tiempo real: cualquier cambio se ve al instante para todos los visitantes.
onSnapshot(products, (snap) => {
  all = snap.docs
    .map((d) => normalizeProduct({ id: d.id, ...d.data() }))
    .sort((a, b) => collator.compare(a.category, b.category) || collator.compare(a.name, b.name));
  renderCategories();
  renderCatalog();
  if (!$("#tools").hidden) renderAdmin();
}, (err) => {
  $("#status").textContent = "No se pudo cargar el inventario: " + err.message;
});

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
$("#admin-toggle").addEventListener("click", () => { $("#admin").hidden = !$("#admin").hidden; });

// Autenticación del administrador
$("#login").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, $("#email").value.trim(), $("#password").value);
    $("#password").value = "";
    $("#login-msg").textContent = "";
  } catch {
    $("#login-msg").textContent = "Correo o contraseña incorrectos.";
  }
});
$("#logout").addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, (user) => {
  const isAdmin = !!user && user.email === ADMIN_EMAIL;
  if (user && !isAdmin) {
    $("#login-msg").textContent = "Esa cuenta no es de administrador.";
    signOut(auth);
    return;
  }
  $("#auth").hidden = isAdmin;
  $("#tools").hidden = !isAdmin;
  if (isAdmin) renderAdmin();
});

// Editar precio/cantidad y eliminar productos
$("#admin-list").addEventListener("change", (e) => {
  const { id, field } = e.target.dataset;
  if (!id) return;
  setDoc(doc(db, "productos", id), { [field]: Math.max(0, Number(e.target.value) || 0) }, { merge: true });
});

$("#admin-list").addEventListener("click", (e) => {
  const id = e.target.dataset.del;
  if (!id) return;
  if (e.target.dataset.sure) {
    deleteDoc(doc(db, "productos", id));
  } else {
    e.target.dataset.sure = "1";
    e.target.textContent = "¿Seguro?";
  }
});

// Agregar un producto nuevo
$("#new-product").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const name = String(f.get("name") ?? "").trim();
  if (!name) return;
  await setDoc(doc(db, "productos", "p" + Date.now().toString(36)), {
    name,
    category: String(f.get("category") || "").trim() || "General",
    price: Number(f.get("price")) || 0,
    stock: Number(f.get("stock")) || 0,
    photo: String(f.get("photo") || "").trim(),
  });
  e.target.reset();
});

// Importar el catálogo inicial (data/products.json): ids p001 a p105
$("#seed").addEventListener("click", async () => {
  if (all.length && !confirm("Ya hay productos. ¿Importar el catálogo inicial? Se sobrescribirán los del catálogo base (p001 a p105).")) return;
  const { items } = await (await fetch("data/products.json")).json();
  const batch = writeBatch(db);
  items.forEach(([name, category, price, stock], i) =>
    batch.set(doc(db, "productos", "p" + String(i + 1).padStart(3, "0")), { name, category, price, stock, photo: "" }));
  await batch.commit();
  alert("Catálogo importado ✓");
});
