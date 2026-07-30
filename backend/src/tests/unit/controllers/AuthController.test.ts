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

        expect(res.statusCode).toBe(200);
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

describe('AuthController.forgotPassword', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should return 404 status error if user does not exist', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/forgot-password',
            body: {
                email: 'test@test.com'
            }
        });
        const res = createResponse();
        await AuthController.forgotPassword(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(404);
        expect(data).toHaveProperty('error', 'Usuario no encontrado');
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
    });

    test('Should send password reset token and return success message', async () => {
        const mockUser = {
            id: 1,
            name: 'Test Name',
            email: 'test@test.com',
            token: '',
            save: jest.fn().mockResolvedValue(true)
        };
        const token = '123456';
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (generateToken as jest.Mock).mockReturnValue(token);
        jest.spyOn(AuthEmail, 'sendPasswordResetToken').mockImplementation(() => Promise.resolve());

        const req = createRequest({
            method: 'POST',
            url: '/api/auth/forgot-password',
            body: {
                email: 'test@test.com'
            }
        });
        const res = createResponse();
        await AuthController.forgotPassword(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data).toHaveProperty('message', 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña');
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({ where: { email: req.body.email } });
        expect(generateToken).toHaveBeenCalled();
        expect(generateToken).toHaveBeenCalledTimes(1);
        expect(mockUser.token).toBe(token);
        expect(mockUser.save).toHaveBeenCalled();
        expect(mockUser.save).toHaveBeenCalledTimes(1);
        expect(AuthEmail.sendPasswordResetToken).toHaveBeenCalled();
        expect(AuthEmail.sendPasswordResetToken).toHaveBeenCalledTimes(1);
        expect(AuthEmail.sendPasswordResetToken).toHaveBeenCalledWith({
            name: mockUser.name,
            email: mockUser.email,
            token: token
        });
    });

    test('Should handle forgot password error', async () => {
        const mockUser = {
            id: 1,
            name: 'Test Name',
            email: 'test@test.com',
            token: '',
            save: jest.fn().mockRejectedValue(new Error())
        };
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (generateToken as jest.Mock).mockReturnValue('123456');

        const req = createRequest({
            method: 'POST',
            url: '/api/auth/forgot-password',
            body: {
                email: 'test@test.com'
            }
        });
        const res = createResponse();
        jest.spyOn(console, 'log').mockImplementation(() => {});

        await AuthController.forgotPassword(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(500);
        expect(data).toHaveProperty('error', 'Error al restablecer la contraseña');
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(mockUser.save).toHaveBeenCalled();
        expect(mockUser.save).toHaveBeenCalledTimes(1);
    });
});

describe('AuthController.validateToken', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should return 404 status error if token does not exist', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/validate-token',
            body: {
                token: 'invalid_token'
            }
        });
        const res = createResponse();
        await AuthController.validateToken(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(404);
        expect(data).toHaveProperty('error', 'Token no válido');
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({ where: { token: req.body.token } });
    });

    test('Should return 200 status and success message if token is valid', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(true);
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/validate-token',
            body: {
                token: '123456'
            }
        });
        const res = createResponse();
        await AuthController.validateToken(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data).toHaveProperty('message', 'Token válido');
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({ where: { token: req.body.token } });
    });
});

