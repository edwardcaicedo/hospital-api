const authService = require('../services/authService');

async function login(req, res) {
    const { email, password } = req.body;
    const usuario = await authService.login(email, password);

    if(!usuario){
        return res.status(401).json({
            mensaje: 'Credenciales inválidas (email o contraseña incorrectos)'
        });
    }

    return res.status(200).json({
        mensaje: 'Inicio de sesión exitoso',
        usuario: usuario.usuario,
        token: usuario.token
    });
}


module.exports = {
    login
}