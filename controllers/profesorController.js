
const db = require('../config/db');


const listar = (req, res) => {
    db.query('SELECT * FROM profesor ORDER BY id_profesor', (err, filas) => {
        if (err) {
            res.status(500).json({ error: 'Error al listar los profesores' });
            return;
        }
        res.json(filas);
    });
};


const agregar = (req, res) => {
    const { nombre, apellido, correo } = req.body;

    if (!nombre || !apellido || !correo) {
        res.status(400).json({ error: 'Nombre, apellido y correo son obligatorios' });
        return;
    }

    db.query(
        'INSERT INTO profesor (nombre, apellido, correo) VALUES (?, ?, ?)',
        [nombre, apellido, correo],
        (err, resultado) => {
            if (err) {
                res.status(500).json({ error: 'Error al registrar el profesor' });
                return;
            }
            res.status(201).json({ id_profesor: resultado.insertId, nombre, apellido, correo });
        }
    );
};


const editar = (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, correo } = req.body;

    if (!nombre || !apellido || !correo) {
        res.status(400).json({ error: 'Nombre, apellido y correo son obligatorios' });
        return;
    }

    db.query(
        'UPDATE profesor SET nombre = ?, apellido = ?, correo = ? WHERE id_profesor = ?',
        [nombre, apellido, correo, id],
        (err, resultado) => {
            if (err) {
                res.status(500).json({ error: 'Error al editar el profesor' });
                return;
            }
            if (resultado.affectedRows === 0) {
                res.status(404).json({ error: 'Profesor no encontrado' });
                return;
            }
            res.json({ id_profesor: Number(id), nombre, apellido, correo });
        }
    );
};


const eliminar = (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM profesor WHERE id_profesor = ?', [id], (err, resultado) => {
        if (err) {
            res.status(500).json({ error: 'Error al eliminar el profesor' });
            return;
        }
        if (resultado.affectedRows === 0) {
            res.status(404).json({ error: 'Profesor no encontrado' });
            return;
        }
        res.json({ mensaje: 'Profesor eliminado correctamente' });
    });
};

module.exports = { listar, agregar, editar, eliminar };
