# 🚀 CRYD - Sistema Gestor de Turnos

Sistema web para gestionar turnos, seguimiento horario y producción con roles de administrador y coordinador.

## ✨ Características

- ✅ **Gestión de Turnos**: Registro de inicio y cierre de turnos
- ✅ **Seguimiento Horario**: Registro de producción por hora
- ✅ **Dashboard Admin**: Visualización en tiempo real de métricas
- ✅ **Autenticación Segura**: Validación con contraseñas hasheadas
- ✅ **Sincronización en Tiempo Real**: Firestore para datos compartidos
- ✅ **Exportación a Excel**: Reportes diarios y acumulados
- ✅ **Auditoría**: Registro de todas las acciones

## 📋 Requisitos Previos

- Node.js 18.x o superior
- npm o yarn
- Cuenta de Google Cloud / Firebase
- Git

## 🏗️ Estructura del Proyecto

```
CRYD/
├── public/                      # Archivos estáticos (hosting)
│   └── index.html              # Tu CRYD.html (renombrado)
├── functions/                  # Cloud Functions
│   ├── index.js               # Funciones principales
│   └── package.json
├── firebase.json              # Configuración Firebase
├── firestore.rules            # Reglas de seguridad
├── seed-users.js              # Script para crear usuarios
├── seed-users.json.example    # Plantilla de usuarios
├── .gitignore                 # Archivos ignorados en Git
├── .env.example               # Variables de entorno
├── package.json               # Dependencias del proyecto
└── docs/                      # Documentación
```

## 🔧 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/CRYD.git
cd CRYD
```

### 2. Instalar Dependencias

```bash
npm install
cd functions
npm install
cd ..
```

### 3. Configurar Firebase

```bash
# Instalar Firebase CLI (si no lo has hecho)
npm install -g firebase-tools

# Autenticarse con Google
firebase login

# Inicializar el proyecto (si es nuevo)
firebase init
# Seleccionar opciones: Hosting, Functions, Firestore
# Seleccionar proyecto: cryd-production
```

### 4. Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar .env.local con tus valores
# ⚠️ IMPORTANTE: NUNCA subir .env.local a GitHub
```

### 5. Configurar Firestore Security Rules

Las reglas están en `firestore.rules`. Para deployarlas:

```bash
firebase deploy --only firestore:rules
```

**Nota**: Las reglas protegen:
- Los usuarios solo leen/escriben su propia data o (si son admin) toda la data
- Los coordinadores solo ven datos de su cuadrilla
- Los admins tienen acceso total

### 6. Deploy de Cloud Functions

```bash
# Deploy de funciones
firebase deploy --only functions

# Para ver logs en vivo
firebase functions:log
```

**Funciones disponibles:**
- `validateCredentials`: Validar login
- `syncData`: Sincronizar datos local ↔ Firestore
- `generateDailyReport`: Generar reportes
- `createUser`: Crear usuarios (admin only)
- `getTrendsSummary`: Obtener tendencias

## 👥 Crear Usuarios (Seed Users)

### Opción 1: Con Node.js (Backend)

```bash
# 1. Descargar key de servicio en Firebase Console
# Project Settings → Service Accounts → Generate Private Key

# 2. Crear seed-users.json (desde seed-users.json.example)
cp seed-users.json.example seed-users.json

# 3. Editar seed-users.json con tus usuarios:
{
  "users": [
    {
      "uid": "coordinador1",
      "email": "coord1@cryd.local",
      "password": "Password123!",
      "role": "coordinator",
      "cuadrilla": "cuadrilla-a"
    },
    {
      "uid": "admin1",
      "email": "admin@cryd.local",
      "password": "AdminPass123!",
      "role": "admin",
      "cuadrilla": "mixto"
    }
  ]
}

# 4. Configurar credenciales
$env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\ruta\a\service-account-key.json'  # Windows
# O en Mac/Linux:
export GOOGLE_APPLICATION_CREDENTIALS="/ruta/a/service-account-key.json"

# 5. Ejecutar seed
node seed-users.js
```

### Opción 2: A través de Firebase Console
1. Ir a Authentication → Users
2. Crear usuarios manualmente
3. Ir a Firestore → Crear documentos en colección `users`

## 🚀 Deploy a Firebase Hosting

### Opción A: Deploy Manual

