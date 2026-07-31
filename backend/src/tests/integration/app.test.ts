import request from 'supertest';
import server from '../../server';
import { connectDB } from '../../server';
import { db } from '../../config/db';
import { AuthController } from '../../controllers/AuthController';
import { AuthEmail } from '../../emails/AuthEmail';
import User from '../../models/User';
import * as authUtils from '../../utils/auth';
import * as jwtUtils from '../../utils/jwt';

beforeAll(async () => {
    await connectDB();
    jest.spyOn(AuthEmail, 'sendConfirmationEmail').mockImplementation(() => Promise.resolve());
    jest.spyOn(AuthEmail, 'sendPasswordResetToken').mockImplementation(() => Promise.resolve());
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
            password : "password",
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
        const mockConfirmAccount = jest.spyOn(AuthController, 'confirmAccount');
        const data = response.body;

        expect(response.statusCode).toBe(400);
        expect(data).toHaveProperty('errors');
        expect(data.errors).toHaveLength(1);
        expect(data.errors[0].msg).toStrictEqual('Token no válido');
        expect(mockConfirmAccount).not.toHaveBeenCalled();
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

describe('Authentication - Login', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should return 400 status code error when form is empty', async () => {
        const userData = {};
        const response = await request(server)
                                    .post('/api/auth/login')
                                    .send(userData);
        const mockLogin = jest.spyOn(AuthController, 'login');
        const data = response.body;

        expect(response.statusCode).toBe(400);
        expect(data).toHaveProperty('errors');
        expect(data.errors).toHaveLength(2);
        expect(mockLogin).not.toHaveBeenCalled();
        expect(response.statusCode).not.toBe(200);
        expect(data.errors).not.toHaveLength(1);
        expect(data.errors).not.toHaveLength(3);
    });
    
    test('Should return 400 status code error when the email is invalid', async () => {
        const userData = {
            password : "test_password",
            email : "not_valid"
        };
        const response = await request(server)
                                    .post('/api/auth/login')
                                    .send(userData);
        const mockLogin = jest.spyOn(AuthController, 'login');
        const data = response.body;

        expect(response.statusCode).toBe(400);
        expect(data).toHaveProperty('errors');
        expect(data.errors).toHaveLength(1);
        expect(data.errors[0].msg).toStrictEqual('Email no válido');
        expect(mockLogin).not.toHaveBeenCalled();
        expect(response.statusCode).not.toBe(200);
        expect(data.errors).not.toHaveLength(2);
    });

    test('Should return 404 status code error when the user is not found', async () => {
        const userData = {
            password : "test_password",
            email : "test_not_found@test.com"
        };
        const response = await request(server)
                                    .post('/api/auth/login')
                                    .send(userData);
        const data = response.body;

        expect(response.statusCode).toBe(404);
        expect(data).toHaveProperty('error');
        expect(data.error).toStrictEqual('Usuario no encontrado');
        expect(response.statusCode).not.toBe(200);
        expect(data).not.toHaveProperty('errors');
    });

    test('Should return 403 status code error when the user is not confirmed', async () => {
        (jest.spyOn(User, 'findOne') as jest.Mock)
            .mockResolvedValue({
                id : 1,
                name : "test_name",
                email : "test_not_confirmed@test.com",
                password : "hashed_password",
                confirmed : false
            });
        const userData = {
            password : "test_password",
            email : "test_not_confirmed@test.com"
        };
        const response = await request(server)
                                    .post('/api/auth/login')
                                    .send(userData);
        const data = response.body;

        expect(response.statusCode).toBe(403);
        expect(data).toHaveProperty('error');
        expect(data.error).toStrictEqual('Tu cuenta no ha sido confirmada');
        expect(response.statusCode).not.toBe(200);
        expect(response.statusCode).not.toBe(404);
        expect(data).not.toHaveProperty('errors');
    });

    test('Should return 401 status code error when the password is wrong', async () => {
        const findOne = (jest.spyOn(User, 'findOne') as jest.Mock).mockResolvedValue({
            id: 1,
            name: "Test",
            password: "hashed_password",
            confirmed: true
        });
        const userData = {
            password : "wrong_password",
            email : "test_wrong_password@test.com"
        };

        const checkPassword = jest.spyOn(authUtils, 'checkPassword').mockResolvedValue(false);
        const response = await request(server)
                                    .post('/api/auth/login')
                                    .send(userData);
        const data = response.body;

        expect(response.statusCode).toBe(401);
        expect(data).toHaveProperty('error');
        expect(data.error).toStrictEqual('Password Incorrecto');
        expect(response.statusCode).not.toBe(200);
        expect(response.statusCode).not.toBe(404);
        expect(data).not.toHaveProperty('errors');
        expect(findOne).toHaveBeenCalledTimes(1);
        expect(checkPassword).toHaveBeenCalledTimes(1);
    });

    test('Should return 200 status code success when the password is correct', async () => {
        const findOne = (jest.spyOn(User, 'findOne') as jest.Mock).mockResolvedValue({
            id: 1,
            name: "Test",
            password: "hashed_password",
            confirmed: true
        });
        const userData = {
            password : "correct_password",
            email : "test_correct_password@test.com"
        };

        const checkPassword = jest.spyOn(authUtils, 'checkPassword').mockResolvedValue(true);
        const generateJWT = jest.spyOn(jwtUtils, 'generateJWT').mockReturnValue("test_token");
        const response = await request(server)
                                    .post('/api/auth/login')
                                    .send(userData);
        const data = response.body;

        expect(response.statusCode).toBe(200);
        expect(data).toStrictEqual('test_token');
        expect(response.statusCode).not.toBe(401);
        expect(response.statusCode).not.toBe(404);
        expect(data).not.toHaveProperty('errors');
        expect(findOne).toHaveBeenCalledTimes(1);
        expect(checkPassword).toHaveBeenCalledTimes(1); 
        expect(checkPassword).toHaveBeenCalledWith(userData.password, 'hashed_password'); 
        expect(generateJWT).toHaveBeenCalledTimes(1);
        expect(generateJWT).toHaveBeenCalledWith(1);
    });
});