describe('AuthController.resetPasswordWithToken', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should return 404 status error if token does not exist', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/reset-password/:token',
            params: {
                token: 'invalid_token'
            },
            body: {
                password: 'newpassword'
            }
        });
        const res = createResponse();
        await AuthController.resetPasswordWithToken(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(404);
        expect(data).toHaveProperty('error', 'Token no válido');
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({ where: { token: req.params.token } });
    });

    test('Should reset password and return success message', async () => {
        const mockUser = {
            id: 1,
            password: 'oldpassword',
            token: '123456',
            save: jest.fn().mockResolvedValue(true)
        };
        const hashed_password = 'hashed_new_password';
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (hashPassword as jest.Mock).mockResolvedValue(hashed_password);

        const req = createRequest({
            method: 'POST',
            url: '/api/auth/reset-password/:token',
            params: {
                token: '123456'
            },
            body: {
                password: 'newpassword'
            }
        });
        const res = createResponse();
        await AuthController.resetPasswordWithToken(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data).toHaveProperty('message', 'Contraseña restablecida correctamente');
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(User.findOne).toHaveBeenCalledWith({ where: { token: req.params.token } });
        expect(hashPassword).toHaveBeenCalled();
        expect(hashPassword).toHaveBeenCalledTimes(1);
        expect(hashPassword).toHaveBeenCalledWith(req.body.password);
        expect(mockUser.password).toBe(hashed_password);
        expect(mockUser.token).toBeNull();
        expect(mockUser.save).toHaveBeenCalled();
        expect(mockUser.save).toHaveBeenCalledTimes(1);
    });

    test('Should handle error when resetting password', async () => {
        const mockUser = {
            id: 1,
            password: 'oldpassword',
            token: '123456',
            save: jest.fn().mockRejectedValue(new Error())
        };
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
        (hashPassword as jest.Mock).mockResolvedValue('hashed_password');

        const req = createRequest({
            method: 'POST',
            url: '/api/auth/reset-password/:token',
            params: {
                token: '123456'
            },
            body: {
                password: 'newpassword'
            }
        });
        const res = createResponse();
        await AuthController.resetPasswordWithToken(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(500);
        expect(data).toHaveProperty('error', 'Error al restablecer la contraseña');
        expect(User.findOne).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledTimes(1);
        expect(mockUser.save).toHaveBeenCalled();
        expect(mockUser.save).toHaveBeenCalledTimes(1);
    });
});

describe('AuthController.getUser', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should return authenticated user information and status code 200', async () => {
        const mockUser = {
            id: 1,
            name: 'Test Name',
            email: 'test@test.com'
        };
        const req = createRequest({
            method: 'GET',
            url: '/api/auth/user',
            user: mockUser
        });
        const res = createResponse();
        await AuthController.getUser(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data).toStrictEqual(mockUser);
    });
});

