const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // ¿cuántos minutos?
    max: 3,                   // ¿cuántos intentos?
    message: {
        mensaje: 'Demasiados intentos de inicio de sesión, intenta de nuevo más tarde'
    }
});

module.exports = loginLimiter;