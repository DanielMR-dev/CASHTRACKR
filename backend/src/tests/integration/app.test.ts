import request from 'supertest';
import server from '../../server';
import { connectDB } from '../../server';
import { db } from '../../config/db';
import { AuthController } from '../../controllers/AuthController';
import { not } from 'supertest/lib/cookies';

describe('Authentication - Create Account', () => {
    beforeAll(async () => {
        await connectDB();
    });

    afterAll(async () => {
        await db.close(); // <-- Cerrar el pool de conexiones al terminar
    });
    
    test('Should return 400 status code error when form is empty', async () => {
        const response = await request(server)
                                    .post('/api/auth/create-account')
                                    .send({});
        const mockCreateAccount = jest.spyOn(AuthController, 'createAccount');
        const data = response.body;

        expect(response.statusCode).toBe(400);
        expect(data).toHaveProperty('errors');
        expect(data.errors).toHaveLength(3);
        expect(response.statusCode).not.toBe(201);
        expect(mockCreateAccount).not.toHaveBeenCalled();
    });

    test('Should return 400 status code error when the email is invalid', async () => {
        const response = await request(server)
                                    .post('/api/auth/create-account')
                                    .send({
                                        name : "Test name",
                                        password : "test_password",
                                        email : "not_valid_email"
                                    });
        const mockCreateAccount = jest.spyOn(AuthController, 'createAccount');
        const data = response.body;

        expect(response.statusCode).toBe(400);
        expect(data).toHaveProperty('errors');
        expect(data.errors).toHaveLength(1);
        expect(data.errors[0].msg).toStrictEqual('Email no válido');
        expect(response.statusCode).not.toBe(201);
        expect(mockCreateAccount).not.toHaveBeenCalled();
    });

    test('Should return 400 status code error when the password is less than 8 characters', async () => {
        const response = await request(server)
                                    .post('/api/auth/create-account')
                                    .send({
                                        name : "Test name",
                                        password : "test",
                                        email : "test@test.com"
                                    });
        const mockCreateAccount = jest.spyOn(AuthController, 'createAccount');
        const data = response.body;

        expect(response.statusCode).toBe(400);
        expect(data).toHaveProperty('errors');
        expect(data.errors).toHaveLength(1);
        expect(data.errors[0].msg).toStrictEqual('La contraseña debe tener al menos 8 caracteres');
        expect(response.statusCode).not.toBe(201);
        expect(mockCreateAccount).not.toHaveBeenCalled();
    });
});