describe('AuthController.updateCurrentUserPassword', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should return 401 status error if user is not present in request', async () => {
        const req = createRequest({
            method: 'PUT',
            url: '/api/auth/update-password',
            body: {
                current_password: 'currentpassword',
                new_password: 'newpassword'
            }
        });
        const res = createResponse();
        await AuthController.updateCurrentUserPassword(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(401);
        expect(data).toHaveProperty('error', 'No autorizado');
    });

    test('Should return 404 status error if user is not found in database', async () => {
        (User.findByPk as jest.Mock).mockResolvedValue(null);
        const req = createRequest({
            method: 'PUT',
            url: '/api/auth/update-password',
            user: { id: 1 },
            body: {
                current_password: 'currentpassword',
                new_password: 'newpassword'
            }
        });
        const res = createResponse();
        await AuthController.updateCurrentUserPassword(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(404);
        expect(data).toHaveProperty('error', 'Usuario no encontrado');
        expect(User.findByPk).toHaveBeenCalled();
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(User.findByPk).toHaveBeenCalledWith(req.user!.id);
    });

    test('Should return 401 status error if current password is incorrect', async () => {
        const mockUser = {
            id: 1,
            password: 'hashed_old_password'
        };
        (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
        (checkPassword as jest.Mock).mockResolvedValue(false);

        const req = createRequest({
            method: 'PUT',
            url: '/api/auth/update-password',
            user: { id: 1 },
            body: {
                current_password: 'wrongpassword',
                new_password: 'newpassword'
            }
        });
        const res = createResponse();
        await AuthController.updateCurrentUserPassword(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(401);
        expect(data).toHaveProperty('error', 'La contraseña actual es incorrecta');
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(checkPassword).toHaveBeenCalled();
        expect(checkPassword).toHaveBeenCalledTimes(1);
        expect(checkPassword).toHaveBeenCalledWith(req.body.current_password, mockUser.password);
    });

    test('Should update user password and return 200 status with success message', async () => {
        const mockUser = {
            id: 1,
            password: 'hashed_old_password',
            save: jest.fn().mockResolvedValue(true)
        };
        const hashed_new_password = 'hashed_new_password';
        (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
        (checkPassword as jest.Mock).mockResolvedValue(true);
        (hashPassword as jest.Mock).mockResolvedValue(hashed_new_password);

        const req = createRequest({
            method: 'PUT',
            url: '/api/auth/update-password',
            user: { id: 1 },
            body: {
                current_password: 'correctpassword',
                new_password: 'newpassword'
            }
        });
        const res = createResponse();
        await AuthController.updateCurrentUserPassword(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data).toBe('Contraseña actualizada correctamente');
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(checkPassword).toHaveBeenCalledWith(req.body.current_password, 'hashed_old_password');
        expect(hashPassword).toHaveBeenCalledWith(req.body.new_password);
        expect(mockUser.password).toBe(hashed_new_password);
        expect(mockUser.save).toHaveBeenCalled();
        expect(mockUser.save).toHaveBeenCalledTimes(1);
    });

    test('Should handle error when updating user password', async () => {
        const mockUser = {
            id: 1,
            password: 'hashed_old_password',
            save: jest.fn().mockRejectedValue(new Error())
        };
        (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
        (checkPassword as jest.Mock).mockResolvedValue(true);
        (hashPassword as jest.Mock).mockResolvedValue('hashed_new_password');

        const req = createRequest({
            method: 'PUT',
            url: '/api/auth/update-password',
            user: { id: 1 },
            body: {
                current_password: 'correctpassword',
                new_password: 'newpassword'
            }
        });
        const res = createResponse();
        jest.spyOn(console, 'log').mockImplementation(() => {});

        await AuthController.updateCurrentUserPassword(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(500);
        expect(data).toHaveProperty('error', 'Error al actualizar la contraseña');
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(mockUser.save).toHaveBeenCalledTimes(1);
    });
});

describe('AuthController.checkPassword', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should return 401 status error if user is not present in request', async () => {
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/check-password',
            body: {
                password: 'testpassword'
            }
        });
        const res = createResponse();
        await AuthController.checkPassword(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(401);
        expect(data).toHaveProperty('error', 'No autorizado');
    });

    test('Should return 404 status error if user is not found in database', async () => {
        (User.findByPk as jest.Mock).mockResolvedValue(null);
        const req = createRequest({
            method: 'POST',
            url: '/api/auth/check-password',
            user: { id: 1 },
            body: {
                password: 'testpassword'
            }
        });
        const res = createResponse();
        await AuthController.checkPassword(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(404);
        expect(data).toHaveProperty('error', 'Usuario no encontrado');
        expect(User.findByPk).toHaveBeenCalled();
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(User.findByPk).toHaveBeenCalledWith(req.user!.id);
    });

    test('Should return 401 status error if password is incorrect', async () => {
        const mockUser = {
            id: 1,
            password: 'hashed_password'
        };
        (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
        (checkPassword as jest.Mock).mockResolvedValue(false);

        const req = createRequest({
            method: 'POST',
            url: '/api/auth/check-password',
            user: { id: 1 },
            body: {
                password: 'wrongpassword'
            }
        });
        const res = createResponse();
        await AuthController.checkPassword(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(401);
        expect(data).toHaveProperty('error', 'La contraseña es incorrecta');
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(checkPassword).toHaveBeenCalled();
        expect(checkPassword).toHaveBeenCalledTimes(1);
        expect(checkPassword).toHaveBeenCalledWith(req.body.password, mockUser.password);
    });

    test('Should return 200 status and success message if password is correct', async () => {
        const mockUser = {
            id: 1,
            password: 'hashed_password'
        };
        (User.findByPk as jest.Mock).mockResolvedValue(mockUser);
        (checkPassword as jest.Mock).mockResolvedValue(true);

        const req = createRequest({
            method: 'POST',
            url: '/api/auth/check-password',
            user: { id: 1 },
            body: {
                password: 'correctpassword'
            }
        });
        const res = createResponse();
        await AuthController.checkPassword(req, res);
        const data = res._getJSONData();

        expect(res.statusCode).toBe(200);
        expect(data).toBe('Contraseña correcta');
        expect(User.findByPk).toHaveBeenCalledTimes(1);
        expect(checkPassword).toHaveBeenCalledWith(req.body.password, mockUser.password);
    });
});