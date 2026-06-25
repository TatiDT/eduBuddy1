const mysql = require('mysql2/promise');

const queries = [
    `ALTER TABLE apunte ADD FOREIGN KEY (id_curso) REFERENCES curso(id_curso) ON DELETE CASCADE;`,
    `ALTER TABLE apunte ADD COLUMN fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;`,
    `CREATE TABLE IF NOT EXISTS sub_evaluacion (
        id_sub_evaluacion INT AUTO_INCREMENT PRIMARY KEY,
        id_evaluacion INT NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        porcentaje DECIMAL(5,2) NOT NULL,
        FOREIGN KEY (id_evaluacion) REFERENCES evaluacion(id_evaluacion) ON DELETE CASCADE
    );`,
    `CREATE TABLE IF NOT EXISTS sub_nota (
        id_sub_nota INT AUTO_INCREMENT PRIMARY KEY,
        id_sub_evaluacion INT NOT NULL,
        id_estudiante INT NOT NULL,
        calificacion DECIMAL(3,1) NOT NULL,
        FOREIGN KEY (id_sub_evaluacion) REFERENCES sub_evaluacion(id_sub_evaluacion) ON DELETE CASCADE,
        FOREIGN KEY (id_estudiante) REFERENCES estudiante(id_estudiante) ON DELETE CASCADE,
        UNIQUE(id_sub_evaluacion, id_estudiante)
    );`,
    `CREATE TABLE IF NOT EXISTS nota_recuperacion (
        id_nota_recuperacion INT AUTO_INCREMENT PRIMARY KEY,
        id_evaluacion INT NOT NULL,
        id_estudiante INT NOT NULL,
        calificacion DECIMAL(3,1) NOT NULL,
        fecha DATE NOT NULL,
        FOREIGN KEY (id_evaluacion) REFERENCES evaluacion(id_evaluacion) ON DELETE CASCADE,
        FOREIGN KEY (id_estudiante) REFERENCES estudiante(id_estudiante) ON DELETE CASCADE,
        UNIQUE(id_evaluacion, id_estudiante)
    );`
];

async function run() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'sistema_educativo'
    });

    for (let q of queries) {
        try {
            await connection.query(q);
            console.log('Executed:', q.substring(0, 50) + '...');
        } catch (e) {
            console.error('Error on query:', q.substring(0, 50) + '...', e.message);
        }
    }
    
    await connection.end();
    process.exit(0);
}

run();
