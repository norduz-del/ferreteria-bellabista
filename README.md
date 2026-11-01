# Ferretería Bellabista

Sitio de la ferretería con catálogo con fotos, búsqueda y panel de administración. Está hecho con HTML, CSS y JavaScript. El inventario se guarda en Firebase (plan gratuito) y la web se publica con GitHub Pages.

## Estructura

- `index.html`: página principal
- `css/styles.css`: estilos
- `js/app.js`: catálogo, búsqueda y modo admin
- `js/firebase-config.js`: claves de Firebase y correo del administrador
- `data/products.json`: catálogo inicial (105 productos de ejemplo)
- `images/`: foto de portada y fotos de productos
- `scripts/fetch_photos.py`: descarga fotos desde Pexels
- `firestore.rules`: reglas de seguridad de la base de datos

## 1. Subir a GitHub

Crea un repositorio nuevo, por ejemplo `ferreteria-bellabista`, y sube todos los archivos. Puedes arrastrarlos en la página del repositorio con *Add file → Upload files*. Antes descomprime el zip.

## 2. Configurar Firebase

1. En console.firebase.google.com crea un proyecto y agrega una app web (ícono `</>`). Copia el objeto `firebaseConfig` en `js/firebase-config.js`.
2. En **Build → Firestore Database** crea la base de datos en modo de producción. En la pestaña **Reglas** pega el contenido de `firestore.rules` con tu correo y publica.
3. En **Build → Authentication** habilita **Correo electrónico/contraseña** y crea el usuario administrador con ese mismo correo.
4. En **Authentication → Settings → Authorized domains** agrega `TU-USUARIO.github.io`.
5. Pon ese mismo correo en `ADMIN_EMAIL` dentro de `js/firebase-config.js`.

## 3. Activar GitHub Pages

En el repositorio ve a **Settings → Pages**, elige **Deploy from a branch**, la rama `main` y la carpeta `/ (root)`. La web quedará en `https://TU-USUARIO.github.io/ferreteria-bellabista/`.

## 4. Cargar el inventario

Abre la web, pulsa **Modo admin** en el pie de página e inicia sesión. Pulsa **Importar catálogo inicial** y luego ajusta precios y cantidades reales. Desde ahí también puedes agregar y eliminar productos.

## 5. Fotos

Desde la raíz del proyecto, con una clave gratuita de [Pexels](https://www.pexels.com/api/):

```
PEXELS_KEY=tu_clave python3 scripts/fetch_photos.py
```

Las búsquedas usan el nombre del producto. Revisa cada foto y reemplaza las que no correspondan con una tuya en `images/products/pNNN.jpg`. Revisa también la licencia de cada foto. Si un producto no tiene foto, la web muestra un ícono de su categoría.

## Probar en tu computador

Abrir `index.html` con doble clic no funciona con los módulos de JavaScript. Desde la carpeta del proyecto ejecuta:

```
python3 -m http.server 8000
```

y entra a `http://localhost:8000`.

## Seguridad

Todos los visitantes pueden ver el inventario, pero solo el correo de `ADMIN_EMAIL` puede modificarlo, porque así lo definen las reglas de Firestore. Las claves de `firebase-config.js` son públicas por diseño. La protección está en las reglas y en la contraseña del administrador, que no va en el código.
