
const db = require('../config/db');


const listar = (req, res) => {
    db.query(
        `SELECT e.id_evaluacion, e.id_curso, e.nombre, e.tipo, e.porcentaje, e.fecha,
                c.codigo AS curso_codigo, c.nombre AS curso_nombre
         FROM evaluacion e
         JOIN curso c ON c.id_curso = e.id_curso
         ORDER BY e.fecha`,
        (err, filas) => {
            if (err) {
                res.status(500).json({ error: 'Error al listar las evaluaciones' });
                return;
            }
            res.json(filas);
        }
    );
};


const agregar = (req, res) => {
    const { id_curso, nombre, tipo, porcentaje, fecha } = req.body;

    if (!id_curso || !nombre || !tipo || !porcentaje || !fecha) {
        res.status(400).json({ error: 'Curso, nombre, tipo, porcentaje y fecha son obligatorios' });
        return;
    }

    db.query(
        'INSERT INTO evaluacion (id_curso, nombre, tipo, porcentaje, fecha) VALUES (?, ?, ?, ?, ?)',
        [id_curso, nombre, tipo, porcentaje, fecha],
        (err, resultado) => {
            if (err) {
                res.status(500).json({ error: 'Error al registrar la evaluacion' });
                return;
            }
            res.status(201).json({ id_evaluacion: resultado.insertId, id_curso, nombre, tipo, porcentaje, fecha });
        }
    );
};

const editar = (req, res) => {
    const { id } = req.params;
    const { id_curso, nombre, tipo, porcentaje, fecha } = req.body;

    if (!id_curso || !nombre || !tipo || !porcentaje || !fecha) {
        res.status(400).json({ error: 'Curso, nombre, tipo, porcentaje y fecha son obligatorios' });
        return;
    }

    db.query(
        'UPDATE evaluacion SET id_curso = ?, nombre = ?, tipo = ?, porcentaje = ?, fecha = ? WHERE id_evaluacion = ?',
        [id_curso, nombre, tipo, porcentaje, fecha, id],
        (err, resultado) => {
            if (err) {
                res.status(500).json({ error: 'Error al editar la evaluacion' });
                return;
            }
            if (resultado.affectedRows === 0) {
                res.status(404).json({ error: 'Evaluacion no encontrada' });
                return;
            }
            res.json({ id_evaluacion: Number(id), id_curso, nombre, tipo, porcentaje, fecha });
        }
    );
};


const eliminar = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM evaluacion WHERE id_evaluacion = ?', [id], (err, resultado) => {
        if (err) {
            res.status(500).json({ error: 'Error al eliminar la evaluacion' });
            return;
        }
        if (resultado.affectedRows === 0) {
            res.status(404).json({ error: 'Evaluacion no encontrada' });
            return;
        }
        res.json({ mensaje: 'Evaluacion eliminada correctamente' });
    });
};


const notasDeEvaluacion = (req, res) => {
    const { id } = req.params;

    db.query(
        `SELECT est.id_estudiante, est.nombre, est.apellido, n.calificacion AS nota
         FROM evaluacion e
         JOIN inscripcion i ON i.id_curso = e.id_curso
         JOIN estudiante est ON est.id_estudiante = i.id_estudiante
         LEFT JOIN nota n ON n.id_evaluacion = e.id_evaluacion AND n.id_estudiante = est.id_estudiante
         WHERE e.id_evaluacion = ?
         ORDER BY est.apellido, est.nombre`,
        [id],
        (err, filas) => {
            if (err) {
                res.status(500).json({ error: 'Error al obtener las notas de la evaluacion' });
                return;
            }
            res.json(filas);
        }
    );
};

module.exports = { listar, agregar, editar, eliminar, notasDeEvaluacion };
