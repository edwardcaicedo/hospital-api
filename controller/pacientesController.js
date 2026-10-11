const service = require('../services/pacientesService');

async function listarPacientes(req, res) {
    
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;



    const pacientes = await service.listarPacientes(
        page,
        limit
    );

    return res.status(200).json({
        page,
        limit,
        ...pacientes
    });
}


async function listarPacienteCiudad(req, res) {
  const { ciudad } = req.params;

  const resultado = await service.listaPacienteCiudad(ciudad);

  if (resultado.error === 'pacientes_ciudad') {
    return res.status(404).json({
      mensaje: 'No hay pacientes registrados en la ciudad'
    });
  }

  return res.status(200).json(resultado);
}


async function buscarPaciente(req, res) {
    const paciente = await service.buscarPaciente(req.validId);
    if (!paciente) {
        return res.status(404).json({ mensaje: 'Paciente no encontrado' });
    }
    return res.status(200).json(paciente);
}

async function crearPaciente(req, res) {
    const { nombre, edad, ciudad } = req.body;
    const paciente = await service.crearPaciente(nombre, edad, ciudad);

    if(paciente && paciente.error === 'paciente_existe'){
        return res.status(400).json({
            mensaje: 'Paciente ya fue creado'
        })
    }
    return res.status(201).json(paciente);
}

async function modificarPaciente(req, res) {
    const { nombre, edad, ciudad } = req.body;
    
    const paciente = await service.modificarPaciente(req.validId, nombre, edad, ciudad);
    if (!paciente) {
        return res.status(404).json({ mensaje: 'Paciente no existe' });
    }
    
    return res.status(200).json(paciente);
}

async function eliminarPaciente(req, res) {
    const resultado = await service.eliminarPaciente(req.validId);

    
    if (resultado && resultado.error === 'citas_pendientes') {
        return res.status(400).json({
            mensaje: 'No se puede eliminar: El paciente tiene citas pendientes asociadas'
        });
    }


    if (!resultado) {
        return res.status(404).json({
            mensaje: 'El paciente no existe'
        });
    }

    return res.status(200).json({
        mensaje: 'Paciente eliminado exitosamente',
        paciente: resultado
    });
}
module.exports = {
    listarPacientes,
    listarPacienteCiudad,
    buscarPaciente,
    crearPaciente,
    modificarPaciente,
    eliminarPaciente
}