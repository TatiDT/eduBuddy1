const express = require('express');
const router = express.Router();
const controller = require('../controllers/subEvaluacionController');
const { requireAdmin } = require('../middleware/auth');

router.use(requireAdmin);

router.get('/:id_evaluacion/sub-evaluaciones', controller.listarPorEvaluacion);
router.post('/sub-evaluaciones', controller.agregar);
router.put('/sub-evaluaciones/:id', controller.editar);
router.delete('/sub-evaluaciones/:id', controller.eliminar);

router.get('/sub-evaluaciones/:id_sub_evaluacion/sub-notas', controller.listarSubNotas);
router.post('/sub-notas', controller.guardarSubNota);
router.delete('/sub-notas/:id_estudiante/:id_sub_evaluacion', controller.eliminarSubNota);

module.exports = router;
