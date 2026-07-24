import { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";

const router: Router = Router();

// Crear un Cuenta
router.post('/create-account',
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacío')
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    body('email')
        .notEmpty().withMessage('El email no puede ir vacío')
        .isEmail().withMessage('Email no válido'),
    body('password')
        .notEmpty().withMessage('La contraseña no puede ir vacía')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    handleInputErrors,
    AuthController.createAccount
);

export default router;