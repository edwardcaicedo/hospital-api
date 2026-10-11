
const service = require('../services/doctoresService');

async function listarDoctores(req, res){
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const doctores = await service.listarDoctores(
        page,
        limit
    )

    return res.status(200).json({
        page,
        limit,
        ...doctores
    })
}

async function listarDoctoresEspecialidad(req, res){

    const {especialidad} = req.params;

    const resultado = await service.listarDoctoresEspecialidad(especialidad);

    if(resultado.error === 'especialidad_doctores') {
        return res.status(404).json({
            mensaje: 'No hay doctores en esta especialidad'
        })
    }

    return res.status(200).json(resultado)

}


async function buscarDoctor(req, res){
    const doctor = await service.buscarDoctor(req.validId);

    if(!doctor){
        return res.status(404).json({mensaje: 'Doctor no encontrado'})
    }
    return res.status(200).json(doctor);
}

async function crearDoctor(req, res){
    const {nombre, especialidad, edad, ciudad} = req.body;
    const doctor = await service.crearDoctor(nombre, especialidad, edad, ciudad);

    if(doctor && doctor.error === 'doctor_existe'){
        return res.status(400).json({
            mensaje: 'Doctor ya fue creado'
        })
    }

    return res.status(201).json(doctor);
}

async function modificarDoctor(req, res){
    const {nombre, especialidad, edad, ciudad} = req.body;

    const doctor = await service.modificarDoctor(req.validId, nombre, especialidad, edad, ciudad);

    if(!doctor){
        return res.status(404).json({mensaje: 'Doctor no existe'})
    }
    return res.status(200).json(doctor);
}

async function eliminarDoctor(req, res){
    const resultado = await service.eliminarDoctor(req.validId);

    if(resultado && resultado.error === 'citas_pendientes'){
        return res.status(400).json({
            mensaje: 'No se puede eliminar: El doctor tiene citas pendientes asociadas'
        })
    }

    if(!resultado){
        return res.status(404).json({
            mensaje: 'Doctor no existe'
        })
    }

    return res.status(200).json({
        mensaje: 'doctor eliminado exitosamente',
        doctor: resultado
    })
}
module.exports = {
    listarDoctores,
    listarDoctoresEspecialidad,
    buscarDoctor,
    crearDoctor,
    modificarDoctor,
    eliminarDoctor
}

/*
{
    "nombre": "hhadmin@gmail.com",
    "password": "12345hh"
}
    */