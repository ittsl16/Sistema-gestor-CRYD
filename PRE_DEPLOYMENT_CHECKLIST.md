# ✅ CHECKLIST PRE-DEPLOYMENT

Antes de ejecutar `firebase deploy`, verifica que todo está listo:

## 📁 ARCHIVOS Y CARPETAS

- [ ] `CRYD.html` existe en la carpeta CRYD
- [ ] Carpeta `public/` existe
- [ ] Carpeta `functions/` existe
- [ ] Carpeta `docs/` existe
- [ ] `.github/workflows/` existe
- [ ] `firestore.rules` existe
- [ ] `firebase.json` existe
- [ ] `.firebaserc` existe
- [ ] `.gitignore` existe
- [ ] `package.json` (principal) existe
- [ ] `functions/package.json` existe
- [ ] `functions/index.js` existe
- [ ] `seed-users.json` existe (contiene 5 usuarios)

## 🔧 INSTALACIONES

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Firebase CLI instalado (`firebase --version`)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Dependencias de functions instaladas (`cd functions && npm install`)

## 🔐 AUTENTICACIÓN

- [ ] Ejecutaste `firebase login`
- [ ] Viste "Success! Logged in as..." en terminal
- [ ] Tu cuenta Google tiene acceso a proyecto Firebase

## 📦 PROYECTO FIREBASE

- [ ] Proyecto `cryd-production` existe en Firebase Console
- [ ] Firestore está habilitado
- [ ] Authentication está habilitado
- [ ] Cloud Functions está habilitado
- [ ] Hosting está habilitado
- [ ] Cloud Storage está habilitado

## 📝 CONTENIDO

- [ ] `seed-users.json` tiene 5 usuarios
  ```json
  [
    { "uid": "coordinador_a", "role": "coordinator", "cuadrilla": "cuadrilla-a" },
    { "uid": "coordinador_b", "role": "coordinator", "cuadrilla": "cuadrilla-b" },
    { "uid": "coordinador_c", "role": "coordinator", "cuadrilla": "cuadrilla-c" },
    { "uid": "coordinador_mixto", "role": "coordinator", "cuadrilla": "mixto" },
    { "uid": "admin_principal", "role": "admin", "cuadrilla": "mixto" }
  ]
  ```

- [ ] `firestore.rules` no está vacío
- [ ] `functions/index.js` tiene mínimo 5 funciones
- [ ] `firebase.json` apunta a proyecto `cryd-production`
- [ ] `.firebaserc` tiene `cryd-production` como default

## 🚀 DEPLOYMENT

- [ ] Abriste terminal en carpeta CRYD
- [ ] Estás en rama `main` (si usas git): `git branch`
- [ ] Todos los cambios están commiteados (si usas git): `git status`
- [ ] Tienes conexión a internet ✅

## ✨ ARCHIVO HTML

- [ ] Copiaste CRYD.html a public/index.html
  ```bash
  copy CRYD.html public\index.html
  ```

---

## 🎯 ORDEN DE DEPLOYMENT RECOMENDADO

```bash
# 1. Deploy Security Rules (crítico)
firebase deploy --only firestore:rules

# 2. Deploy Cloud Functions
firebase deploy --only functions

# 3. Deploy Hosting
firebase deploy --only hosting

# O todo de una vez:
firebase deploy
```

---

## ⏱️ TIEMPO ESTIMADO

- Security Rules: 1-2 minutos
- Cloud Functions: 3-5 minutos
- Hosting: 1-2 minutos
- **Total: 5-10 minutos**

---

## ✅ VERIFICACIÓN POST-DEPLOY

- [ ] Ver URL: https://cryd-production.web.app
- [ ] Aparece pantalla de login ✅
- [ ] Selector "Coordinador" / "Administrador" funciona
- [ ] Puedes ingresar ID y contraseña
- [ ] Click "Ingresar" → Sin errores

---

## 🆘 SI FALLA ALGO

**Error: "Permission denied"**
```bash
firebase deploy --only firestore:rules --debug
```

**Error: "Function deployment failed"**
```bash
cd functions
npm install
cd ..
firebase deploy --only functions --debug
```

**Error: "index.html not found"**
```bash
copy CRYD.html public\index.html
firebase deploy --only hosting --debug
```

---

## 📞 CONTACTO

Si hay problemas después del deploy:
- Ver logs: `firebase functions:log`
- Ver detalles: `firebase deploy --debug`
- Firebase Console: https://console.firebase.google.com

---

**IMPORTANTE**: ✅ Verifica todos los checkboxes antes de proceder con deployment

**Fecha**: 2 de Diciembre de 2025
