
class Estudiante{

    constructor(id_estudiante, rut, nombre, apellido, correo, carrera, fecha_ingreso, estado, foto){
        this.id_estudiante = id_estudiante;
        this.rut = rut;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.carrera = carrera;
        this.fecha_ingreso = fecha_ingreso;
        this.estado = estado;
        this.foto = foto;
    }
}


module.exports = Estudiante;
