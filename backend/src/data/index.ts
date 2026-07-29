import { exit } from 'process';
import { db } from '../config/db';
import colors from 'colors';

const clearData = async () => {
    console.log(colors.cyan.bold('Limpiando datos...'));
    try {
        await db.sync({ force: true });
        console.log(colors.bold.green('Datos limpiados correctamente'));
        exit(0);
    } catch (error) {
        // console.error(error);
        exit(1);
    }
};

if(process.argv[2] === '--clear') {
    clearData();
}