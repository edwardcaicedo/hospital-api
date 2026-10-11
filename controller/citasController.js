
const services = require('../services/citasService');


async function listarCitas(req, res){
    const citas = await services.listarCitas();
    return res.status(200).json(citas);
}

async function buscarCitas(req, res){
    const cita = await services.buscarCitas(req.validId);
    if(!cita){
        return res.status(404).json({
            mensaje: 'Cita no encontrada'
        })
    }

    return res.status(200).json(cita)
}

async function crearCita(req, res){
    const {paciente_id, doctor_id, fecha, estado} = req.body;

    const cita = await services.crearCita(paciente_id, doctor_id, fecha, estado);

    if(cita && cita.error === 'paciente_no_existe'){
        return res.status(404).json({mensaje: 'el paciente no existe'})
    }

    if(cita && cita.error === 'doctor_no_existe'){
        return res.status(404).json({mensaje: 'el doctor no existe'})
    }
    if(cita && cita.error === 'cita_duplicada'){
        return res.status(409).json({mensaje: 'Este paciente ya tiene una cita asignada para esta fecha'})
    }


    return res.status(201).json(cita)
}

async function modificarCita(req, res) {
    
    const {paciente_id, doctor_id, fecha, estado} = req.body;

    const cita = await services.modificarCita(req.validId,paciente_id, doctor_id, fecha, estado);

    if(!cita){
        return res.status(404).json({
            mensaje: 'Cita no existe'
        })
    }
    return res.status(200).json(cita)
}

async function eliminarCita(req, res) {
    const cita = await services.eliminarCita(req.validId);
    if(!cita){
        return res.status(404).json({
            mensaje: 'Cita no existe'
        })
    }

    return res.status(200).json({
        mensaje: 'Cita eliminada!!'
    })
}


async function buscarCitasPorNombrePaciente(req, res) {
    const { nombre } = req.params; // Se obtiene de req.params
    const consulta = await services.buscarCitasXNombre(nombre);

   
    if (!consulta || consulta.length === 0) {
        return res.status(404).json({
            mensaje: 'El cliente no tiene citas registradas'
        });
    }

    return res.status(200).json(consulta);
}

async function buscarCitasPorNombreDoctor(req, res){
    const {nombre} = req.params;
    const consulta = await services.buscarCitasDoctor(nombre);

    if(!consulta || consulta.length === 0){
        return res.status(404).json({
            mensaje: 'El doctor no tiene citas asignada'
        })
    }

    return res.status(200).json(consulta);
}

module.exports = {
    listarCitas,
    buscarCitas,
    crearCita,
    modificarCita,
    eliminarCita,
    buscarCitasPorNombrePaciente,
    buscarCitasPorNombreDoctor
}
