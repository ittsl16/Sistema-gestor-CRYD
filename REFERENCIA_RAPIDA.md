# ⚡ REFERENCIA RÁPIDA

## 🎯 EN 20 MINUTOS A PRODUCCIÓN

```bash
# 1. Preparar (1 min)
copy CRYD.html public\index.html

# 2. Instalar (5 min)
npm install
cd functions && npm install && cd ..

# 3. Conectar (1 min)
firebase login

# 4. Deploy (10 min)
firebase deploy

# 5. Usuarios (2 min)
node seed-users.js

# 6. Verificar (1 min)
# Abre: https://cryd-production.web.app
# Prueba login con coordinador_a / CoordA2025!Secure
```

---

## 👥 USUARIOS (Copiar y Pegar)

### Coordinador A
- **ID**: coordinador_a
- **Pass**: CoordA2025!Secure

### Coordinador B
- **ID**: coordinador_b
- **Pass**: CoordB2025!Secure

### Coordinador C
- **ID**: coordinador_c
- **Pass**: CoordC2025!Secure

### Coordinador Mixto
- **ID**: coordinador_mixto
- **Pass**: CoordMixto2025!

### Admin
- **ID**: admin_principal
- **Pass**: AdminCRYD2025!Prod

---

## 🔗 LINKS

- **App**: https://cryd-production.web.app
- **Firebase Console**: https://console.firebase.google.com/project/cryd-production
- **Documentación**: Carpeta `docs/`
- **GitHub**: Tu repositorio

---

## 📋 COMANDOS RÁPIDOS

```bash
# Deploy completo
firebase deploy

# Deploy solo Firestore Rules
firebase deploy --only firestore:rules

# Deploy solo Cloud Functions
firebase deploy --only functions

# Deploy solo Hosting
firebase deploy --only hosting

# Ver logs
firebase functions:log

# Crear usuarios
node seed-users.js

# Probar localmente
firebase emulators:start

# Debug
firebase deploy --debug
```

---

## 📂 ARCHIVOS IMPORTANTES

- `00_LEEME_PRIMERO.md` ← EMPIEZA AQUÍ
- `INICIO_AQUI.md` ← 5 pasos
- `QUICK_START.md` ← 15 min
- `CREDENTIALS.md` ← Usuarios
- `firestore.rules` ← Seguridad
- `functions/index.js` ← Funciones
- `firebase.json` ← Config

---

## ⚙️ CONFIGURACIÓN

**Firebase Project**: cryd-production
**Hosting**: https://cryd-production.web.app
**Database**: Firestore
**Authentication**: Firebase Auth + Custom tokens

---

## 🚨 SOLUCIÓN RÁPIDA DE PROBLEMAS

**Error "Permission denied"**
```bash
firebase deploy --only firestore:rules
```

**Error "Function not available"**
```bash
cd functions && npm install && cd ..
firebase deploy --only functions
```

**Error "index.html not found"**
```bash
copy CRYD.html public\index.html
firebase deploy --only hosting
```

**No puedo hacer login**
```bash
node seed-users.js
```

---

## ✅ CHECKLIST MÍNIMO

- [ ] Copié CRYD.html a public/index.html
- [ ] Instalé dependencias (npm install)
- [ ] Ejecuté firebase login
- [ ] Ejecuté firebase deploy
- [ ] Ejecuté node seed-users.js
- [ ] Probé login en https://cryd-production.web.app
- [ ] ¡LISTO!

---

## 📞 AYUDA

Si necesitas ayuda, busca en:
1. `00_LEEME_PRIMERO.md`
2. `QUICK_START.md`
3. `docs/DEPLOY_GUIDE.md`
4. `PRE_DEPLOYMENT_CHECKLIST.md`

---

**Proyecto**: CRYD v1.0.0
**URL**: https://cryd-production.web.app
**Usuarios**: 5 (4 coord + 1 admin)
**Tiempo**: 20 min a producción
