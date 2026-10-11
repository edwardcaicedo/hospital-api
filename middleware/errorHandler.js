function errorHandler(error, req, res, next) {
    console.log(error);

    if(error.code === '23505'){
        return res.status(409).json({
            mensaje: 'El recurso ya existe'
        });
    }

    if(error.code === '23502'){
        return res.status(400).json({
            mensaje: 'Falta un campo obligatorio'
        });
    }

    if(error.code === '23503'){
        return res.status(409).json({
            mensaje: 'No se puede realizar la operación porque existe una relación inválida'
        });
    }

    const respuesta = {
        mensaje: 'Error interno del servidor'
    }

    if(process.env.NODE_ENV === 'development'){
        respuesta.error = error.message;
        respuesta.stack = error.stack;
    }

    return res.status(500).json(respuesta);
}

function validarPacienteMiddleware(req, res, next) {
    const { nombre, edad, ciudad } = req.body;
    if (!nombre || edad === undefined || !ciudad) {
        return res.status(400).json({
            mensaje: 'Todos los campos son obligatorios'
        });
    }
    if (typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({
            mensaje: 'El nombre debe ser un texto válido'
        });
    }
    if (typeof ciudad !== 'string' || ciudad.trim() === '') {
        return res.status(400).json({
            mensaje: 'La ciudad debe ser un texto válido'
        });
    }
    if (typeof edad !== 'number' || edad <= 0) {
        return res.status(400).json({
            mensaje: 'La edad debe ser un número mayor a 0'
        });
    }
    next();
}

function validarDoctoresMiddleware(req, res, next){
    const {nombre, especialidad, edad, ciudad} = req.body;
    
    if(!nombre || !especialidad || edad === undefined || !ciudad){
        return res.status(400).json({
            mensaje: 'Todos los campos son obligatorios'
        });
    }

    if(typeof nombre !== 'string' || nombre.trim() === ''){
        return res.status(400).json({
            mensaje: 'El nombre debe ser un texto valido'
        })
    }

    if(typeof especialidad !== 'string' || especialidad.trim() === ''){
        return res.status(400).json({
            mensaje: 'La especialidad debe ser un texto valido'
        })
    }

    if(typeof edad !== 'number' || edad <= 0){
        return res.status(400).json({
            mensaje: 'La edad deber ser un numero mayor 0'
        })
    }

    if(typeof ciudad !== 'string' || ciudad.trim() === ''){
        return res.status(400).json({
            mensaje: 'La ciudad debe ser un texto valido'
        })
    }

    next();
}

function validarCitasMiddleware(req, res, next){
    const {paciente_id, doctor_id, fecha, estado} = req.body;

    if(paciente_id === undefined || doctor_id === undefined || fecha === undefined || !estado){
        return res.status(400).json({
            mensaje: 'Todos los campos son obligatorios'
        });
    }

    if(typeof paciente_id !== 'number' || paciente_id <= 0){
        return res.status(400).json({
            mensaje: 'El paciente_id deber ser un numero mayor a 0'
        })
    }

    if(typeof doctor_id !== 'number' || doctor_id <= 0){
        return res.status(400).json({
            mensaje: 'El doctor_id deber ser un numero mayor a 0'
        })
    }

    if(typeof fecha !== 'string' || fecha.trim() === ''){
        return res.status(400).json({
            mensaje: 'La fecha debe ser un texto valido'
        })
    }

    if(typeof estado !== 'string' || estado.trim() === ''){
        return res.status(400).json({
            mensaje: 'El estado debe ser un texto valido'
        })
    }

    next();
}



function validarNombreMiddleware(req, res, next) {
    const { nombre } = req.params; // Se obtiene de req.params
    
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
        return res.status(400).json({
            mensaje: 'El nombre debe ser un texto válido'
        });
    }
    next();
}


module.exports = {
    errorHandler,
    validarPacienteMiddleware,
    validarDoctoresMiddleware,
    validarCitasMiddleware,
    validarNombreMiddleware,
    
};