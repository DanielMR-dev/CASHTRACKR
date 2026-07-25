import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";
import { limiter } from "../config/limiter";
import { authenticate } from "../middleware/auth";

const router: Router = Router();

// Proteger todas las rutas de Auth con el limitador
router.use(limiter);

// Crear una Cuenta
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

// Confirmar Cuenta
router.post('/confirm-account',
    body('token')
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage('Token no válido'),
    handleInputErrors,
    AuthController.confirmAccount
);

// Iniciar Sesión
router.post('/login',
    body('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Email no válido'),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),
    handleInputErrors,
    AuthController.login
);

// Olvidé mi contraseña
router.post('/forgot-password', 
    body('email')
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Email no válido'),
    handleInputErrors,
    AuthController.forgotPassword
);

// Validar Token
router.post('/validate-token', 
    body('token')
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage('Token no válido'),
    handleInputErrors,
    AuthController.validateToken
);

// Reestablecer Contraseña
router.post('/reset-password/:token',
    param('token')
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage('Token no válido'),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    handleInputErrors,
    AuthController.resetPasswordWithToken
);

// Obtener el usuario
router.get('/user', 
    authenticate,
    AuthController.getUser
);

// Cambiar Contraseña
router.post('/update-password', 
    authenticate,
    body('current_password')
        .notEmpty().withMessage('La contraseña actual es obligatoria'),
    body('new_password')
        .notEmpty().withMessage('La contraseña nueva es obligatoria')
        .isLength({ min: 8 }).withMessage('La contraseña nueva debe tener al menos 8 caracteres'),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
);

// Verificar contraseña
router.post('/check-password', 
    authenticate,
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),
    handleInputErrors,
    AuthController.checkPassword
);

export default router;