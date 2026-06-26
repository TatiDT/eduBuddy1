const express = require('express');
const router = express.Router();
const controller = require('../controllers/estudianteController');
const upload = require('../config/multer');
const { requireAdmin } = require('../middleware/auth');

router.get('/',requireAdmin,controller.listar);
router.get('/perfil/:correo',controller.perfil);
router.post('/notas',controller.guardarNota);
router.delete('/notas/:id_estudiante/:id_evaluacion',requireAdmin,controller.eliminarNota);
router.post('/:id/foto',upload.single('foto'),controller.subirFoto);
router.post('/',requireAdmin,controller.agregar);
router.put('/:id',requireAdmin,controller.editar);
router.delete('/:id',requireAdmin,controller.eliminar);

module.exports = router;
