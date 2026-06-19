
const db = require('../config/db');


const listar = (req, res) => {
    db.query(
        `SELECT c.id_curso, c.codigo, c.nombre, c.creditos, c.id_profesor,
                p.nombre AS profesor_nombre, p.apellido AS profesor_apellido
         FROM curso c
         LEFT JOIN profesor p ON p.id_profesor = c.id_profesor
         ORDER BY c.id_curso`,
        (err, filas) => {
            if (err) {
                res.status(500).json({ error: 'Error al listar las materias' });
                return;
            }
            res.json(filas);
        }
    );
};


const agregar = (req, res) => {
    const { codigo, nombre, creditos, id_profesor } = req.body;

    if (!codigo || !nombre || !creditos) {
        res.status(400).json({ error: 'Codigo, nombre y creditos son obligatorios' });
        return;
    }

    db.query(
        'INSERT INTO curso (codigo, nombre, creditos, id_profesor) VALUES (?, ?, ?, ?)',
        [codigo, nombre, creditos, id_profesor || null],
        (err, resultado) => {
            if (err) {
                res.status(500).json({ error: 'Error al registrar la materia' });
                return;
            }
            res.status(201).json({ id_curso: resultado.insertId, codigo, nombre, creditos, id_profesor: id_profesor || null });
        }
    );
};


const editar = (req, res) => {
    const { id } = req.params;
    const { codigo, nombre, creditos, id_profesor } = req.body;

    if (!codigo || !nombre || !creditos) {
        res.status(400).json({ error: 'Codigo, nombre y creditos son obligatorios' });
        return;
    }

    db.query(
        'UPDATE curso SET codigo = ?, nombre = ?, creditos = ?, id_profesor = ? WHERE id_curso = ?',
        [codigo, nombre, creditos, id_profesor || null, id],
        (err, resultado) => {
            if (err) {
                res.status(500).json({ error: 'Error al editar la materia' });
                return;
            }
            if (resultado.affectedRows === 0) {
                res.status(404).json({ error: 'Materia no encontrada' });
                return;
            }
            res.json({ id_curso: Number(id), codigo, nombre, creditos, id_profesor: id_profesor || null });
        }
    );
};


const eliminar = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM curso WHERE id_curso = ?', [id], (err, resultado) => {
        if (err) {
            res.status(500).json({ error: 'Error al eliminar la materia' });
            return;
        }
        if (resultado.affectedRows === 0) {
            res.status(404).json({ error: 'Materia no encontrada' });
            return;
        }
        res.json({ mensaje: 'Materia eliminada correctamente' });
    });
};

module.exports = { listar, agregar, editar, eliminar };