let jwt: string;
async function authenticationUser() {
     
    const response = await request(server)
                                .post('/api/auth/login')
                                .send({
                                    password : "password",
                                    email : "test@test.com"
                                });
    jwt = response.body;
    expect(response.statusCode).toBe(200);
};

describe('GET /api/budgets', () => {

    beforeAll(async () => {
        // restore the jest.spy function to its original implementation
        // without this line, the jest.spy function will not be restored
        jest.restoreAllMocks();
        await authenticationUser();
    });

    test('Should return 401 status code error when JWT is not provided', async () => {
        const response = await request(server)
                                    .get('/api/budgets');
        const data = response.body;

        expect(response.statusCode).toBe(401);
        expect(data).toHaveProperty('error');
        expect(data.error).toStrictEqual('No autorizado');
        expect(response.statusCode).not.toBe(200);
        expect(response.statusCode).not.toBe(404);
        expect(data).not.toHaveProperty('errors');
    });

    test('Should return 500 status code error when JWT is expired', async () => {
        const response = await request(server)
                                    .get('/api/budgets')
                                    .auth('not_valid_jwt_token', { type: 'bearer' });
        const data = response.body;

        expect(response.statusCode).toBe(500);
        expect(data).toHaveProperty('error');
        expect(data.error).toStrictEqual('Token no válido');
        expect(response.statusCode).not.toBe(200);
        expect(response.statusCode).not.toBe(404);
        expect(data).not.toHaveProperty('errors');
    });

    test('Should return 200 status code success when a valid JWT is provided', async () => {
        const response = await request(server)
                                    .get('/api/budgets')
                                    .auth(jwt, { type: 'bearer' });
        const data = response.body;

        expect(response.statusCode).toBe(200);
        expect(data).toHaveLength(0);
        expect(response.statusCode).not.toBe(401);
        expect(response.statusCode).not.toBe(404);
        expect(data).not.toHaveProperty('errors');
        expect(data.error).not.toBe('No autorizado');

    });

});

describe('POST /api/budgets', () => {

    beforeAll(async () => {
        jest.restoreAllMocks();
        await authenticationUser();
    });

    test('Should return 401 status code error when JWT is not provided', async () => {
        const response = await request(server)
                                    .post('/api/budgets');
        const data = response.body;

        expect(response.statusCode).toBe(401);
        expect(data).toHaveProperty('error');
        expect(data.error).toStrictEqual('No autorizado');
        expect(response.statusCode).not.toBe(200);
        expect(response.statusCode).not.toBe(404);
        expect(data).not.toHaveProperty('errors');
    });
});