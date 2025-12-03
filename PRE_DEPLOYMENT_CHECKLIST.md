#  CHECKLIST PRE-DEPLOYMENT

##  ARCHIVOS Y CARPETAS

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

##  INSTALACIONES

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Firebase CLI instalado (`firebase --version`)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Dependencias de functions instaladas (`cd functions && npm install`)

## PROYECTO FIREBASE

- [ ] Proyecto `cryd-production` existe en Firebase Console
- [ ] Firestore está habilitado
- [ ] Authentication está habilitado
- [ ] Cloud Functions está habilitado
- [ ] Hosting está habilitado
- [ ] Cloud Storage no está habilitado

## CONTENIDO

- [ ] `seed-users.json` tiene 5 usuarios
  ```json
  [
    { "uid": "23721", "role": "coordinator", "cuadrilla": "a" },
    { "uid": "19091", "role": "coordinator", "cuadrilla": "b" },
    { "uid": "26536", "role": "coordinator", "cuadrilla": "c" },
    { "uid": "26992", "role": "coordinator", "cuadrilla": "mixto" },
    { "uid": "A001", "role": "admin", "cuadrilla": "Admin" }
  ]
  ```

- [ ] `firestore.rules` no está vacío
- [ ] `functions/index.js` tiene mínimo 5 funciones
- [ ] `firebase.json` apunta a proyecto `cryd-production`
- [ ] `.firebaserc` tiene `cryd-production` como default
