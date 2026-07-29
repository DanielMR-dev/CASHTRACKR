import request from 'supertest';
import server from '../../server';
import { connectDB } from '../../server';
import { db } from '../../config/db';

describe('Authentication - Create Account', () => {
    beforeAll(async () => {
        await connectDB();
    });

    afterAll(async () => {
        await db.close(); // <-- Cerrar el pool de conexiones al terminar
    });
    
    test('Should display validation errors when form is empty', async () => {
        const response = await request(server)
                                    .post('/api/auth/create-account')
                                    .send({});

        const data = response.body;

        expect(response.statusCode).toBe(400);
        expect(data).toHaveProperty('errors');
        expect(data.errors).toHaveLength(3);
        expect(response.statusCode).not.toBe(201);
    });
});