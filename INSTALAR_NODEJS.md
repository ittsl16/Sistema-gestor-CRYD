# 📦 INSTALAR NODE.JS

## ¿Por qué necesitas Node.js?

```
firebase deploy = requiere Node.js
npm = viene con Node.js
Cloud Functions = necesitan Node.js 18+
```

---

## PASO 1: Descargar Node.js

1. Abre: https://nodejs.org/
2. Descarga la versión **LTS** (recomendada)
3. Debe ser **18.x o superior**

Archivo a descargar:
```
node-vX.X.X-x64.msi
```

---

## PASO 2: Instalar

1. Ejecuta el archivo `.msi` descargado
2. Click **Next** en todos los pasos
3. Selecciona: ✅ "Add to PATH" (importante)
4. Click **Install**
5. Espera a que termine

---

## PASO 3: Verificar

Cierra PowerShell completamente y abre una NUEVA.

```powershell
node --version
npm --version
```

Debe mostrar:
```
v18.x.x (o superior)
9.x.x (o superior)
```

Si ves esto → ✅ LISTO

---

## PASO 4: Continúa con Firebase Deploy

Una vez verificado, ejecuta:

```powershell
cd c:\Users\jl1fa1\OneDrive\ -\ DPDHL\Desktop\CRYD
npm install
```

---

## Si no funciona

```powershell
# Reinicia la computadora completamente
# Luego abre PowerShell NUEVA

node --version
npm --version
```

Si aún falla → ve a "Solucionar problemas" abajo

---

## ⚡ ALTERNATIVA RÁPIDA (Chocolatey)

Si ya tienes Chocolatey instalado:

```powershell
choco install nodejs --version=18.0.0
```

---

## Solucionar problemas

### Error: "npm is not recognized"

**Solución 1**: Reinicia PowerShell completamente

```
Cierra: Alt+F4
Abre: PowerShell NUEVA
```

**Solución 2**: Verifica el PATH

```powershell
# Busca Node.js en el sistema
Get-Command node
Get-Command npm
```

Si no aparece nada → Node.js no se instaló correctamente. Reinstala.

**Solución 3**: Instalación manual del PATH

```powershell
$env:Path -split ';' | grep -i node
```

Si no ves ruta de Node.js, reinstala y asegúrate de marcar "Add to PATH".

### Error: "firebase is not recognized"

Primero instala Node.js (este error), luego:

```powershell
npm install -g firebase-tools
```

---

## Verificación final

```powershell
# Todos estos deben funcionar:
node --version
npm --version
firebase --version
git --version
```

Si todos dan versión → ✅ LISTO PARA DEPLOY

---

## Siguiente paso

Una vez instalado Node.js:

```powershell
cd c:\Users\jl1fa1\OneDrive\ -\ DPDHL\Desktop\CRYD
npm install
cd functions && npm install && cd ..
firebase login
firebase deploy
```

---

**Resumen:**
1. Descargar Node.js desde nodejs.org
2. Instalar (marcar "Add to PATH")
3. Reiniciar PowerShell
4. Verificar: `node --version`
5. Continuar con `npm install`
