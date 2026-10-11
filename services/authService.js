const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function login(email, password) {

    const resultado = await pool.query(
        `SELECT * FROM usuarios 
         WHERE email = $1`,
        [email]
    );

    if (resultado.rows.length === 0) {
        return null;
    }

    const usuario = resultado.rows[0];

    const passwordCorrecta = await bcrypt.compare(
        password,
        usuario.password
    );

    if (!passwordCorrecta) {
        return null;
    }

    const token = jwt.sign(
        {
            id: usuario.id,
            rol: usuario.rol
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        }
    );

    delete usuario.password;

    return {
        usuario,
        token
    };
}

module.exports = {
    login
};