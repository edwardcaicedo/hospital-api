const pool = require('../config/db');

async function listarDoctores(page, limit){
   
    const offset = (page - 1) * limit;

    const resultado = await pool.query(
        `SELECT *
        FROM doctores
        ORDER BY id ASC
        LIMIT $1 OFFSET $2
        `, [limit, offset]
    );

    const totalResultado = await pool.query(
        `SELECT COUNT(*)
        FROM doctores`
    )

    const totalDoctores = Number(
        totalResultado.rows[0].count
    )

    const totalPaginas = Math.ceil(
        totalDoctores / limit
    )

    return {
        doctores: resultado.rows,
        totalDoctores,
        totalPaginas
    }
}

async function listarDoctoresEspecialidad(especialidad){

    const resultado = await pool.query(
        `SELECT *
        FROM doctores
        WHERE especialidad ILIKE $1
        `, [`%${especialidad}%`]
    );

    if(resultado.rows.length === 0){
        return {error: 'especialidad_doctores'}
    }

    return resultado.rows;
}

async function buscarDoctor(id){
    const resultado = await pool.query('SELECT * FROM doctores WHERE id = $1', [id]);
    return resultado.rows[0] || null;
}

async function crearDoctor(nombre, especialidad, edad, ciudad){

    const buscarDoctor = await pool.query(
        `SELECT * from doctores
        where nombre = $1
        AND ciudad = $2
        `, [nombre, ciudad]
    );

    if(buscarDoctor.rows.length > 0){
        return {
            error: "doctor_existe"
        }
    }
    const resultado = await pool.query(
        `INSERT INTO doctores(nombre, especialidad, edad, ciudad)
         VALUES($1, $2, $3, $4)
         RETURNING *`,
        [nombre, especialidad, edad, ciudad]
    );
    return resultado.rows[0];
}

async function modificarDoctor(id, nombre, especialidad, edad, ciudad){

    const resultado = await pool.query(
        `UPDATE doctores
         SET nombre = $1,
             especialidad = $2,
             edad = $3,
             ciudad = $4
         WHERE id = $5
         RETURNING *`,
        [nombre, especialidad, edad, ciudad, id]
    );
    return resultado.rows[0] || null;
}

async function eliminarDoctor(id){

    const buscarCitas = await pool.query(
        `SELECT *
        FROM citas
        WHERE doctor_id = $1`,
        [id]
    );

    if(buscarCitas.rows.length > 0){
        return {
            error: "citas_pendientes"
        }
    }
    const resultado = await pool.query(
        `DELETE FROM doctores
         WHERE id = $1
         RETURNING *`,
        [id]
    );
    return resultado.rows[0] || null;
}

module.exports = {
    listarDoctores,
    listarDoctoresEspecialidad,
    crearDoctor,
    modificarDoctor,
    buscarDoctor,
    eliminarDoctor
};