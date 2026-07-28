import { createRequest, createResponse } from "node-mocks-http";
import { AuthController } from "../../../controllers/AuthController";
import User from "../../../models/User";
import { hashPassword } from "../../../utils/auth";
import { generateToken } from "../../../utils/token";
import { AuthEmail } from "../../../emails/AuthEmail";

jest.mock('../../../models/User');
jest.mock('../../../utils/auth');
jest.mock('../../../utils/token');

describe('AuthController.createAccount', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    })

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
        const userMock = {
            ...req.body,
            save: jest.fn()
        };
        const hashed_password = 'hashed_password';
        const token = '123456';

        (User.create as jest.Mock).mockResolvedValue(userMock);
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
        expect(userMock.save).toHaveBeenCalled();
        expect(userMock.save).toHaveBeenCalledTimes(1);
        expect(userMock.password).toBe(hashed_password);
        expect(userMock.token).toBe(token);
        expect(hashPassword).toHaveBeenCalled();
        expect(hashPassword).toHaveBeenCalledTimes(1);
        expect(generateToken).toHaveBeenCalled();
        expect(generateToken).toHaveBeenCalledTimes(1);
        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalled();
        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledTimes(1);
        expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
            name: userMock.name,
            email: userMock.email,
            token: token
        });
    })
    
});