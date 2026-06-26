const express = require('express');
const router = express.Router();
const controller = require('../controllers/reporteController');
const { requireAdmin } = require('../middleware/auth');

router.use(requireAdmin);

router.get('/promedios', controller.promediosPorCurso);
router.get('/detalle', controller.notasDetalle);

module.exports = router;
