const pool = require('../config/db');

async function listarPacientes(page, limit) {

    const offset = (page - 1) * limit;

    const resultado = await pool.query(
        `SELECT *
        FROM pacientes
        ORDER BY id ASC
        LIMIT $1 OFFSET $2
        `, [limit, offset]
    );

    const totalResultado = await pool.query(
        `SELECT COUNT(*)
        FROM pacientes;
        `
    )

    const totalPacientes = Number(
        totalResultado.rows[0].count
    )
   
    const totalPaginas = Math.ceil(
        totalPacientes / limit
    )
  return {
    pacientes: resultado.rows,
    totalPacientes,
    totalPaginas
  }
}

async function listaPacienteCiudad(ciudad) {
  const resultado = await pool.query(
    `SELECT *
     FROM pacientes
     WHERE ciudad ILIKE $1`,
    [`%${ciudad}%`]
  );

  if (resultado.rows.length === 0) {
    return { error: 'pacientes_ciudad' };
  }

  return resultado.rows;
}

async function buscarPaciente(id) {

    const resultado = await pool.query(
        'SELECT * FROM pacientes WHERE id = $1',
        [id]
    );

    return resultado.rows[0] || null;
}

async function crearPaciente(nombre, edad, ciudad) {

    const buscarPaciente = await pool.query(
        `SELECT *
        FROM pacientes 
        WHERE nombre = $1
        AND ciudad = $2
        `,[nombre, ciudad]
    );

    if(buscarPaciente.rows.length > 0){
        return {
            error: 'paciente_existe'
        }
    }
    const resultado = await pool.query(
        `INSERT INTO pacientes(nombre, edad, ciudad)
         VALUES($1, $2, $3)
         RETURNING *`,
        [nombre, edad, ciudad]
    );

    return resultado.rows[0];
}

async function modificarPaciente(id, nombre, edad, ciudad) {

    const resultado = await pool.query(
        `UPDATE pacientes
         SET nombre = $1,
             edad = $2,
             ciudad = $3
         WHERE id = $4
         RETURNING *`,
        [nombre, edad, ciudad, id]
    );

    return resultado.rows[0] || null;
}

async function eliminarPaciente(id) {

    const buscarCitas = await pool.query(
        `SELECT *
        FROM citas
        WHERE paciente_id = $1
        `,[id]
    );

    if(buscarCitas.rows.length > 0){
        return {
            error: "citas_pendientes"
        }
    }

    const resultado = await pool.query(
        `DELETE FROM pacientes
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return resultado.rows[0] || null;
}

module.exports = {
    listarPacientes,
    buscarPaciente,
    listaPacienteCiudad,
    crearPaciente,
    modificarPaciente,
    eliminarPaciente
};