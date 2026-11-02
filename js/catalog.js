const HEADER_ALIASES = {
  id: ["id"],
  name: ["nombre", "name"],
  category: ["categoria", "categoría", "category"],
  price: ["precio", "price"],
  stock: ["existencias", "cantidad", "stock"],
  photo: ["foto", "imagen", "photo"],
};

export function parseCSV(text) {
  const input = String(text).replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (quoted) {
      if (char === '"' && input[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      if (field.length) throw new Error("El CSV contiene comillas fuera de lugar.");
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && input[i + 1] === "\n") i += 1;
      row.push(field);
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (quoted) throw new Error("El CSV contiene un campo entre comillas sin cerrar.");
  row.push(field);
  if (row.some((cell) => cell.trim() !== "")) rows.push(row);
  return rows;
}

export function productsFromCSV(text) {
  const rows = parseCSV(text);
  if (!rows.length) return [];
  const headers = rows[0].map((header) => header.trim().toLocaleLowerCase("es"));
  const columns = Object.fromEntries(Object.entries(HEADER_ALIASES).map(([key, aliases]) => [
    key,
    headers.findIndex((header) => aliases.includes(header)),
  ]));
  const missing = ["name", "category", "price", "stock"].filter((key) => columns[key] < 0);
  if (missing.length) {
    const labels = { name: "nombre", category: "categoria", price: "precio", stock: "existencias" };
    throw new Error(`Faltan columnas requeridas: ${missing.map((key) => labels[key]).join(", ")}.`);
  }

  return rows.slice(1).map((cells, index) => {
    if (cells.length !== headers.length) {
      throw new Error(`La fila ${index + 2} tiene ${cells.length} columnas; se esperaban ${headers.length}.`);
    }
    const value = (key) => columns[key] < 0 ? "" : cells[columns[key]].trim();
    const name = value("name");
    const priceText = value("price");
    const stockText = value("stock");
    const price = Number(priceText);
    const stock = Number(stockText);
    if (!name) throw new Error(`Falta el nombre del producto en la fila ${index + 2}.`);
    if (priceText === "" || !Number.isFinite(price) || price < 0) {
      throw new Error(`El precio de la fila ${index + 2} debe ser un número igual o mayor que cero.`);
    }
    if (stockText === "" || !Number.isFinite(stock) || stock < 0) {
      throw new Error(`Las existencias de la fila ${index + 2} deben ser un número igual o mayor que cero.`);
    }
    return {
      id: value("id") || `p${String(index + 1).padStart(3, "0")}`,
      name,
      category: value("category") || "General",
      price,
      stock,
      photo: value("photo"),
    };
  });
}
