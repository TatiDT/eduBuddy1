const db = require('../config/db');


const obtenerDatosCompletos = async () => {
    const cursos = await db.promise().query('SELECT * FROM curso');
    const estudiantes = await db.promise().query('SELECT * FROM estudiante');
    const inscripciones = await db.promise().query('SELECT * FROM inscripcion');
    const evaluaciones = await db.promise().query('SELECT * FROM evaluacion');
    const subEvaluaciones = await db.promise().query('SELECT * FROM sub_evaluacion');
    const notas = await db.promise().query('SELECT * FROM nota');
    const subNotas = await db.promise().query('SELECT * FROM sub_nota');
    const recuperaciones = await db.promise().query('SELECT * FROM nota_recuperacion');

    return {
        cursos: cursos[0],
        estudiantes: estudiantes[0],
        inscripciones: inscripciones[0],
        evaluaciones: evaluaciones[0],
        subEvaluaciones: subEvaluaciones[0],
        notas: notas[0],
        subNotas: subNotas[0],
        recuperaciones: recuperaciones[0]
    };
};


const filtrarCursosPorQuery = (cursos, idCursoQuery) => {
    const idCursoFiltro = parseInt(idCursoQuery, 10);
    if (!idCursoQuery || Number.isNaN(idCursoFiltro)) return cursos;
    return cursos.filter(c => c.id_curso === idCursoFiltro);
};

const calcularNotaCurso = (id_curso, id_estudiante, data) => {
    const evalsCurso = data.evaluaciones.filter(e => e.id_curso === id_curso);
    if (evalsCurso.length === 0) return null;

    let notaFinal = 0;
    let sumaPorcentajes = 0;
    let tieneNotas = false;

    for (let ev of evalsCurso) {
        let notaEv = null;

        
        const recup = data.recuperaciones.find(r => r.id_evaluacion === ev.id_evaluacion && r.id_estudiante === id_estudiante);
        if (recup) {
            notaEv = parseFloat(recup.calificacion);
        } else {
            
            const subs = data.subEvaluaciones.filter(se => se.id_evaluacion === ev.id_evaluacion);
            if (subs.length > 0) {
                let sumaSub = 0;
                let subSumaPct = 0;
                for (let sub of subs) {
                    const sn = data.subNotas.find(n => n.id_sub_evaluacion === sub.id_sub_evaluacion && n.id_estudiante === id_estudiante);
                    if (sn) {
                        sumaSub += parseFloat(sn.calificacion) * (parseFloat(sub.porcentaje) / 100);
                        subSumaPct += parseFloat(sub.porcentaje);
                    }
                }
                if (subSumaPct > 0) {
                    
                    
                    notaEv = sumaSub;
                }
            } else {
                
                const notaNormal = data.notas.find(n => n.id_evaluacion === ev.id_evaluacion && n.id_estudiante === id_estudiante);
                if (notaNormal) {
                    notaEv = parseFloat(notaNormal.calificacion);
                }
            }
        }

        if (notaEv !== null) {
            tieneNotas = true;
            if (ev.porcentaje) {
                notaFinal += notaEv * (parseFloat(ev.porcentaje) / 100);
                sumaPorcentajes += parseFloat(ev.porcentaje);
            } else {
                
                notaFinal += notaEv;
                sumaPorcentajes += 1;
            }
        }
    }

    if (!tieneNotas) return null;

    const modoPorcentaje = evalsCurso.some(e => e.porcentaje);

    if (modoPorcentaje) {
        
        
        
        return notaFinal;
    }
    
    return notaFinal / sumaPorcentajes;
};

const promediosPorCurso = async (req, res) => {
    try {
        const data = await obtenerDatosCompletos();
        const resultados = [];
        const cursos = filtrarCursosPorQuery(data.cursos, req.query.id_curso);

        for (let curso of cursos) {
            const inscritos = data.inscripciones.filter(i => i.id_curso === curso.id_curso);
            let sumaNotas = 0;
            let alumnosConNota = 0;
            let aprobados = 0;

            for (let insc of inscritos) {
                const notaFinal = calcularNotaCurso(curso.id_curso, insc.id_estudiante, data);
                if (notaFinal !== null) {
                    sumaNotas += notaFinal;
                    alumnosConNota++;
                    if (notaFinal >= 4.0) aprobados++;
                }
            }

            resultados.push({
                id_curso: curso.id_curso,
                codigo: curso.codigo,
                nombre: curso.nombre,
                inscritos: inscritos.length,
                alumnosConNota,
                promedio: alumnosConNota > 0 ? (sumaNotas / alumnosConNota).toFixed(1) : '-',
                aprobados,
                tasaAprobacion: alumnosConNota > 0 ? ((aprobados / alumnosConNota) * 100).toFixed(1) + '%' : '-'
            });
        }

        res.json(resultados);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al generar reporte de promedios' });
    }
};

const notasDetalle = async (req, res) => {
    try {
        const data = await obtenerDatosCompletos();
        const resultados = [];
        const cursos = filtrarCursosPorQuery(data.cursos, req.query.id_curso);

        for (let curso of cursos) {
            const inscritos = data.inscripciones.filter(i => i.id_curso === curso.id_curso);

            for (let insc of inscritos) {
                const estudiante = data.estudiantes.find(e => e.id_estudiante === insc.id_estudiante);
                const notaFinal = calcularNotaCurso(curso.id_curso, insc.id_estudiante, data);
                
                resultados.push({
                    curso: curso.nombre,
                    estudiante: estudiante.nombre + ' ' + estudiante.apellido,
                    notaFinal: notaFinal !== null ? notaFinal.toFixed(1) : '-',
                    estado: notaFinal !== null ? (notaFinal >= 4.0 ? 'Aprobado' : 'Reprobado') : 'Sin notas'
                });
            }
        }

        res.json(resultados);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al generar reporte de detalles' });
    }
};

module.exports = { promediosPorCurso, notasDetalle };
