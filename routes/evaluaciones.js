const express = require('express');
const router = express.Router();
const controller = require('../controllers/evaluacionController');

router.get('/', controller.listar);
router.post('/', controller.agregar);
router.put('/:id', controller.editar);
router.delete('/:id', controller.eliminar);
router.get('/:id/notas', controller.notasDeEvaluacion);

module.exports = router;
