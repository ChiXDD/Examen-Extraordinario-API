const express = require('express');
const router = express.Router();

// Importar rutas específicas
const usuariosRoute = require('./usuariosRoute');
const inversionesRoute = require('./inversionesRoute');
const dashboardsRoute = require('./dashboardsRoute');

// Rutas específicas para usuarios
router.use('/usuarios', usuariosRoute);

// Rutas específicas para inversiones
router.use('/inversiones', inversionesRoute);

// Rutas específicas para dashboards
router.use('/dashboards', dashboardsRoute);

module.exports = router;
