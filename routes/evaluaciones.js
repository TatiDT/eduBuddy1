const express = require('express');
const router = express.Router();
const controller = require('../controllers/evaluacionController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', requireAdmin, controller.listar);
router.post('/', controller.agregar);
router.put('/:id', requireAdmin, controller.editar);
router.delete('/:id', requireAdmin, controller.eliminar);
router.get('/:id/notas', requireAdmin, controller.notasDeEvaluacion);
router.post('/recuperacion', requireAdmin, controller.guardarNotaRecuperacion);
router.delete('/recuperacion/:id_evaluacion/:id_estudiante', requireAdmin, controller.eliminarNotaRecuperacion);

module.exports = router;
