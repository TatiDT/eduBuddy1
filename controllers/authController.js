
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

module.exports = { login };
