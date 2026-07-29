import express, { Express } from 'express'; 
import colors from 'colors';
import morgan from 'morgan';
import { db } from './config/db';
import budgetRouter from './routes/budgetRouter';
import authRouter from './routes/authRouter';

export async function connectDB () {
    try {
        await db.authenticate();
        await db.sync();
        // console.log(colors.blue.bold('Base de datos conectada'));
    } catch (error) {
        // console.log(colors.red.bold('No se pudo conectar a la base de datos'));
        process.exit(1); // Detiene el proceso
    }
};
connectDB();
const app: Express = express();

app.use(morgan('dev'));

app.use(express.json());

app.use('/api/budgets', budgetRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
    res.json({ data: 'Todo OK'})
})

export default app;