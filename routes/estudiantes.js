const express = require('express');
const router = express.Router();
const controller = require('../controllers/estudianteController');

router.get('/',controller.listar);
router.get('/perfil/:correo',controller.perfil);
router.post('/notas',controller.guardarNota);
router.delete('/notas/:id_estudiante/:id_evaluacion',controller.eliminarNota);
router.post('/',controller.agregar);
router.put('/:id',controller.editar);
router.delete('/:id',controller.eliminar);

module.exports = router;
