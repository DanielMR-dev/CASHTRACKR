import request from 'supertest';
import server from '../../server';
import { connectDB } from '../../server';
import { db } from '../../config/db';
import { AuthController } from '../../controllers/AuthController';

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await db.close(); 
});
    
describe('Authentication - Create Account', () => {
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
        const userData = {
            name : "Test name",
            password : "test_password",
            email : "not_valid_email"
        };
        const response = await request(server)
                                    .post('/api/auth/create-account')
                                    .send(userData);
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
        const userData = {
            name : "Test name",
            password : "test",
            email : "test@test.com"
        };
        const response = await request(server)
                                    .post('/api/auth/create-account')
                                    .send(userData);
        const mockCreateAccount = jest.spyOn(AuthController, 'createAccount');
        const data = response.body;

        expect(response.statusCode).toBe(400);
        expect(data).toHaveProperty('errors');
        expect(data.errors).toHaveLength(1);
        expect(data.errors[0].msg).toStrictEqual('La contraseña debe tener al menos 8 caracteres');
        expect(response.statusCode).not.toBe(201);
        expect(mockCreateAccount).not.toHaveBeenCalled();
    });

    test('Should return 201 status code success when user is created', async () => {
        const userData = {
            name : "Test name",
            password : "test_password",
            email : "test@test.com"
        };
        const response = await request(server)
                                    .post('/api/auth/create-account')
                                    .send(userData);
        const data = response.body;

        expect(response.statusCode).toBe(201);
        expect(data).toHaveProperty('message');
        expect(data.message).toBe('¡Tu cuenta ha sido creada correctamente!');
        expect(response.statusCode).not.toBe(400);
        expect(data).not.toHaveProperty('errors');
    });

    test('Should return 409 status code when a user is already registered', async () => {
        const userData = {
            name : "Test name",
            password : "test_password",
            email : "test@test.com"
        };
        const response = await request(server)
                                    .post('/api/auth/create-account')
                                    .send(userData);
        const data = response.body;

        expect(response.statusCode).toBe(409);
        expect(data).toHaveProperty('error');
        expect(data.error).toStrictEqual('Un usuario con ese email ya existe');
        expect(response.statusCode).not.toBe(201);
        expect(response.statusCode).not.toBe(400);
        expect(data).not.toHaveProperty('errors');
    });
});

describe('Authentication - Confirm Account', () => {
    test('Should return 400 status code error if token is empty or not valid', async () => {
        const userData = {
            token : "not_valid_token"
        };
        const response = await request(server)
                                    .post('/api/auth/confirm-account')
                                    .send(userData);
        const data = response.body;

        expect(response.statusCode).toBe(400);
        expect(data).toHaveProperty('errors');
        expect(data.errors).toHaveLength(1);
        expect(data.errors[0].msg).toStrictEqual('Token no válido');
        expect(response.statusCode).not.toBe(201);
    });

    test('Should return 401 status code error if token does not match any token', async () => {
        const userData = {
            token : "123456"
        };
        const response = await request(server)
                                    .post('/api/auth/confirm-account')
                                    .send(userData);
        const data = response.body;

        expect(response.statusCode).toBe(401);
        expect(data).toHaveProperty('error');
        expect(data.error).toStrictEqual('Token no válido');
        expect(response.statusCode).not.toBe(200);
    });

    test('Should return 200 status code success when token is valid', async () => {
        const userData = {
            token : (globalThis as unknown as { cashTrackrConfirmationToken: string }).cashTrackrConfirmationToken
        };
        const response = await request(server)
                                    .post('/api/auth/confirm-account')
                                    .send(userData);
        const data = response.body;

        expect(response.statusCode).toBe(200);
        expect(data).toHaveProperty('message');
        expect(data.message).toStrictEqual('¡Tu cuenta ha sido confirmada correctamente!');
        expect(response.statusCode).not.toBe(401);
        expect(data).not.toHaveProperty('error');
    });
});