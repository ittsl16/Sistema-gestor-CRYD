#  Estructura Completa del Proyecto

```
CRYD/
│
├── 📄 README.md                         ← INSTRUCCIONES PRINCIPALES
├── 📄 package.json                      ← Dependencias del proyecto
├── 📄 firebase.json                     ← Configuración Firebase
├── 📄 .firebaserc                       ← Proyecto Firebase
├── 📄 .gitignore                        ← Archivos ignorados en Git
├── 📄 .env.example                      ← Variables de entorno (template)
│
├── 🔐 firestore.rules                   ← SECURITY RULES (crítico)
├── 📊 firestore.indexes.json            ← Índices de Firestore
│
├── 📁 public/                           ← FIREBASE HOSTING
│   └── index.html                       ← Tu CRYD.html (copiado aquí)
│
├── ⚡ functions/                        ← CLOUD FUNCTIONS
│   ├── index.js                         ← Todas las funciones
│   ├── package.json                     ← Dependencias de functions
│   └── .env.example                     ← Variables (template)
│
├── 📚 docs/                             ← DOCUMENTACIÓN
│   ├── TECHNICAL.md                     ← Arquitectura y detalles técnicos
│
├── 🔧 seed-users.js                     ← Script para crear usuarios
├── 📋 seed-users.json.example           ← Template de usuarios
├── 🔑 seed-users.json                   ← NUNCA subir a Git
│
└── 🐙 .github/
    └── workflows/
        └── deploy.yml                   ← GitHub Actions (auto-deploy)
```



##  URLs de Recursos

- **App en vivo**: https://cryd-production.web.app
- **Firebase Console**: https://console.firebase.google.com/project/cryd-production
- **Cloud Functions**: Firebase Console → Functions
- **Firestore**: Firebase Console → Firestore

**Última actualización**: Diciembre 2025
