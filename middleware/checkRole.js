function checkRole(rolesPermitidos) {

    return function(req, res, next) {

        const rolUsuario = req.usuario.rol;

        if (!rolesPermitidos.includes(rolUsuario)) {
            return res.status(403).json({
                mensaje: 'No tienes permisos para realizar esta acción'
            });
        }

        next();
    };
}

module.exports = {
    checkRole
};