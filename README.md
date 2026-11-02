# Ferretería Bellabista

Sitio estático para consultar el inventario y preparar pedidos de Ferretería Bellabista. El dueño edita los productos en Google Sheets y la página los consulta desde una hoja publicada como CSV. Los clientes pueden buscar y filtrar productos, armar un carrito y enviar el pedido por WhatsApp para confirmar disponibilidad y pagar en la ferretería. No hay panel de administración ni se necesitan Firebase, cuentas de servicio o claves de API.

## Archivos principales

- `index.html`: página principal con visión de marca, accesos a categorías, guía de pedido, inventario, carrito y contacto.
- `css/styles.css`: estilos.
- `js/app.js`: carga y muestra la hoja, búsqueda, filtro por categoría, carrito local y pedido por WhatsApp.
- `js/catalog.js`: lectura y validación del CSV.
- `js/sheets-config.js`: URL pública CSV que conecta la página con la hoja.
- `data/products.csv`: catálogo de ejemplo listo para importar en Sheets (105 productos).
- `data/products.json`: datos originales del catálogo de ejemplo.
- `js/illustrations.js`: ilustraciones vectoriales originales usadas cuando un producto no tiene foto.

## 1. Crear la hoja de inventario

1. Descarga `data/products.csv` desde GitHub (abre el archivo y elige **Download raw file**) o usa el CSV que ya tienes en el repositorio.
2. En Google Sheets crea una hoja de cálculo y selecciona **Archivo → Importar → Subir**. Sube ese CSV y elige reemplazar la hoja actual. Así tendrás los 105 productos de ejemplo; reemplaza precios y existencias con los datos reales antes de publicar.
3. La primera fila debe conservar estos encabezados, en este orden o cualquier otro: `id`, `nombre`, `categoria`, `precio`, `existencias`, `foto`. `id` y `foto` pueden quedar vacíos; `nombre`, `categoria`, `precio` y `existencias` son obligatorios. `precio` y `existencias` deben ser números sin símbolo de moneda ni separador de miles, por ejemplo `18500` y `12`. Si no hay URL de foto, la página crea una ilustración vectorial referencial según el nombre y la categoría.
4. Para agregar productos, añade una fila; para quitarlos, elimina la fila. Los cambios se reflejan cuando la página vuelve a cargar; la publicación puede tardar un momento en actualizarse.

## 2. Publicar y conectar la hoja

1. En Sheets abre **Archivo → Compartir → Publicar en la web**.
2. Selecciona la pestaña que contiene el inventario y el formato **Valores separados por comas (.csv)**. Pulsa **Publicar** y confirma.
3. La hoja actual ya está conectada en `js/sheets-config.js` usando su URL CSV publicada. Para usar otra hoja, pega allí su URL CSV de publicación; no uses la URL de edición ni compartas permisos de edición con el público.
4. Publicar el CSV hace **públicos y descargables todos los datos de esa pestaña** para cualquier persona con el enlace, y pueden ser indexados o copiados. No incluyas costos internos, datos personales ni información confidencial. La página es de solo lectura: para cambiar inventario, el dueño edita Sheets.

La URL configurada usa el formato `https://docs.google.com/spreadsheets/d/e/.../pub?output=csv`. No se necesitan credenciales ni secretos en el repositorio.

## 3. Activar GitHub Pages

En el repositorio ve a **Settings → Pages**, elige **Deploy from a branch**, la rama `main` y la carpeta `/ (root)`. La web quedará en `https://TU-USUARIO.github.io/ferreteria-bellabista/`.

## Imágenes de productos

Cada producto tiene una ilustración vectorial original generada localmente a partir de su nombre y categoría; se adapta a herramientas, materiales y otras familias del inventario y se identifica como **ilustración referencial**, no como una foto del producto exacto. Si la columna `foto` contiene una imagen, esa imagen se muestra en su lugar. Si no carga, la página vuelve a la ilustración. Para mostrar fotos reales, agrega una URL pública de imagen en la columna `foto` de Google Sheets.

## Carrito y pedidos

El carrito se guarda en el navegador para conservar la selección al volver a visitar la página. Las cantidades no pueden superar las existencias publicadas en la hoja. Al enviar el pedido se abre WhatsApp con el detalle y el subtotal estimado; el cliente confirma la disponibilidad y paga directamente en la ferretería. La página no procesa pagos en línea. El teléfono de WhatsApp se configura en `js/app.js`.

## Probar en tu computador

Abrir `index.html` con doble clic no permite cargar los módulos de JavaScript. Desde la carpeta del proyecto ejecuta:

```sh
python3 -m http.server 8000
```

y entra a `http://localhost:8000`. La página carga la hoja pública configurada en `js/sheets-config.js`; también puede usarse localmente mientras haya conexión a internet. Las hojas publicadas son públicas también durante las pruebas.
