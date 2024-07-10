const {
    obtenerInversionesHistoricas,
    obtenerInversionesAjustadas,
    obtenerInversionesMontecarlo,
    obtenerResultadosPeriodicos
  } = require('../services/dashboardsService');
  
  // Controlador para obtener inversiones históricas
  async function getInversionesHistoricas(req, res) {
    const usuarioId = req.params.usuarioId;
    try {
      const inversiones = await obtenerInversionesHistoricas(usuarioId);
      res.json(inversiones);
    } catch (error) {
      console.error('Error al obtener inversiones históricas:', error);
      res.status(500).send('Error al obtener inversiones históricas');
    }
  }
  
  // Controlador para obtener inversiones ajustadas por inflación
  async function getInversionesAjustadas(req, res) {
    const usuarioId = req.params.usuarioId;
    try {
      const inversiones = await obtenerInversionesAjustadas(usuarioId);
      res.json(inversiones);
    } catch (error) {
      console.error('Error al obtener inversiones ajustadas:', error);
      res.status(500).send('Error al obtener inversiones ajustadas');
    }
  }
  
  // Controlador para obtener inversiones de Monte Carlo
  async function getInversionesMontecarlo(req, res) {
    const usuarioId = req.params.usuarioId;
    try {
      const inversiones = await obtenerInversionesMontecarlo(usuarioId);
      res.json(inversiones);
    } catch (error) {
      console.error('Error al obtener inversiones de Monte Carlo:', error);
      res.status(500).send('Error al obtener inversiones de Monte Carlo');
    }
  }
  
  // Controlador para obtener resultados periódicos
  async function getResultadosPeriodicos(req, res) {
    const { simulacionId, tipoSimulacion, usuarioId, periodo, resultado } = req.params;
    try {
      const resultados = await obtenerResultadosPeriodicos(simulacionId, tipoSimulacion, usuarioId, periodo, resultado);
      res.json(resultados);
    } catch (error) {
      console.error('Error al obtener resultados periódicos:', error);
      res.status(500).send('Error al obtener resultados periódicos');
    }
  }
  
  module.exports = {
    getInversionesHistoricas,
    getInversionesAjustadas,
    getInversionesMontecarlo,
    getResultadosPeriodicos
  };
  