```bash
# Preparar archivos públicos
cp CRYD.html public/index.html

# Deploy completo (hosting + functions + reglas)
firebase deploy

# O deploy selectivo
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
```

### Opción B: Deploy Automático (GitHub Actions)

Crear archivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install && cd functions && npm install && cd ..
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: cryd-production
          channelId: live
```

Para configurar GitHub Actions:
1. Ir a Firebase Console → Project Settings → Service Accounts
2. Crear una nueva clave de servicio
3. Ir a GitHub → Settings → Secrets → Crear secret `FIREBASE_SERVICE_ACCOUNT`

## 🧪 Probar Localmente

```bash
# Iniciar emuladores (local development)
npm run serve

# O si quieres solo funciones
firebase emulators:start --only functions

# O si quieres solo hosting
firebase serve --only hosting
```

Luego accede a:
- **App**: http://localhost:5000
- **Firestore Emulator**: http://localhost:8080
- **Functions Emulator**: http://localhost:5001

## 📊 Estructura de Datos Firestore

```
Firestore
├── users/
│   └── {userId}
│       ├── role: "admin" | "coordinator"
│       ├── cuadrilla: "cuadrilla-a" | "mixto" | ...
│       ├── email: string
│       ├── passwordHash: string
│       └── createdAt: timestamp
│
├── shifts/
│   └── {YYYY-MM-DD}/
│       └── cuadrillas/
│           └── {cuadrilla}
│               ├── coordinatorId: string
│               ├── attendance: {...}
│               ├── metaTurno: number
│               ├── extras: [...]
│               └── timestamp: timestamp
│
├── hourly/
│   └── {YYYY-MM-DD}/
│       └── cuadrillas/
│           └── {cuadrilla}
│               ├── entries: [{hour, cajas, coordinatorId, isLate}...]
│               └── lastSyncedAt: timestamp
│
├── logs/
│   └── {logId}
│       ├── userId: string
│       ├── action: string
│       ├── metadata: {...}
│       └── timestamp: timestamp
│
└── reports/
    └── {reportId}
        ├── date: string
        ├── generatedBy: string
        ├── summary: {...}
        └── totals: {...}
```

## 🔐 Seguridad

### Reglas Firestore
- ✅ Autenticación requerida para todas las operaciones
- ✅ Coordinadores solo ven su cuadrilla
- ✅ Admins tienen acceso total
- ✅ Auditoría de todas las acciones

### Cloud Functions
- ✅ Validación de entrada
- ✅ Verificación de roles y permisos
- ✅ Hash de contraseñas con bcrypt
- ✅ Custom tokens de Firebase

### .env.local (⚠️ NUNCA en Git)
```
FIREBASE_API_KEY=AIzaSyCSjJjaDkiDFLCYqr3uP1fKW5H3HCnTmKg
FIREBASE_AUTH_DOMAIN=cryd-production.firebaseapp.com
FIREBASE_PROJECT_ID=cryd-production
FIREBASE_STORAGE_BUCKET=cryd-production.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=194421485008
FIREBASE_APP_ID=1:194421485008:web:bc3b89cd9a4550a5759dd5
```

## 📝 Uso de la Aplicación

### Para Coordinadores

1. **Login**: Ingresa tu ID y contraseña
2. **Inicio de Turno**: Registra asistencia
3. **Seguimiento Horario**: Registra cajas por hora
4. **Ver Progreso**: Visualiza avance hacia la meta

### Para Administradores

1. **Dashboard**: Vista en tiempo real de todos los turnos
2. **Reportes**: Genera reportes diarios/acumulados
3. **Configuración**: Ajusta metas y personal
4. **Usuarios**: Crea y gestiona coordinadores

## 🐛 Solución de Problemas

### Error: "Permission denied" en Firestore
→ Verifica que las Security Rules están deployadas: `firebase deploy --only firestore:rules`

### Error: "User not found" en login
→ Crea el usuario con `node seed-users.js` o en Firebase Console

### Error: "Cloud Functions not available"
→ Deploy las funciones: `firebase deploy --only functions`

### Datos no sincronizados
→ Verifica conexión a internet y que las reglas Firestore lo permiten

## 📞 Soporte

Para reportar problemas o sugerencias, abre un issue en GitHub.

## 📄 Licencia

Este proyecto está bajo licencia MIT.

---

**Última actualización**: Diciembre 2025
**Versión**: 1.0.0
