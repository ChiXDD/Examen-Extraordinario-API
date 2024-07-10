const express = require('express');
const router = express.Router();
const {
  getInversionesHistoricas,
  getInversionesAjustadas,
  getInversionesMontecarlo,
  getResultadosPeriodicos
} = require('../controllers/dashboardsController');

router.get('/historicas/:usuarioId', getInversionesHistoricas);
router.get('/ajustadas/:usuarioId', getInversionesAjustadas);
router.get('/montecarlo/:usuarioId', getInversionesMontecarlo);
router.get('/resultados/:simulacionId/:tipoSimulacion/:usuarioId', getResultadosPeriodicos);

module.exports = router;
