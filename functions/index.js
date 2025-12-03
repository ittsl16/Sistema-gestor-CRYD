const functions = require('firebase-functions');
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

/**
 * FUNCIÓN 1: Validar credenciales de usuario
 * Endpoint: POST /validateCredentials
 * Body: { userId, password, userType }
 * Retorna: { valid: boolean, message: string, token?: string }
 */
exports.validateCredentials = functions.https.onCall(async (data, context) => {
  try {
    const { userId, password, userType } = data;

    if (!userId || !password || !userType) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'userId, password, and userType are required'
      );
    }

    // Obtener documento del usuario
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return { valid: false, message: 'Usuario no encontrado' };
    }

    const userData = userDoc.data();

    // Verificar rol
    if (userData.role !== userType && userType !== 'any') {
      return { valid: false, message: 'Tipo de usuario incorrecto' };
    }

    // Comparar contraseña
    const passwordMatch = await bcrypt.compare(password, userData.passwordHash);

    if (!passwordMatch) {
      // Log attempt fallido
      await logAudit(userId, 'LOGIN_FAILED', { reason: 'Invalid password' });
      return { valid: false, message: 'Contraseña incorrecta' };
    }

    // Log successful login
    await logAudit(userId, 'LOGIN_SUCCESS', { userType: userData.role });

    // Generar custom token de Firebase
    const customToken = await auth.createCustomToken(userId);

    return {
      valid: true,
      message: 'Autenticación exitosa',
      token: customToken,
      userRole: userData.role,
      cuadrilla: userData.cuadrilla
    };
  } catch (error) {
    console.error('Error en validateCredentials:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * FUNCIÓN 2: Sincronizar datos locales con Firestore
 * Endpoint: POST /syncData
 * Body: { date, shiftData, hourlyData }
 */
exports.syncData = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const { date, shiftData, hourlyData } = data;

    if (!date || !shiftData || !hourlyData) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'date, shiftData, and hourlyData are required'
      );
    }

    const userId = context.auth.uid;

    // Validar que el usuario es coordinador
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists || userDoc.data().role !== 'coordinator') {
      throw new functions.https.HttpsError('permission-denied', 'Only coordinators can sync data');
    }

    const cuadrilla = userDoc.data().cuadrilla;

    // Guardar shift data
    if (shiftData && Object.keys(shiftData).length > 0) {
      await db.collection('shifts').doc(date).collection('cuadrillas').doc(cuadrilla).set(
        { ...shiftData, lastSyncedAt: admin.firestore.FieldValue.serverTimestamp() },
        { merge: true }
      );
    }

    // Guardar hourly data
    if (hourlyData && Array.isArray(hourlyData) && hourlyData.length > 0) {
      await db.collection('hourly').doc(date).collection('cuadrillas').doc(cuadrilla).set(
        { entries: hourlyData, lastSyncedAt: admin.firestore.FieldValue.serverTimestamp() },
        { merge: true }
      );
    }

    await logAudit(userId, 'DATA_SYNCED', { date, cuadrilla });

    return {
      success: true,
      message: 'Datos sincronizados correctamente',
      syncedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error en syncData:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * FUNCIÓN 3: Generar reporte diario
 * Endpoint: POST /generateDailyReport
 * Body: { date }
 */
exports.generateDailyReport = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const { date } = data;

    if (!date) {
      throw new functions.https.HttpsError('invalid-argument', 'date is required');
    }

    const userId = context.auth.uid;
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      throw new functions.https.HttpsError('permission-denied', 'Only admins can generate reports');
    }

    // Obtener todos los datos del día
    const shiftsSnapshot = await db.collection('shifts').doc(date).collection('cuadrillas').get();
    const hourlySnapshot = await db.collection('hourly').doc(date).collection('cuadrillas').get();

    let totalProduction = 0;
    let totalAttendance = 0;
    let reportData = {
      date,
      generatedAt: new Date().toISOString(),
      generatedBy: userId,
      summary: {},
      details: []
    };

    // Procesar shifts
    shiftsSnapshot.forEach(doc => {
      const cuadrilla = doc.id;
      const shiftData = doc.data();
      
      const attendance = shiftData.attendance || {};
      const attendance_total = 
        (attendance.montas || 0) +
        (attendance.alm || 0) +
        (attendance.auditores || 0) +
        (attendance.auxiliares || 0) +
        (attendance.analistas || 0);
      
      totalAttendance += attendance_total;

      reportData.summary[cuadrilla] = {
        attendance,
        attendance_total,
        metaTurno: shiftData.metaTurno,
        extras: shiftData.extras || [],
        comentarios: shiftData.comentarios || ''
      };
    });

    // Procesar hourly
    hourlySnapshot.forEach(doc => {
      const cuadrilla = doc.id;
      const data = doc.data();
      const entries = data.entries || [];

      const cuadrillaProduction = entries.reduce((sum, e) => sum + (e.cajas || 0), 0);
      totalProduction += cuadrillaProduction;

      if (reportData.summary[cuadrilla]) {
        reportData.summary[cuadrilla].production = cuadrillaProduction;
        reportData.summary[cuadrilla].hourlyCount = entries.length;
      }
    });

    reportData.totals = {
      production: totalProduction,
      attendance: totalAttendance
    };

    // Guardar reporte
    const reportId = `report_${date}_${Date.now()}`;
    await db.collection('reports').doc(reportId).set(reportData);

    await logAudit(userId, 'REPORT_GENERATED', { date, reportId });

    return {
      success: true,
      reportId,
      message: 'Reporte generado correctamente',
      summary: reportData
    };
  } catch (error) {
    console.error('Error en generateDailyReport:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * FUNCIÓN 4: Crear/actualizar usuario (solo admin)
 * Endpoint: POST /createUser
 * Body: { userId, email, password, role, cuadrilla }
 */
exports.createUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const { userId, email, password, role, cuadrilla } = data;

    if (!userId || !password || !role || !cuadrilla) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'userId, password, role, and cuadrilla are required'
      );
    }

    const adminId = context.auth.uid;
    const adminDoc = await db.collection('users').doc(adminId).get();

    if (!adminDoc.exists || adminDoc.data().role !== 'admin') {
      throw new functions.https.HttpsError('permission-denied', 'Only admins can create users');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear documento en Firestore
    await db.collection('users').doc(userId).set({
      email: email || `${userId}@cryd.local`,
      role,
      cuadrilla,
      passwordHash,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: adminId
    });

    // Crear usuario en Auth
    try {
      await auth.createUser({
        uid: userId,
        email: email || `${userId}@cryd.local`,
        password: password
      });
    } catch (authError) {
      if (authError.code !== 'auth/uid-already-exists') {
        throw authError;
      }
      // User already exists, just update
      await auth.updateUser(userId, { password });
    }

    // Set custom claims
    await auth.setCustomUserClaims(userId, { role, cuadrilla });

    await logAudit(adminId, 'USER_CREATED', { userId, role, cuadrilla });

    return {
      success: true,
      message: `Usuario ${userId} creado exitosamente`,
      userId,
      role,
      cuadrilla
    };
  } catch (error) {
    console.error('Error en createUser:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * FUNCIÓN 5: Obtener resumen de tendencias (solo admin)
 * Endpoint: POST /getTrendsSummary
 * Body: { startDate, endDate }
 */
exports.getTrendsSummary = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const { startDate, endDate } = data;

    if (!startDate || !endDate) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'startDate and endDate are required'
      );
    }

    const userId = context.auth.uid;
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      throw new functions.https.HttpsError('permission-denied', 'Only admins can view trends');
    }

    // Obtener reportes en rango
    const reportsSnapshot = await db.collection('reports')
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .get();

    let trends = {
      dateRange: { startDate, endDate },
      totalDays: 0,
      averageProduction: 0,
      averageAttendance: 0,
      dailyData: []
    };

    let totalProduction = 0;
    let totalAttendance = 0;

    reportsSnapshot.forEach(doc => {
      const report = doc.data();
      trends.dailyData.push({
        date: report.date,
        production: report.totals?.production || 0,
        attendance: report.totals?.attendance || 0
      });

      totalProduction += report.totals?.production || 0;
      totalAttendance += report.totals?.attendance || 0;
    });

    trends.totalDays = trends.dailyData.length;
    trends.averageProduction = trends.totalDays > 0 ? Math.round(totalProduction / trends.totalDays) : 0;
    trends.averageAttendance = trends.totalDays > 0 ? Math.round(totalAttendance / trends.totalDays) : 0;

    return { success: true, trends };
  } catch (error) {
    console.error('Error en getTrendsSummary:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * FUNCIÓN AUXILIAR: Registrar auditoría
 */
async function logAudit(userId, action, metadata = {}) {
  try {
    await db.collection('logs').add({
      userId,
      action,
      metadata,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ip: '' // Puedes obtener del contexto si es necesario
    });
  } catch (error) {
    console.warn('Error logging audit:', error);
  }
}

/**
 * TRIGGER: Limpiar datos antiguos (ejecutar diariamente)
 * Mantiene solo reportes de los últimos 90 días
 */
exports.cleanupOldReports = functions.pubsub
  .schedule('0 2 * * *') // 2 AM diariamente
  .timeZone('America/Bogota')
  .onRun(async (context) => {
    try {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const oldReports = await db.collection('reports')
        .where('generatedAt', '<', ninetyDaysAgo.toISOString())
        .get();

      let deletedCount = 0;
      const batch = db.batch();

      oldReports.forEach(doc => {
        batch.delete(doc.ref);
        deletedCount++;
      });

      await batch.commit();
      console.log(`Cleaned up ${deletedCount} old reports`);

      return { success: true, deletedCount };
    } catch (error) {
      console.error('Error in cleanupOldReports:', error);
      return { success: false, error: error.message };
    }
  });

module.exports = {
  validateCredentials: exports.validateCredentials,
  syncData: exports.syncData,
  generateDailyReport: exports.generateDailyReport,
  createUser: exports.createUser,
  getTrendsSummary: exports.getTrendsSummary,
  cleanupOldReports: exports.cleanupOldReports
};
