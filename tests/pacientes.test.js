const request = require('supertest');
const app = require('../app');
const pool = require('../config/db');

describe('GET /pacientes', () => {

    test('debería responder con status 200', async () => {

        const respuesta = await request(app)
            .get('/pacientes');

        expect(respuesta.status).toBe(200);
    });

});

describe('POST /citas', () => {

    test('debería responder con estatus 409', async () => {

        const datos = {
            paciente_id: 7,
            doctor_id: 6,
            fecha: '2027-01-10',
            estado: 'pendiente'
        };

        const respuesta = await request(app)
            .post('/citas')
            .send(datos);

        expect(respuesta.status).toBe(409);
    });

});

afterAll(async () => {
    await pool.end();
});