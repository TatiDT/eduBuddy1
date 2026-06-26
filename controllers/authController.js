
const bcrypt = require('bcryptjs');
const db = require('../config/db');


const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
        return;
    }

    db.query('SELECT * FROM usuario WHERE correo = ?', [email], (err, filas) => {
        if (err) {
            res.status(500).json({ error: 'Error al validar las credenciales' });
            return;
        }

        if (filas.length === 0 || !bcrypt.compareSync(password, filas[0].password_hash)) {
            res.status(401).json({ error: 'Correo o contraseña incorrectos' });
            return;
        }

        const { id_usuario, correo, rol, estado } = filas[0];
        res.json({ usuario: { id: id_usuario, correo, rol, estado } });
    });
};

const registro = (req, res) => {
    const { rut, nombre, apellido, correo, carrera, password } = req.body;

    if (!rut || !nombre || !apellido || !correo || !carrera || !password) {
        res.status(400).json({ error: 'Rut, nombre, apellido, correo, carrera y contraseña son obligatorios' });
        return;
    }
    if (password.length < 6) {
        res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        return;
    }

    db.query('SELECT id_usuario FROM usuario WHERE correo = ?', [correo], (err, filas) => {
        if (err) {
            res.status(500).json({ error: 'Error al registrar el usuario' });
            return;
        }
        if (filas.length > 0) {
            res.status(409).json({ error: 'Ya existe una cuenta con ese correo' });
            return;
        }

        const passwordHash = bcrypt.hashSync(password, 10);

        db.query(
            'INSERT INTO usuario (correo, password_hash, rol) VALUES (?, ?, ?)',
            [correo, passwordHash, 'ESTUDIANTE'],
            (err2, resultadoUsuario) => {
                if (err2) {
                    res.status(500).json({ error: 'Error al registrar el usuario' });
                    return;
                }

                const fechaIngreso = new Date().toISOString().slice(0, 10);
                db.query(
                    'INSERT INTO estudiante (rut, nombre, apellido, correo, carrera, fecha_ingreso) VALUES (?, ?, ?, ?, ?, ?)',
                    [rut, nombre, apellido, correo, carrera, fechaIngreso],
                    (err3) => {
                        if (err3) {
                            db.query('DELETE FROM usuario WHERE id_usuario = ?', [resultadoUsuario.insertId], () => {});
                            const mensaje = err3.code === 'ER_DUP_ENTRY' ? 'Ese RUT ya está registrado' : 'Error al registrar el estudiante';
                            res.status(400).json({ error: mensaje });
                            return;
                        }

                        res.status(201).json({ usuario: { id: resultadoUsuario.insertId, correo, rol: 'ESTUDIANTE', estado: 'ACTIVO' } });
                    }
                );
            }
        );
    });
};

module.exports = { login, registro };
