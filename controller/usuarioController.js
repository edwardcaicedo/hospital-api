
const service = require('../services/usuarioService');

async function listarUsuarios(req, res){
    
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const usuarios = await service.listarUsuarios(
        page,
        limit
    );

    return res.status(200).json({
        page,
        limit,
        ...usuarios
    });
}

async function buscarUsuario(req, res){
    const usuario = await service.buscarUsuario(req.validId);

    if(!usuario){
        return res.status(404).json({
            mensaje: 'usuario no encontrado'
        })
    }
    return res.status(200).json(usuario);
}

async function crearUsuario(req, res){
    const {nombre, email ,password, rol} = req.body;

    const nuevoUsuario = await service.crearUsuario(nombre, email ,password, rol);

    if(nuevoUsuario && nuevoUsuario.error  === 'usuario_existe'){
        return res.status(400).json({
            mensaje: 'El usuario ya esta creado'
        })
    }
    return res.status(201).json(nuevoUsuario)
}

async function usuarioModificado(req, res) {

    const { nombre, email, password, rol } = req.body;

    const usuario = await service.usuarioModificado(
        req.validId,
        nombre,
        email,
        password,
        rol
    );

    if (!usuario) {
        return res.status(404).json({
            mensaje: 'Usuario no encontrado'
        });
    }

    return res.status(200).json(usuario);
}
async function eliminarUsuario(req, res){
    const usuario = await service.eliminarUsuario(req.validId);

    if(!usuario){
        return res.status(404).json({
            mensaje: 'Usuario no existe'
        })
    }

    return res.status(200).json({
        mensaje: 'Usuario Eliminado exitosoamente!!'
    })
}


module.exports = {
    listarUsuarios,
    buscarUsuario,
    crearUsuario,
    usuarioModificado,
    eliminarUsuario
}