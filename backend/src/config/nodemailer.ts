import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

type TransportConfig = {
    host: string;
    port: number;
    auth: {
        user: string;
        pass: string;
    };
};

const config = () : TransportConfig => {
    const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;
    if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
        throw new Error('Faltan variables de entorno requeridas para la configuración de Email');
    }
    return {
        host: EMAIL_HOST,
        port: +EMAIL_PORT,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    }
}

export const transport = nodemailer.createTransport(config());