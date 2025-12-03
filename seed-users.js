/*
  seed-users.js
  ----------------
  Usage:
    1. Create a service account key in Firebase Console -> Project Settings -> Service accounts -> Generate new private key
    2. Save the JSON key somewhere, set env var in PowerShell:
       $env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\path\to\service-account.json'
    3. Place a `seed-users.json` in the same folder (or edit path below). You can copy `seed-users.json.example` and update passwords/ids.
    4. Install deps and run:
       npm install firebase-admin bcryptjs
       node seed-users.js

  What it does:
    - For each entry in seed-users.json it will:
      * hash the password with bcrypt
      * create/ensure a Firestore document users/{uid} with fields: role, cuadrilla, email, passwordHash, createdAt
      * create an Auth user with uid (if not exists)
      * set custom claims { role, id }

  WARNING: Keep service account JSON safe. Don't paste it anywhere public.
*/

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

const SEED_FILE = path.join(__dirname, 'seed-users.json');

if (!fs.existsSync(SEED_FILE)) {
  console.error('No encontré seed-users.json en', SEED_FILE);
  console.error('Copia seed-users.json.example -> seed-users.json y edítalo con tus IDs y contraseñas.');
  process.exit(1);
}

let serviceAccount;
try {
  // Initialize admin SDK using GOOGLE_APPLICATION_CREDENTIALS env var or default
  admin.initializeApp({});
} catch (e) {
  console.error('Failed to initialize firebase-admin. Ensure GOOGLE_APPLICATION_CREDENTIALS is set and valid.');
  console.error(e);
  process.exit(1);
}

const db = admin.firestore();

(async function main() {
  try {
    const raw = fs.readFileSync(SEED_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    const users = Array.isArray(parsed) ? parsed : parsed.users;
    console.log('Usuarios a procesar:', users.map(u => u.uid).join(', '));

    for (const u of users) {
      if (!u.uid || !u.password || !u.role) {
        console.warn('Registro inválido (falta uid/password/role):', u);
        continue;
      }
      const uid = u.uid;
      const password = u.password;
      const role = u.role;
      const cuadrilla = u.cuadrilla || null;
      const email = u.email || `${uid}@cryd.local`;

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Write to Firestore
      const userDoc = {
        email: email,
        role: role,
        cuadrilla: cuadrilla,
        passwordHash: passwordHash,
        createdAt: new Date().toISOString()
      };

      await db.collection('users').doc(uid).set(userDoc, { merge: true });
      console.log(`Documento users/${uid} creado/actualizado en Firestore`);

      // Ensure Auth user exists
      try {
        await admin.auth().getUser(uid);
        console.log(`Auth user ${uid} ya existe`);
      } catch (e) {
        console.log(`Auth user ${uid} no existe. Creando...`);
        await admin.auth().createUser({ uid, email });
        console.log(`Auth user ${uid} creado`);
      }

      // Set custom claims
      await admin.auth().setCustomUserClaims(uid, { role, id: uid });
      console.log(`Claims seteadas para ${uid}: role=${role}`);
    }

    console.log('Seed completado con éxito.');
    process.exit(0);
  } catch (err) {
    console.error('Error en seed-users:', err);
    process.exit(1);
  }
})();
