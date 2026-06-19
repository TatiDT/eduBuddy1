const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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


// ── Arrancar servidor ────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Servidor arriba en http://localhost:${PORT}`);
});
