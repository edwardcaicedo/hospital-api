
const pool = require('../config/db');
const bcrypt = require('bcrypt');

async function listarUsuarios(pagina = 1, limite = 10){
   const offset = (pagina - 1) * limite;

   const lista = await pool.query(
        `SELECT id, nombre, email, rol
         FROM usuarios
         ORDER BY  id ASC
         LIMIT $1 OFFSET $2`, [limite, offset]
    );

    const totalResult = await pool.query(`SELECT COUNT(*) FROM usuarios`);
    const totalusuarios = parseInt(totalResult.rows[0].count, 10);

    return {
        usuarios: lista.rows,
        totalusuarios,
        paginaActual: Number(pagina),
        totalPaginas: Math.ceil(totalusuarios / limite)
    }
}

async function buscarUsuario(id){
    const buscar = await pool.query(
        `SELECT id, nombre, email, rol
        FROM usuarios
        WHERE id = $1`,
        [id]
    )
    return buscar.rows[0] || null;
}

async function crearUsuario(nombre, email, password, rol) {

    const buscarUsuario = await pool.query(
        `SELECT *
        FROM usuarios
        WHERE nombre = $1 
        AND email = $2
        `, [nombre, email]
    );

    if(buscarUsuario.rows.length > 0){
        return {
            error: 'usuario_existe'
        }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = await pool.query(
        `INSERT INTO usuarios (nombre, email, password, rol)
         VALUES ($1, $2, $3, $4)
         RETURNING id, nombre, email, rol`, 
        [nombre, email, passwordHash, rol]
    );

    return nuevoUsuario.rows[0];
}

async function usuarioModificado(id, nombre, email ,password, rol){

    const passwordHash = await bcrypt.hash(password, 10);
    
    const usuarioModificar = await pool.query(
        `UPDATE usuarios
        SET nombre = $1,
        email = $2,
        password = $3,
        rol = $4
        WHERE id = $5
        RETURNING *
        `,
        [nombre, email ,passwordHash, rol, id]
    );
    return usuarioModificar.rows[0] || null;
}

async function eliminarUsuario(id){
    const eliminarUsuario = await pool.query(
        `DELETE FROM usuarios
        WHERE id = $1
        RETURNING *
        `,
        [id]
    );

    return eliminarUsuario.rows[0] || null;
}


module.exports = {
    listarUsuarios,
    buscarUsuario,
    crearUsuario,
    usuarioModificado,
    eliminarUsuario
}