# 🚀 Guía de Deploy - CRYD a Firebase Hosting

## PASO A PASO

### PASO 1: Preparar los Archivos

```bash
# 1. Ir a la carpeta del proyecto
cd c:\Users\jl1fa1\OneDrive\ -\ DPDHL\Desktop\CRYD

# 2. Copiar CRYD.html a public/index.html
copy CRYD.html public\index.html

# 3. Crear seed-users.json desde el ejemplo
copy seed-users.json.example seed-users.json

# 4. Editar seed-users.json con tus usuarios (opcional por ahora)
```

### PASO 2: Instalar Firebase CLI

```bash
# Instalar de forma global
npm install -g firebase-tools

# Verificar instalación
firebase --version

# Si no funciona, usar npx
npx firebase login
```

### PASO 3: Autenticarse con Firebase

```bash
# Abre navegador para login
firebase login

# Selecciona tu cuenta Google
# Autoriza Firebase CLI
```

### PASO 4: Inicializar Proyecto (si no está hecho)

```bash
# El proyecto ya debería estar inicializado en firebase.json
# Pero si no, ejecuta:
firebase init

# Selecciona:
# - Hosting
# - Functions  
# - Firestore
# Selecciona proyecto: cryd-production
```

### PASO 5: Instalar Dependencias

```bash
# Dependencias principales
npm install

# Dependencias de Functions
cd functions
npm install
cd ..
```

### PASO 6: Deploy de Security Rules

```bash
# Esto es CRÍTICO para la seguridad
firebase deploy --only firestore:rules

# Verificar que dice "✔ firestore:rules"
```

### PASO 7: Deploy de Cloud Functions

```bash
# Deploy las funciones
firebase deploy --only functions

# Esto tardará unos minutos...
# Espera a ver "✔ functions deployed successfully"
```

### PASO 8: Deploy de Firestore Indexes

```bash
# Crear índices
firebase deploy --only firestore:indexes

# Esto es inmediato
```

### PASO 9: Deploy de Hosting

```bash
# Deploy la app
firebase deploy --only hosting

# Espera a ver la URL de tu app
# Ejemplo: https://cryd-production.web.app
```

### PASO 10: Verificar Deploy

Abre en el navegador:
```
https://cryd-production.web.app
```

Deberías ver:
- ✅ Login screen
- ✅ Sistema Gestor como título
- ✅ Campos de ID y contraseña

### PASO 11: Crear Usuarios de Prueba

```bash
# 1. Descargar Service Account Key
# - Firebase Console
# - Project Settings (⚙️)
# - Service Accounts
# - Generate New Private Key
# - Guardar como: service-account-key.json

# 2. Configurar variable de entorno (PowerShell)
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\ruta\a\service-account-key.json"

# 3. Crear seed-users.json
# (ya lo hiciste en PASO 1)

# 4. Ejecutar seed
node seed-users.js

# Deberías ver:
# "✅ Documento users/coordinador_a creado/actualizado en Firestore"
# "✅ Auth user coordinador_a creado"
# "✅ Claims seteadas para coordinador_a: role=coordinator"
```

### PASO 12: Probar Login

En https://cryd-production.web.app:

```
ID: coordinador_a
Contraseña: Password123!

Tipo: Coordinador
```

Deberías entrar y ver el formulario de "Inicio de Turno".

---

## ⚠️ Si algo falla...

### Error: "Command not found: firebase"

```bash
# Instala globalmente
npm install -g firebase-tools

# O usa npx (sin instalación global)
npx firebase deploy
```

### Error: "Permission denied" en Firestore

```bash
# Re-deploy las reglas
firebase deploy --only firestore:rules

# Verifica que el archivo existe
ls firestore.rules
```

### Error: "Function deployment failed"

```bash
# Verifica que package.json existe en functions/
cd functions
npm install
cd ..

# Re-deploy
firebase deploy --only functions
```

### Error: "index.html not found"

```bash
# Verifica que public/index.html existe
ls public/index.html

# Si no, cópialo
copy CRYD.html public\index.html

# Y redeploy
firebase deploy --only hosting
```

---

## 📋 Verificar Deployment

### En Firebase Console

1. Abre: https://console.firebase.google.com
2. Selecciona proyecto: `cryd-production`
3. Verifica:
   - ✅ **Hosting**: Ver URL con icono verde
   - ✅ **Functions**: Ver funciones listadas
   - ✅ **Firestore**: Ver colecciones creadas
   - ✅ **Security Rules**: Ver reglas deployadas

### En el navegador

```
https://cryd-production.web.app
```

Prueba:
1. ✅ Ves pantalla de login
2. ✅ Intentas login con credenciales inválidas → Error
3. ✅ Intentas login con coordinador_a / Password123! → Entra
4. ✅ Ves dashboard de coordinador

---

## 🔄 Actualizaciones Futuras

Cada vez que cambies el código:

```bash
# Opción 1: Deploy todo
firebase deploy

# Opción 2: Deploy solo lo que cambió
firebase deploy --only hosting        # Solo HTML/CSS/JS
firebase deploy --only functions      # Solo Cloud Functions
firebase deploy --only firestore:rules # Solo reglas
```

---

## 🌐 Compartir con Coordinadores

Una vez deployado, comparte este enlace:

```
https://cryd-production.web.app
```

Cada coordinador recibe:
- ID de usuario
- Contraseña

Acceden y pueden:
- Registrar turnos
- Registrar producción por hora
- Ver progreso

---

## 🛠️ Configuración Adicional (Opcional)

### Custom Domain

Si quieres usar tu propio dominio:

```bash
# En Firebase Console → Hosting → Add custom domain
# Ejemplo: cryd.tuempresa.com

# Y apunta el DNS a los nameservers de Firebase
```

### SSL/TLS Automático

✅ Firebase Hosting proporciona certificados SSL gratis automáticamente.

---

## 📞 Soporte

Si algo no funciona:

1. Verifica `firebase.json` existe
2. Verifica `firestore.rules` existe
3. Verifica `functions/index.js` existe
4. Ejecuta: `firebase deploy --debug` para más detalles

---

**Última actualización**: Diciembre 2025
