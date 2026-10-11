
function validarIdMiddleware(req, res, next) {
    const id = Number(req.params.id);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({
            mensaje: 'El id proporcionado no es un número mayor a 0'
        });
    }

    req.validId = id;
    next();
}

module.exports = {
    validarIdMiddleware
}