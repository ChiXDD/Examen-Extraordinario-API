const { obtenerConexion } = require('../database/conexion');

// Función para obtener las inversiones históricas de un usuario
async function obtenerInversionesHistoricas(usuarioId) {
  const conexion = await obtenerConexion();
  const [rows] = await conexion.query('SELECT * FROM historico WHERE usuario_id = ?', [usuarioId]);
  conexion.release();
  return rows;
}

// Función para obtener las inversiones ajustadas por inflación de un usuario
async function obtenerInversionesAjustadas(usuarioId) {
  const conexion = await obtenerConexion();
  const [rows] = await conexion.query('SELECT * FROM ajustado WHERE usuario_id = ?', [usuarioId]);
  conexion.release();
  return rows;
}

// Función para obtener las inversiones de Monte Carlo de un usuario
async function obtenerInversionesMontecarlo(usuarioId) {
  const conexion = await obtenerConexion();
  const [rows] = await conexion.query('SELECT * FROM montecarlo WHERE usuario_id = ?', [usuarioId]);
  conexion.release();
  return rows;
}

// Función para obtener los resultados periódicos de una simulación
async function obtenerResultadosPeriodicos(simulacionId, tipoSimulacion, usuarioId, periodo, resultado) {
  const conexion = await obtenerConexion();
  const [rows] = await conexion.query(
    'SELECT periodo, resultado FROM resultados_periodicos WHERE simulacion_id = ? AND tipo_simulacion = ? AND usuario_id = ? ORDER BY periodo',
    [simulacionId, tipoSimulacion, usuarioId, periodo, resultado]
  );
  conexion.release();
  return rows;
}

module.exports = {
  obtenerInversionesHistoricas,
  obtenerInversionesAjustadas,
  obtenerInversionesMontecarlo,
  obtenerResultadosPeriodicos
};
