# CRYD - Sistema Gestor de Turnos

Sistema web para gestionar turnos, seguimiento horario y producción con roles de administrador y coordinador.

##  Características

-  **Gestión de Turnos**: Registro de inicio y cierre de turnos
-  **Seguimiento Horario**: Registro de producción por hora
-  **Dashboard Admin**: Visualización en tiempo real de métricas
-  **Autenticación Segura**: Validación con contraseñas hasheadas
-  **Sincronización en Tiempo Real**: Firestore para datos compartidos
-  **Exportación a Excel**: Reportes diarios y acumulados
-  **Auditoría**: Registro de todas las acciones

##  Requisitos Previos

- Node.js 18.x o superior
- npm o yarn
- Cuenta de Google Cloud / Firebase
- Git

##  Estructura del Proyecto

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

**Nota**: Las reglas protegen:
- Los usuarios solo leen/escriben su propia data o (si son admin) toda la data
- Los coordinadores solo ven datos de su cuadrilla
- Los admins tienen acceso total


**Funciones disponibles:**
- `validateCredentials`: Validar login
- `syncData`: Sincronizar datos local ↔ Firestore
- `generateDailyReport`: Generar reportes
- `createUser`: Crear usuarios (admin only)
- `getTrendsSummary`: Obtener tendencias

#
# 4. Configurar credenciales

### A través de Firebase Console
1. Ir a Authentication → Users
2. Crear usuarios manualmente
3. Ir a Firestore → Crear documentos en colección `users`


## Estructura de Datos Firestore

```
Firestore
├── users/
│   └── {userId}
│       ├── role: "admin" | "coordinator"
│       ├── cuadrilla: "Turnos" | "mixto" | ...
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

## Uso de la Aplicación

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
