const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'perfiles');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, req.params.id + '-' + Date.now() + path.extname(file.originalname))
});

const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => cb(null, tiposPermitidos.includes(file.mimetype))
});

module.exports = upload;
