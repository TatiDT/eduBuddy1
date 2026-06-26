const express = require('express');
const router = express.Router();
const controller = require('../controllers/cursoController');
const { requireAdmin } = require('../middleware/auth');

router.use(requireAdmin);

router.get('/', controller.listar);
router.post('/', controller.agregar);
router.put('/:id', controller.editar);
router.delete('/:id', controller.eliminar);

module.exports = router;
