const requireAdmin = (req, res, next) => {
    if (req.headers['x-user-rol'] !== 'ADMIN') {
        res.status(403).json({ error: 'Acceso restringido a administradores' });
        return;
    }
    next();
};

module.exports = { requireAdmin };
