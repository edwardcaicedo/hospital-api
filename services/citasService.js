
const pool = require('../config/db');

async function listarCitas(page, limit){

    const offset = (page - 1) * limit;

    const resultado = await pool.query(
        `
        SELECT *
        FROM citas
        ORDER BY id ASC
        LIMIT $1 OFFSET $2
        `, [limit, offset]
    )

    const totalResultado = await pool.query(
        `
        SELECT COUNT(*)
        FROM citas
        `
    )

    const totalCitas = Number(
        totalResultado.rows[0].count
    )

    const totalPaginas = Math.ceil(
        totalCitas / limit
    )
    return {
        citas: resultado.rows,
        totalCitas,
        totalPaginas
    }
}

async function buscarCitas(id){
    const resultado = await pool.query (
        `SELECT * 
        FROM citas 
        WHERE id = $1
        `,
        [id]
    )

    return resultado.rows[0] || null;
}

async function crearCita(paciente_id, doctor_id, fecha, estado){

    const buscarPaciente = await pool.query (
        `SELECT *
        FROM pacientes
        WHERE id = $1
        `, [paciente_id]
    )
    if (buscarPaciente.rows.length === 0){
        return {
            error: 'paciente_no_existe'
        }
    }

    const buscarDoctor = await pool.query(
        `SELECT *
        FROM doctores
        WHERE id = $1
        `,[doctor_id]
    )
    if(buscarDoctor.rows.length === 0){
        return {
            error: 'doctor_no_existe'
        }
    }
    const buscarCitas = await pool.query(
        `SELECT *
        FROM citas 
        WHERE (paciente_id = $1 OR doctor_id = $2)
        AND fecha = $3
        `, [paciente_id, doctor_id, fecha]
    );

    if(buscarCitas.rows.length > 0){
        return {
            error: 'cita_duplicada'
        }
    }
    const resultado = await pool.query(
        `INSERT INTO citas(paciente_id, doctor_id, fecha, estado)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [paciente_id, doctor_id, fecha, estado]
    );
    return resultado.rows[0];
}

async function modificarCita(id, paciente_id, doctor_id, fecha, estado) {
    const resultado = await pool.query (
        `UPDATE citas
          SET paciente_id = $1,
             doctor_id = $2,
             fecha = $3,
             estado = $4
            WHERE id = $5
            RETURNING *
        `,
        [paciente_id, doctor_id, fecha, estado, id]
    );

    return resultado.rows[0] || null;
}

async function eliminarCita(id){

    const resultado = await pool.query(
        `DELETE FROM citas
         WHERE id = $1
         RETURNING *
         `,
         [id]
    )
    return resultado.rows[0] || null;
}

async function buscarCitasPorNombrePaciente(nombre){
    const resultado = await pool.query(
        `SELECT 
            c.id AS cita_id,
            p.nombre AS paciente_nombre, 
            d.nombre AS doctor_nombre, 
            c.fecha, 
            c.estado
            FROM pacientes p
            INNER JOIN citas c ON p.id = c.paciente_id
            INNER JOIN doctores d ON c.doctor_id = d.id
         WHERE p.nombre ILIKE $1`,
        [`%${nombre}%`]
    );
    return resultado.rows;
}

async function buscarCitasPorNombreDoctor(nombre){
    const consulta = await pool.query(
        `SELECT d.nombre, p.nombre, c.fecha, c.estado
        from citas c
        inner join pacientes p on c.paciente_id = p.id
        inner join doctores d on c.doctor_id = d.id
        where d.nombre ILIKE $1`,
        [`%${nombre}%`]
    );
    return consulta.rows;
}

module.exports = {
    listarCitas,
    buscarCitas,
    crearCita,
    modificarCita,
    eliminarCita,
    buscarCitasPorNombrePaciente,
    buscarCitasPorNombreDoctor
}
