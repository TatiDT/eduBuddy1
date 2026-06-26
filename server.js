const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/panel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const estudiantesRouter = require('./routes/estudiantes');
app.use('/api/estudiantes', estudiantesRouter);

const evaluacionesRouter = require('./routes/evaluaciones');
app.use('/api/evaluaciones', evaluacionesRouter);

const cursosRouter = require('./routes/cursos');
app.use('/api/cursos', cursosRouter);

const profesoresRouter = require('./routes/profesores');
app.use('/api/profesores', profesoresRouter);

const subEvaluacionesRouter = require('./routes/subEvaluaciones');
app.use('/api', subEvaluacionesRouter);

const reportesRouter = require('./routes/reportes');
app.use('/api/reportes', reportesRouter);

const apuntesRouter = require('./routes/apuntes');
app.use('/api/apuntes', apuntesRouter);

app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ error: 'La foto no puede superar los 2MB' });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor arriba en http://localhost:${PORT}`);
});
