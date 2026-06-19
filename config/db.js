const mysql2 = require('mysql2');
const db= mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sistema_educativo'
});

db.connect((err)=>{
    if(err){
        console.log('error de bd', err.message);
    }else{
        console.log('conectado a la bd');
    }
});

module.exports = db;