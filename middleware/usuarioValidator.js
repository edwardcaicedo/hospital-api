function validarUsuarioMiddleware(req, res, next){
    const {nombre, email ,password, rol} = req.body;

    if(!nombre || !email || !password || !rol){
        return res.status(400).json({
            mensaje: 'Todos los campos son obligatorios'
        });
    }

    if(typeof nombre !== 'string' || nombre.trim() === ''){
        return res.status(400).json({
            mensaje: 'El nombre debe ser un texto valido'
        })
    }

    if(typeof email !== 'string' || email.trim() === ''){
        return res.status(400).json({
            mensaje: 'El email debe ser un texto valido'
        })
    }

    if(typeof password !== 'string' || password.trim() === ''){
        return res.status(400).json({
            mensaje: 'El password debe ser un texto valido'
        })
    }
    
    if(typeof rol !== 'string' || rol.trim() === ''){
        return res.status(400).json({
            mensaje: 'El rol debe ser un texto valido'
        })
    }

    next();
}

module.exports = {
    validarUsuarioMiddleware
}