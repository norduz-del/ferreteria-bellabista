# Ferretería Bellabista

Sitio estático para consultar el inventario de la ferretería. El dueño edita los productos en Google Sheets y la página los consulta desde una hoja publicada como CSV. No hay panel de administración ni se necesitan Firebase, cuentas de servicio o claves de API.

## Archivos principales

- `index.html`: página y catálogo público.
- `css/styles.css`: estilos.
- `js/app.js`: carga y muestra la hoja, búsqueda, filtro por categoría y fotos.
- `js/catalog.js`: lectura y validación del CSV.
- `js/sheets-config.js`: URL pública CSV que conecta la página con la hoja.
- `data/products.csv`: catálogo de ejemplo listo para importar en Sheets (105 productos).
- `data/products.json`: datos originales del catálogo de ejemplo.
- `images/products/`: fotos locales opcionales; también se puede indicar una URL en la hoja.

## 1. Crear la hoja de inventario

1. Descarga `data/products.csv` desde GitHub (abre el archivo y elige **Download raw file**) o usa el CSV que ya tienes en el repositorio.
2. En Google Sheets crea una hoja de cálculo y selecciona **Archivo → Importar → Subir**. Sube ese CSV y elige reemplazar la hoja actual. Así tendrás los 105 productos de ejemplo; reemplaza precios y existencias con los datos reales antes de publicar.
3. La primera fila debe conservar estos encabezados, en este orden o cualquier otro: `id`, `nombre`, `categoria`, `precio`, `existencias`, `foto`. `id` y `foto` pueden quedar vacíos; `nombre`, `categoria`, `precio` y `existencias` son obligatorios. `precio` y `existencias` deben ser números sin símbolo de moneda ni separador de miles, por ejemplo `18500` y `12`. Si no hay foto, deja `foto` vacío; se usará la imagen local `images/products/<id>.jpg` y, si tampoco existe, el icono de categoría.
4. Para agregar productos, añade una fila; para quitarlos, elimina la fila. Los cambios se reflejan cuando la página vuelve a cargar; la publicación puede tardar un momento en actualizarse.

## 2. Publicar y conectar la hoja

1. En Sheets abre **Archivo → Compartir → Publicar en la web**.
2. Selecciona la pestaña que contiene el inventario y el formato **Valores separados por comas (.csv)**. Pulsa **Publicar** y confirma.
3. La hoja actual ya está conectada en `js/sheets-config.js` usando su URL CSV publicada. Para usar otra hoja, pega allí su URL CSV de publicación; no uses la URL de edición ni compartas permisos de edición con el público.
4. Publicar el CSV hace **públicos y descargables todos los datos de esa pestaña** para cualquier persona con el enlace, y pueden ser indexados o copiados. No incluyas costos internos, datos personales ni información confidencial. La página es de solo lectura: para cambiar inventario, el dueño edita Sheets.

La URL configurada usa el formato `https://docs.google.com/spreadsheets/d/e/.../pub?output=csv`. No se necesitan credenciales ni secretos en el repositorio.

## 3. Activar GitHub Pages

En el repositorio ve a **Settings → Pages**, elige **Deploy from a branch**, la rama `main` y la carpeta `/ (root)`. La web quedará en `https://TU-USUARIO.github.io/ferreteria-bellabista/`.

## Fotos

Puedes usar una URL pública de imagen en la columna `foto`, o guardar fotos propias en `images/products/` usando el id como nombre (por ejemplo, `p001.jpg`). Si la foto no está disponible, se muestra un ícono de la categoría. El script opcional `scripts/fetch_photos.py` descarga fotos desde Pexels; revisa cada imagen y su licencia antes de publicarla.

## Probar en tu computador

Abrir `index.html` con doble clic no permite cargar los módulos de JavaScript. Desde la carpeta del proyecto ejecuta:

```sh
python3 -m http.server 8000
```

y entra a `http://localhost:8000`. La página carga la hoja pública configurada en `js/sheets-config.js`; también puede usarse localmente mientras haya conexión a internet. Las hojas publicadas son públicas también durante las pruebas.
