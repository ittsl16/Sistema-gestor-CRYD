# 📚 Documentación Técnica - CRYD

## 🏗️ Arquitectura del Sistema

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

## 🔐 Flujo de Autenticación

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

## 📊 Flujo de Datos

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

## 🛡️ Security Rules - Explicación

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

## 🔧 Cloud Functions Detalladas

### 1. validateCredentials

```javascript
Entrada: { userId, password, userType }
         - userId: string (ej: "coordinador_a")
         - password: string
         - userType: "admin" | "coordinator"

Salida: {
  valid: boolean,
  message: string,
  token: string,
  userRole: "admin" | "coordinator",
  cuadrilla: string
}
```

**Lógica:**
1. Buscar usuario en Firestore
2. Comparar contraseña con bcrypt
3. Generar custom token
4. Log de auditoría

### 2. syncData

```javascript
Entrada: { date, shiftData, hourlyData }
         - date: "2025-12-02"
         - shiftData: { coordinatorId, attendance, ... }
         - hourlyData: [{ hour, cajas, ... }]

Salida: {
  success: boolean,
  message: string,
  syncedAt: timestamp
}
```

**Validaciones:**
- Usuario debe estar autenticado
- Usuario debe ser coordinador
- Datos deben pertenecer a su cuadrilla

### 3. generateDailyReport

```javascript
Entrada: { date }
         - date: "2025-12-02"

Salida: {
  success: boolean,
  reportId: string,
  summary: {
    date: string,
    totals: { production, attendance },
    summary: { cuadrilla: { attendance, production, ... } }
  }
}
```

**Solo admin** puede generar reportes.

### 4. createUser

```javascript
Entrada: { userId, email, password, role, cuadrilla }

Salida: {
  success: boolean,
  userId: string,
  role: "admin" | "coordinator",
  cuadrilla: string
}
```

**Acciones:**
- Crea documento en Firestore → users/{userId}
- Crea usuario en Firebase Auth
- Hash la contraseña con bcrypt
- Asigna custom claims

### 5. getTrendsSummary

```javascript
Entrada: { startDate, endDate }
         - startDate: "2025-11-01"
         - endDate: "2025-12-02"

Salida: {
  success: boolean,
  trends: {
    dateRange: { startDate, endDate },
    totalDays: number,
    averageProduction: number,
    averageAttendance: number,
    dailyData: [{ date, production, attendance }]
  }
}
```

## 💾 Estructura de Documentos Firestore

### users/{userId}

```json
{
  "email": "coordinador@cryd.local",
  "role": "coordinator",
  "cuadrilla": "cuadrilla-a",
  "passwordHash": "$2a$10$...",
  "createdAt": "2025-12-02T10:30:00Z",
  "createdBy": "admin_principal"
}
```

### shifts/{date}/cuadrillas/{cuadrilla}

```json
{
  "coordinatorId": "coordinador_a",
  "attendance": {
    "montas": 5,
    "alm": 3,
    "auditores": 2,
    "auxiliares": 1,
    "analistas": 0
  },
  "metaTurno": 3000,
  "extras": [
    {
      "name": "Juan Pérez",
      "role": "montacarguistas",
      "hours": 2,
      "startHour": "06:00"
    }
  ],
  "comentarios": "Todo normal",
  "timestamp": "2025-12-02T06:30:00Z",
  "lastSyncedAt": "2025-12-02T06:35:00Z"
}
```

### hourly/{date}/cuadrillas/{cuadrilla}

```json
{
  "entries": [
    {
      "hour": "06",
      "cajas": 450,
      "coordinatorId": "coordinador_a",
      "timestamp": "2025-12-02T06:59:00Z",
      "isLate": false
    },
    {
      "hour": "07",
      "cajas": 420,
      "coordinatorId": "coordinador_a",
      "timestamp": "2025-12-02T08:05:00Z",
      "isLate": true
    }
  ],
  "lastSyncedAt": "2025-12-02T08:10:00Z"
}
```

### logs/{logId}

```json
{
  "userId": "coordinador_a",
  "action": "DATA_SYNCED",
  "metadata": {
    "date": "2025-12-02",
    "cuadrilla": "cuadrilla-a"
  },
  "timestamp": "2025-12-02T06:35:00Z",
  "ip": "192.168.1.100"
}
```

### reports/{reportId}

```json
{
  "date": "2025-12-02",
  "generatedAt": "2025-12-02T18:00:00Z",
  "generatedBy": "admin_principal",
  "summary": {
    "cuadrilla-a": {
      "production": 3150,
      "attendance": { "montas": 5, ... },
      "attendance_total": 11
    }
  },
  "totals": {
    "production": 12500,
    "attendance": 44
  }
}
```

## 🚀 Deployment Checklist

- [ ] Cloud Functions deployadas: `firebase deploy --only functions`
- [ ] Firestore Rules deployadas: `firebase deploy --only firestore:rules`
- [ ] Firestore Indexes creados: `firebase deploy --only firestore:indexes`
- [ ] index.html en public/: `cp CRYD.html public/index.html`
- [ ] .env.local configurado (no en GitHub)
- [ ] seed-users.json creado y usuarios seededeados: `node seed-users.js`
- [ ] Firebase Hosting configurado: `firebase deploy --only hosting`
- [ ] Verificar en: https://cryd-production.web.app

## 🧪 Testing Local

```bash
# Iniciar emuladores
firebase emulators:start

# En otra terminal, testear Cloud Function
firebase functions:shell
> validateCredentials({userId: 'coordinador_a', password: 'Password123!', userType: 'coordinator'})
```

## 📈 Monitoring y Logs

```bash
# Ver logs en tiempo real
firebase functions:log

# Ver logs en Firebase Console
# → Firebase Console → Functions → Logs

# Ver auditoría
# → Firestore → logs (solo admins)
```

## 🔄 CI/CD con GitHub Actions

Ver archivo `.github/workflows/deploy.yml` para deployment automático en cada push a main.

---

**Última actualización**: Diciembre 2025
