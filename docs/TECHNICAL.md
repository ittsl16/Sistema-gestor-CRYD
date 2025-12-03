#  Documentación Técnica - CRYD
##  Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (Frontend)                        │
│              CRYD.html - Single Page Application             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Login → Coordinador/Admin → Uso de funcionalidades │   │
│  │         (Data almacenada en localStorage + Firestore)│   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────┬──────────────────────────────────────────┘
                  │
                  │ HTTPS / WebSocket
                  │
┌─────────────────┴──────────────────────────────────────────┐
│              FIREBASE (Backend-as-a-Service)                │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Cloud Functions (Node.js)                          │    │
│  │  • validateCredentials                             │    │
│  │  • syncData                                        │    │
│  │  • generateDailyReport                             │    │
│  │  • createUser                                      │    │
│  │  • getTrendsSummary                                │    │
│  └────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Firestore Database                                 │    │
│  │  • users/ → Coordinadores y admins                 │    │
│  │  • shifts/ → Datos de turnos                       │    │
│  │  • hourly/ → Registros por hora                    │    │
│  │  • logs/ → Auditoría                               │    │
│  │  • reports/ → Reportes generados                   │    │
│  └────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Authentication                                     │    │
│  │  • Firebase Auth + Custom tokens                   │    │
│  │  • Security Rules (RLS)                            │    │
│  └────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Firebase Hosting                                   │    │
│  │  • Sirve la aplicación (public/index.html)         │    │
│  │  • CDN global                                      │    │
│  │  • Certificados SSL/TLS automáticos                │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

##  Flujo de Autenticación

```
1. Usuario ingresa ID y contraseña
   ↓
2. Frontend llama Cloud Function: validateCredentials(userId, password)
   ↓
3. Cloud Function:
   - Busca usuario en Firestore
   - Compara contraseña con hash (bcrypt)
   - Si es válido → Genera custom token Firebase
   ↓
4. Frontend recibe custom token
   ↓
5. Frontend autentica con Firebase usando el token
   ↓
6. Firebase Auth valida el token
   ↓
7. Usuario logueado → Puede acceder a datos según Security Rules
```

## Flujo de Datos

### Coordinador registra turno:

```
1. Coordinador llena formulario de inicio de turno
   └─ Asistencia, meta ajustada, personal extra
   
2. Frontend guarda en localStorage
   └─ Persistencia local offline
   
3. Cuando hay conexión → Cloud Function: syncData()
   └─ Valida que es el coordinador de esa cuadrilla
   └─ Guarda en Firestore
   
4. Admin ve datos en tiempo real (Live listeners)
   └─ Firebase onSnapshot() actualiza dashboard
```

### Admin visualiza reporte:

```
1. Admin abre Dashboard
   
2. Firestore Listeners activos:
   └─ collection('shifts').doc(today).onSnapshot()
   └─ collection('hourly').doc(today).onSnapshot()
   
3. Datos se actualizan en tiempo real
   
4. Admin puede exportar:
   └─ Excel diario
   └─ Backup completo
   └─ Archivo acumulado
```

##  Security Rules - Explicación

### Colección: users

```javascript
// Solo lees tu documento o eres admin
allow read: if request.auth.uid == userId || isAdmin();

// Solo admins pueden crear/actualizar
allow write: if isAdmin();
```

**Caso de uso:**
- Coordinador A solo ve su perfil
- Admin ve todos los perfiles

### Colección: shifts/{date}/cuadrillas/{cuadrilla}

```javascript
// Coordinador solo escribe su cuadrilla
allow write: if isCoordinator() && isSameCuadrilla(cuadrilla);
```

**Caso de uso:**
- Coordinador A escribe en shifts/{date}/cuadrillas/cuadrilla-a
- Coordinador A NO puede escribir en shifts/{date}/cuadrillas/cuadrilla-b
- Admin puede escribir en cualquiera

##  Cloud Functions Detalladas

**Lógica:**
1. Buscar usuario en Firestore
2. Comparar contraseña con bcrypt
3. Generar custom token
4. Log de auditoría


**Validaciones:**
- Usuario debe estar autenticado
- Usuario debe ser coordinador
- Datos deben pertenecer a su cuadrilla


**Acciones:**
- Crea documento en Firestore → users/{userId}
- Crea usuario en Firebase Auth
- Hash la contraseña con bcrypt
- Asigna custom claims


##  Deployment Checklist

- [ ] Cloud Functions deployadas: `firebase deploy --only functions`
- [ ] Firestore Rules deployadas: `firebase deploy --only firestore:rules`
- [ ] Firestore Indexes creados: `firebase deploy --only firestore:indexes`
- [ ] index.html en public/: `cp CRYD.html public/index.html`
- [ ] .env.local configurado (no en GitHub)
- [ ] seed-users.json creado y usuarios seededeados: `node seed-users.js`
- [ ] Firebase Hosting configurado: `firebase deploy --only hosting`
- [ ] Verificar en: https://cryd-production.web.app


**Última actualización**: Diciembre 2025
