# 🚀 INICIO RÁPIDO - QUÉ HACER AHORA

## ⏱️ 15 MINUTOS PARA TENER TU APP EN VIVO

### PASO 1: Copiar archivo HTML (1 min)

```bash
# Abre PowerShell en tu carpeta CRYD
cd c:\Users\jl1fa1\OneDrive\ -\ DPDHL\Desktop\CRYD

# Copia tu CRYD.html a public/index.html
copy CRYD.html public\index.html

# Verifica que se creó
dir public
# Deberías ver: index.html
```

### PASO 2: Instalar herramientas (5 min)

```bash
# Instalar Firebase CLI globalmente
npm install -g firebase-tools

# Verifica instalación
firebase --version

# Si funciona → Continúa
# Si no → Abre nueva terminal PowerShell
```

### PASO 3: Autenticarse (2 min)

```bash
# Login en Firebase
firebase login

# Se abre navegador
# → Selecciona tu cuenta Google
# → Click PERMITIR
# Espera a que termine en terminal
```

### PASO 4: Instalar dependencias (3 min)

```bash
# En tu carpeta CRYD
npm install

# Espera a que termine (~2 min)
```

### PASO 5: Deploy (5 min)

**OPCIÓN A: Deploy todo de una vez (RECOMENDADO)**

```bash
firebase deploy

# Espera a que termine...
# Verás mensajes como:
# ✔ firestore:rules
# ✔ functions
# ✔ hosting

# Al final verás URL:
# Hosting URL: https://cryd-production.web.app
```

**OPCIÓN B: Deploy por partes (si algo falla)**

```bash
# Primero: Seguridad
firebase deploy --only firestore:rules

# Segundo: Funciones
firebase deploy --only functions

# Tercero: App
firebase deploy --only hosting
```

### PASO 6: Probar en navegador (1 min)

Abre en navegador:

```
https://cryd-production.web.app
```

Deberías ver:
- ✅ "Sistema Gestor" como título
- ✅ Selector de "Coordinador" / "Administrador"
- ✅ Campo "ID de Usuario"
- ✅ Campo "Contraseña"

---

## 👥 CREAR USUARIOS (PASOS 7-8)

### OPCIÓN A: A través de Firebase Console (FÁCIL)

1. Abre: https://console.firebase.google.com
2. Selecciona proyecto: `cryd-production`
3. Ve a: **Authentication** (en menú izquierdo)
4. Click **Create user** (botón arriba)
5. Completa:
   - Email: `coordinador_a@cryd.local`
   - Password: `Password123!`
   - Click **Create user**

Repite para crear más usuarios:
- coordinador_b (cuadrilla-b)
- coordinador_c (cuadrilla-c)
- admin_principal (admin)

Luego necesitas crear documentos en Firestore:
1. Ve a **Firestore** en menú
2. Click **Create collection**
3. Collection ID: `users`
4. Document ID: `coordinador_a`
5. Agrega campos:
   ```
   role: "coordinator"
   cuadrilla: "cuadrilla-a"
   email: "coordinador_a@cryd.local"
   passwordHash: "(generar con bcrypt)"
   createdAt: (timestamp actual)
   ```

### OPCIÓN B: Automático con script (RECOMENDADO)

```bash
# 1. Descargar service account key
#    - Firebase Console → Configuración (⚙️)
#    - Service Accounts
#    - Click "Generate new private key"
#    - Se descarga archivo JSON
#    - Guardar en tu escritorio

# 2. Copiar template de usuarios
copy seed-users.json.example seed-users.json

# 3. Ejecutar script
set GOOGLE_APPLICATION_CREDENTIALS="C:\ruta\a\tu\service-account-key.json"
node seed-users.js

# 4. Deberías ver:
# ✅ Documento users/coordinador_a creado/actualizado en Firestore
# ✅ Auth user coordinador_a ya existe
# ✅ Claims seteadas para coordinador_a: role=coordinator
```

---

## ✅ PROBAR LOGIN

En https://cryd-production.web.app:

```
Tipo: Coordinador (selecciona en botón)
ID de Usuario: coordinador_a
Contraseña: Password123!
Click: Ingresar al Sistema
```

Si funciona → Ves formulario de "Inicio de Turno" ✅

Si no funciona → Ver sección "SOLUCIONAR PROBLEMAS"

---

## 🎯 AHORA PUEDES:

### ✅ Compartir el link con coordinadores

```
https://cryd-production.web.app
```

Dales:
- ID de usuario
- Contraseña
- Instrucciones de uso

Ellos pueden:
- Registrar turnos
- Registrar producción por hora
- Ver progreso

### ✅ Acceder como admin

```
Tipo: Administrador
ID: admin_principal
Contraseña: AdminPass123!
```

Tú ves:
- Dashboard en tiempo real
- Resúmenes de todas las cuadrillas
- Exportar a Excel
- Configurar metas

---

## ❌ SOLUCIONAR PROBLEMAS

### Error: "Command not found: firebase"

```bash
# Opción A: Instalar globalmente
npm install -g firebase-tools

# Opción B: Sin instalación global
npm install firebase-tools --save-dev
npx firebase deploy
```

### Error: "Permission denied" en login

→ Las Security Rules no están deployadas

```bash
firebase deploy --only firestore:rules
```

### Error: "User not found"

→ Crea el usuario en Firebase Console o ejecuta seed-users.js

### Error: "index.html not found"

```bash
# Verifica que existe
dir public\index.html

# Si no existe, cópialo
copy CRYD.html public\index.html

# Re-deploy
firebase deploy --only hosting
```

### Error: "Cannot find module 'firebase-admin'"

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

---

## 🔄 DESDE AHORA EN ADELANTE

Cada vez que hagas cambios:

```bash
# 1. Edita tus archivos
# 2. En terminal:
firebase deploy

# 3. Tu cambio está LIVE en 5 minutos
```

---

## 📚 DOCUMENTACIÓN COMPLETA

Si necesitas más detalles:

- **README.md** - Guía completa
- **docs/DEPLOY_GUIDE.md** - Deploy paso a paso
- **docs/TECHNICAL.md** - Arquitectura técnica
- **docs/GITHUB_SETUP.md** - GitHub + Auto-deploy

---

## 🎉 LISTO

Con esto ya tienes:

✅ App deployada en Firebase Hosting
✅ Autenticación segura
✅ Cloud Functions funcionando
✅ Firestore con Security Rules
✅ Link para compartir con coordinadores

**¿Preguntas o problemas?** Lee la documentación o ejecuta:

```bash
firebase deploy --debug
```

Para ver detalles del error.

---

**Actualizado**: Diciembre 2025
**Versión**: 1.0.0
