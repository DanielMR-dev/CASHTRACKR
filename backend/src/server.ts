import express, { Express } from 'express'; 
import colors from 'colors';
import morgan from 'morgan';
import { db } from './config/db';
import budgetRouter from './routes/budgetRouter';
import authRouter from './routes/authRouter';

async function connectDB () {
    try {
        await db.authenticate();
        db.sync();
        console.log(colors.blue.bold('Base de datos conectada'));
    } catch (error) {
        console.log(colors.red.bold('No se pudo conectar a la base de datos'));
        process.exit(1); // Detiene el proceso
    }
};
connectDB();
const app: Express = express();

app.use(morgan('dev'));

app.use(express.json());

app.use('/api/budgets', budgetRouter);
app.use('/api/auth', authRouter);

export default app;