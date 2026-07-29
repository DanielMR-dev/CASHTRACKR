import { createRequest, createResponse } from "node-mocks-http";
import { AuthController } from "../../../controllers/AuthController";
import User from "../../../models/User";
import { checkPassword, hashPassword } from "../../../utils/auth";
import { generateToken } from "../../../utils/token";
import { AuthEmail } from "../../../emails/AuthEmail";
import { generateJWT } from "../../../utils/jwt";

jest.mock('../../../models/User');
jest.mock('../../../utils/auth');
jest.mock('../../../utils/token');
jest.mock('../../../utils/jwt');

describe('AuthController.createAccount', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should return a 409 status and error message if the email is already registered', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(true);
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/create-account',
            body: {
                email: 'test@test.com',
                password: 'testpassword'
            }
        });
        const res = createResponse();
        await AuthController.createAccount(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(409);
        expect(data).toHaveProperty('error', 'Un usuario con ese email ya existe');
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledTimes(1);
    });

    test('Should register a new user and return a success message', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/create-account',
            body: {
                email: 'test@test.com',
                password: 'testpassword',
                name: 'Test Name'
            }
        });
        const res = createResponse();
        const mockUser = {
            ...req.body,
            save: jest.fn()
        };
        const hashed_password = 'hashed_password';
        const token = '123456';

        (User.create as jest.Mock).mockResolvedValue(mockUser);
        (hashPassword as jest.Mock).mockResolvedValue(hashed_password);
        (generateToken as jest.Mock).mockReturnValue(token); // For sync functions mockReturnValue 
        jest.spyOn(AuthEmail, 'sendConfirmationEmail').mockImplementation(() => Promise.resolve());
    
        await AuthController.createAccount(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(201);
        expect(data).toHaveProperty('message', '¡Tu cuenta ha sido creada correctamente!');
        expect(User.findOne).toHaveBeenCalled();
        expect(User.create).toHaveBeenCalled();
        expect(User.create).toHaveBeenCalledWith(req.body);
        expect(User.create).toHaveBeenCalledTimes(1);
        expect(mockUser.save).toHaveBeenCalled();
        expect(mockUser.save).toHaveBeenCalledTimes(1);
        expect(mockUser.password).toBe(hashed_password);
        expect(mockUser.token).toBe(token);
        expect(hashPassword).toHaveBeenCalled();
        expect(hashPassword).toHaveBeenCalledTimes(1);
        expect(generateToken).toHaveBeenCalled();
        expect(generateToken).toHaveBeenCalledTimes(1);
        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalled();
        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledTimes(1);
        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
            name: mockUser.name,
            email: mockUser.email,
            token: token
        });
    });

    test('Should handle user creation error', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);
        (User.create as jest.Mock).mockRejectedValue(new Error());
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/create-account',
            body: {
                email: 'test@test.com',
                password: 'testpassword',
                name: 'Test Name'
            }
        });
        const res = createResponse();
        await AuthController.createAccount(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(500);
        expect(data).toHaveProperty('error', 'Error al crear la cuenta');
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.create).toHaveBeenCalledWith(req.body);
    });
});

describe('AuthController.confirmAccount', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should return 401 status error if token is not valid', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/confirm-account',
            body: {
                token: 'invalid_token'
            }
        });
        const res = createResponse();
        await AuthController.confirmAccount(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(401);
        expect(data).toHaveProperty('error', 'Token no válido');
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({ where: { token: req.body.token } });
    });

    test('Should confirm account and return success message', async () => {
        const mockUser = {
            id: 1,
            name: 'Test Name',
            email: 'test@test.com',
            confirmed: false,
            token: '123456',
            save: jest.fn().mockResolvedValue(true)
        };
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/confirm-account',
            body: {
                token: '123456'
            }
        });
        const res = createResponse();
        await AuthController.confirmAccount(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(201);
        expect(data).toHaveProperty('message', '¡Tu cuenta ha sido confirmada correctamente!');
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({ where: { token: req.body.token } });
        expect(mockUser.confirmed).toBe(true);
        expect(mockUser.token).toBeNull();
        expect(mockUser.save).toHaveBeenCalled();
        expect(mockUser.save).toHaveBeenCalledTimes(1);
    });

    test('Should handle account confirmation error', async () => {
        const mockUser = {
            id: 1,
            name: 'Test Name',
            email: 'test@test.com',
            confirmed: false,
            token: '123456',
            save: jest.fn().mockRejectedValue(new Error())
        };
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/confirm-account',
            body: {
                token: '123456'
            }
        });
        const res = createResponse();
        jest.spyOn(console, 'log').mockImplementation(() => {});

        await AuthController.confirmAccount(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(500);
        expect(data).toHaveProperty('error', 'Error al confirmar la cuenta');
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(mockUser.save).toHaveBeenCalled();
        expect(mockUser.save).toHaveBeenCalledTimes(1);
    });
});

describe('AuthController.login', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should return 404 status error if user does not exist', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/login',
            body: {
                email: 'test@test.com',
                password: 'testpassword'
            }
        });
        const res = createResponse();
        await AuthController.login(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(404);
        expect(data).toHaveProperty('error', 'Usuario no encontrado');
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledTimes(1);
    });

    test('Should return 403 status error if account is not confirmed', async () => {
        const mockUser = {
            id: 1,
            name: 'Test Name',
            email: 'test@test.com',
            password: 'testpassword',
            confirmed: false
        };
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/login',
            body: {
                email: 'test@test.com',
                password: 'testpassword'
            }
        });
        const res = createResponse();
        await AuthController.login(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(403);
        expect(data).toHaveProperty('error', 'Tu cuenta no ha sido confirmada');
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledTimes(1);
    });

    test('Should return 401 status error if password is incorrect', async () => {
        const mockUser = {
            id: 1,
            name: 'Test Name',
            email: 'test@test.com',
            password: 'testpassword',
            confirmed: true
        };
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/login',
            body: {
                email: 'test@test.com',
                password: 'wrongpassword'
            }
        });
        const res = createResponse();
        (checkPassword as jest.Mock).mockResolvedValue(false);
        await AuthController.login(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(401);
        expect(data).toHaveProperty('error', 'Password Incorrecto');
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(checkPassword).toHaveBeenCalled();
        expect(checkPassword).toHaveBeenCalledTimes(1);
        expect(checkPassword).toHaveBeenCalledWith(req.body.password, mockUser.password);
    });

    test('Should return 200 status and JWT token if credentials are correct', async () => {
        const mockUser = {
            id: 1,
            name: 'Test Name',
            email: 'test@test.com',
            password: 'testpassword',
            confirmed: true
        };
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/login',
            body: {
                email: 'test@test.com',
                password: 'testpassword'
            }
        });
        const res = createResponse();
        const fakejwt = 'fakejwt';
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (checkPassword as jest.Mock).mockResolvedValue(true);
        (generateJWT as jest.Mock).mockReturnValue(fakejwt);
        await AuthController.login(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data).toStrictEqual(fakejwt);
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(checkPassword).toHaveBeenCalled();
        expect(checkPassword).toHaveBeenCalledTimes(1);
        expect(checkPassword).toHaveBeenCalledWith(req.body.password, mockUser.password);
        expect(generateJWT).toHaveBeenCalled();
        expect(generateJWT).toHaveBeenCalledTimes(1);
        expect(generateJWT).toHaveBeenCalledWith(mockUser.id);
    });
});