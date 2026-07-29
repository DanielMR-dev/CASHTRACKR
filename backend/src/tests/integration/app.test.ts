import request from 'supertest';
import server from '../../server';
import { connectDB } from '../../server';

describe('Test', () => {
    beforeAll(async () => {
        await connectDB();
    });

    test('Should return a 200 status code from the homepage url', async () => {
        const response = await request(server).get('/');
        
        expect(response.statusCode).toBe(200);
    });
});