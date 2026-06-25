const express = require('express');
const router = express.Router();
const controller = require('../controllers/reporteController');

router.get('/promedios', controller.promediosPorCurso);
router.get('/detalle', controller.notasDetalle);

module.exports = router;
