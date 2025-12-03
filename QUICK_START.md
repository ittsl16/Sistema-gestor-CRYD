#  INICIO RÁPIDO 

##  CREAR USUARIOS

### OPCIÓN A: A través de Firebase Console

1. Abre: https://console.firebase.google.com
2. Selecciona proyecto: `cryd-production`
3. Ve a: **Authentication** (en menú izquierdo)
4. Click **Create user** (botón arriba)
   - Click **Create user**

Repite para crear más usuarios:


Luego necesitas crear documentos en Firestore:
1. Ve a **Firestore** en menú
2. Click **Create collection**
3. Collection ID: 
4. Document ID: 
5. Agrega campos:
   ```
   role: ""
   cuadrilla: ""
   email: ""
   passwordHash: "(generar con bcrypt)"
   createdAt: (timestamp actual)
   ```

---