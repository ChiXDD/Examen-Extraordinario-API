const express = require('express');
const router = express.Router();
const inversionesController = require('../controllers/inversionesController');

router.post('/simular', inversionesController.simularYGuardar);

module.exports = router;
