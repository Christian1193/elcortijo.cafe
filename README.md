# Cortijo — Cafeterías & Cervezerías
## Web frontend — Guía de despliegue

### Archivos del proyecto
```
cortijo/
├── index.html   ← Toda la app (4 páginas SPA)
├── styles.css   ← Estilos minimalistas
├── app.js       ← Navegación, animaciones, formulario
└── README.md    ← Esta guía
```

---

### PASO 1 — Subir a GitHub

1. Crea un repositorio en github.com llamado `cafeteria-cortijo` (público o privado).
2. Sube los 3 archivos (`index.html`, `styles.css`, `app.js`).
3. Confirma que los ves en la rama `main`.

---

### PASO 2 — Desplegar en Vercel (gratis, 1 minuto)

1. Entra en [vercel.com](https://vercel.com) → **Sign Up with GitHub**.
2. Panel → **Add New… → Project**.
3. Importa `cafeteria-cortijo`.
4. Configuración: deja todo por defecto (es HTML/CSS/JS puro).
5. Clic en **Deploy**.

✅ En menos de un minuto tendrás una URL tipo:
`https://cafeteria-cortijo.vercel.app`

Cada vez que subas un cambio a GitHub, Vercel actualiza la web automáticamente.

---

### PASO 3 — Backend (cuando lo necesites)

El formulario de contacto actualmente simula el envío.  
Cuando tengas tu API Java lista:

1. Sube tu proyecto Spring Boot a `cafeteria-backend` en GitHub.
2. En Render.com → **New Web Service** → importa el repositorio.
3. Render detectará Maven/Gradle y compilará el `.jar`.
4. Obtendrás una URL tipo `https://cafeteria-api.onrender.com`.

Luego en `app.js`, reemplaza la línea de simulación:
```js
// Simulación actual:
await new Promise(r => setTimeout(r, 900));

// Reemplazar por:
const res = await fetch('https://cafeteria-api.onrender.com/contacto', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nombre, email, mensaje })
});
```

---

### Base de datos MySQL — Railway

1. Entra en [railway.app](https://railway.app) → **New Project → Provision MySQL**.
2. Copia las credenciales (`MYSQLHOST`, `MYSQLUSER`, etc.).
3. Úsalas en tu `application.properties` de Spring Boot.

---

### Funcionalidades del frontend

- ✅ 4 páginas: Inicio, Carta, Nosotros, Contacto
- ✅ Navegación SPA sin recarga (animación suave entre páginas)
- ✅ Carta completa con 13 categorías y filtro por pestañas
- ✅ Información de alérgenos según Reglamento (EU) 1169/2011
- ✅ Formulario de contacto con validación
- ✅ Diseño responsive (móvil + desktop)
- ✅ Menú hamburguesa en móvil
- ✅ Animaciones de entrada al hacer scroll
- ✅ Efecto parallax en el logo de la home
- ✅ Sin dependencias externas (solo Google Fonts)
