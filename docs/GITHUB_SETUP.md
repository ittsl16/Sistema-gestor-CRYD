# 🔗 GitHub + Firebase Setup

## Pasos para Publicar en GitHub

### 1. Crear Repositorio en GitHub

```bash
# Ir a https://github.com/new
# Crear repositorio: CRYD
# NO inicializar con README (ya lo tienes)
# Copiar la URL: https://github.com/tu-usuario/CRYD.git
```

### 2. Inicializar Git Localmente

```bash
cd c:\Users\jl1fa1\OneDrive\ -\ DPDHL\Desktop\CRYD

# Inicializar git
git init

# Configurar usuario (local)
git config user.email "tu@email.com"
git config user.name "Tu Nombre"

# Agregar remoto
git remote add origin https://github.com/tu-usuario/CRYD.git

# Renombrar rama a main (si es necesario)
git branch -M main
```

### 3. Agregar Archivos a Git

```bash
# Ver qué archivos se van a agregar
git status

# Agregar todos los archivos (respetando .gitignore)
git add .

# Verificar que no incluye archivos sensibles
git status
# Debe EXCLUIR:
# - .env.local ✅
# - seed-users.json ✅
# - service-account-key.json ✅
# - functions/node_modules ✅
```

### 4. Primer Commit

```bash
git commit -m "Initial commit: CRYD Sistema Gestor v1.0.0"

# Hacer push
git push -u origin main
```

### 5. Verificar en GitHub

Abre: https://github.com/tu-usuario/CRYD

Debes ver:
- ✅ README.md
- ✅ Carpetas: public/, functions/, docs/
- ✅ firestore.rules
- ✅ firebase.json
- ✅ .gitignore

---

## Configurar Secrets de GitHub (para Auto-Deploy)

### Paso 1: Generar Firebase Token

```bash
# Login en Firebase
firebase login:ci

# Se abre navegador, autoriza
# Copia el token que aparece en terminal
# Token: 1//0gkk...
```

### Paso 2: Generar Service Account Key

1. Firebase Console → Project Settings (⚙️)
2. Service Accounts
3. Generate New Private Key
4. Descarga el JSON
5. Abre el JSON y cópia todo el contenido

### Paso 3: Agregar Secrets en GitHub

```
GitHub → Settings → Secrets and variables → Actions
```

Agregar:

**Secret 1: FIREBASE_TOKEN**
- Name: `FIREBASE_TOKEN`
- Value: `1//0gkk...` (el token que copiaste)
- Click: Add secret

**Secret 2: FIREBASE_SERVICE_ACCOUNT_CRYD_PRODUCTION**
- Name: `FIREBASE_SERVICE_ACCOUNT_CRYD_PRODUCTION`
- Value: (Todo el contenido del JSON de service account)
- Click: Add secret

---

## Probando Auto-Deploy

### Opción A: Trigger Manual

```bash
# Hacer cambio y push
echo "# Update" >> README.md
git add .
git commit -m "Test deployment"
git push

# GitHub Actions automáticamente ejecutará deploy
# Ver en: GitHub → Actions → Deploy to Firebase
```

### Opción B: Ejecutar Workflow Manualmente

```
GitHub → Actions → Deploy to Firebase → Run workflow
```

---

## 🎯 Resultado Final

Cuando el deploy automático funciona:

1. Haces `git push` a main
2. GitHub Actions automáticamente:
   - ✅ Deploy Hosting (index.html)
   - ✅ Deploy Cloud Functions
   - ✅ Deploy Firestore Rules
3. 5 minutos después → App actualizada en https://cryd-production.web.app

---

## ⚠️ Errores Comunes en CI/CD

### Error: "Service account not found"

→ El secret `FIREBASE_SERVICE_ACCOUNT_CRYD_PRODUCTION` está mal

**Solución:**
```bash
# Re-descargar service account en Firebase Console
# Copiar TODO el contenido JSON (incluyendo { })
# Re-crear el secret en GitHub
```

### Error: "Firebase token expired"

→ El token de `firebase login:ci` expiró

**Solución:**
```bash
firebase login:ci
# Generar nuevo token
# Actualizar secret FIREBASE_TOKEN en GitHub
```

### Error: "functions/node_modules missing"

→ Las dependencias no se instalaron

**Solución:**
```bash
# El workflow ya ejecuta "npm install" en functions/
# Pero verifica que package.json existe
ls functions/package.json
```

---

## 📊 Monitorear Deployments

```
GitHub → Actions
```

Aquí ves:
- ✅ Deploy exitosos (verde)
- ❌ Deploy fallidos (rojo)
- ⏱️ Tiempo de deployment

Haz clic en cualquier deployment para ver logs.

---

## 🔄 Workflow de Desarrollo

```
1. Clonas repo localmente
   git clone https://github.com/tu-usuario/CRYD.git

2. Haces cambios en tu máquina
   - Editas archivos
   - Pruebas localmente

3. Commiteás cambios
   git add .
   git commit -m "Descripción del cambio"

4. Haces push
   git push

5. GitHub Actions automáticamente:
   - Descarga código
   - Instala dependencias
   - Corre tests (opcional)
   - Deploy a Firebase

6. Tu cambio está LIVE en 5-10 minutos
```

---

## 🌳 Ramas (Branches)

### main (Producción)

```bash
# Cambios a main automáticamente se deployan
git push origin main
# → Deploy a https://cryd-production.web.app
```

### develop (Staging)

```bash
# Para testear cambios antes de ir a producción
git checkout develop
git push origin develop
# → Deploy a https://cryd-production--develop.web.app
```

---

## 📝 Agregar Colaboradores

1. GitHub → Settings → Collaborators
2. Invite people
3. Selecciona usuario
4. Elige permisos (Maintainer, Developer, etc)

---

**Última actualización**: Diciembre 2025
