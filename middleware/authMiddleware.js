
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            mensaje: 'Token no proporcionado'
        });
    }

    const partes = authHeader.split(' ');

    const tipo = partes[0];
    const token = partes[1];

    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({
            mensaje: 'Formato de token inválido'
        });
    }
    try {
            console.log('Token recibido:', JSON.stringify(token));
            console.log('Longitud del token:', token.length);
            console.log('JWT_SECRET usado para verificar:', JSON.stringify(process.env.JWT_SECRET));

            const usuario = jwt.verify(token, process.env.JWT_SECRET);
            req.usuario = usuario;
            next();

    } catch (error) {
            console.log('Error de JWT:', error.name, '-', error.message);
            return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
}

module.exports = authMiddleware;