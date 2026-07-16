<div align="center">

# CashTrackr

### Plataforma full stack para administrar presupuestos y controlar gastos personales

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

## Descripción

**CashTrackr** es una aplicación web full stack diseñada para facilitar la administración de finanzas personales. Permite crear presupuestos, registrar gastos, consultar el dinero disponible y visualizar el avance de cada presupuesto desde una interfaz clara y responsiva.

El proyecto separa la interfaz web y la API REST en dos aplicaciones independientes, ambas desarrolladas con TypeScript. El frontend utiliza Next.js y el backend está construido con Express, PostgreSQL y Sequelize.

> [!IMPORTANT]
> El proyecto se encuentra actualmente en proceso de reconstrucción y modernización dentro de este repositorio.

## Funcionalidades

- Registro y confirmación de cuentas mediante correo electrónico.
- Inicio de sesión y autenticación basada en JSON Web Tokens.
- Recuperación y restablecimiento de contraseña.
- Creación, consulta, edición y eliminación de presupuestos.
- Registro y administración de gastos asociados a cada presupuesto.
- Cálculo automático del total gastado y el dinero disponible.
- Visualización del porcentaje utilizado de cada presupuesto.
- Administración del perfil y actualización de contraseña.
- Protección de recursos según el usuario autenticado.
- Validación de datos en frontend y backend.
- Limitación de solicitudes en rutas sensibles de autenticación.

## Arquitectura

```text
Usuario
   │
   ▼
Next.js + TypeScript
Server Components / Server Actions
   │
   ▼
API REST con Express + TypeScript
   │
   ├── PostgreSQL
   └── Servicio SMTP
```

La aplicación está organizada en dos componentes principales:

```text
CASHTRACKR/
├── frontend/       # Interfaz web desarrollada con Next.js
├── backend/        # API REST desarrollada con Express
└── README.md
```

## Tecnologías

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Zod
- Server Components
- Server Actions
- React Toastify
- Headless UI
- Heroicons

### Backend

- Node.js
- Express
- TypeScript
- PostgreSQL
- Sequelize TypeScript
- JSON Web Tokens
- bcrypt
- Nodemailer
- express-validator
- express-rate-limit
- Morgan

### Pruebas y herramientas

- Jest
- Supertest
- ts-jest
- Nodemon
- pnpm
- Git y GitHub

## Modelo de datos

```text
User
 └── Budget
      └── Expense
```

- Un usuario puede tener múltiples presupuestos.
- Cada presupuesto pertenece a un único usuario.
- Un presupuesto puede contener múltiples gastos.
- Cada gasto pertenece a un presupuesto.

## Requisitos previos

Antes de ejecutar el proyecto necesitas instalar:

- Node.js 20 o superior.
- pnpm.
- PostgreSQL.
- Una cuenta o servidor SMTP para el envío de correos.

Instala pnpm globalmente si aún no lo tienes:

```bash
npm install -g pnpm
```

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/DanielMR-dev/CASHTRACKR.git
cd CASHTRACKR
```

### Backend

```bash
cd backend
pnpm install
cp .env.example .env
pnpm dev
```

La API estará disponible normalmente en:

```text
http://localhost:4000
```

### Frontend

En otra terminal:

```bash
cd frontend
pnpm install
cp .env.example .env.local
pnpm dev
```

La aplicación web estará disponible normalmente en:

```text
http://localhost:3000
```

## Variables de entorno

### Backend

Crea un archivo `backend/.env`:

```env
PORT=4000
DATABASE_URL=postgresql://usuario:password@localhost:5432/cashtrackr
JWT_SECRET=una_clave_secreta_segura
FRONTEND_URL=http://localhost:3000

EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=usuario_smtp
EMAIL_PASS=password_smtp
```

### Frontend

Crea un archivo `frontend/.env.local`:

```env
API_URL=http://localhost:4000/api
NEXT_PUBLIC_URL=http://localhost:3000
```

> [!WARNING]
> Nunca subas archivos `.env`, credenciales de base de datos, secretos JWT ni contraseñas SMTP al repositorio.

## Scripts principales

### Backend

```bash
pnpm dev             # Ejecuta la API en desarrollo
pnpm build           # Compila TypeScript
pnpm start           # Ejecuta la versión compilada
pnpm test            # Ejecuta las pruebas
pnpm test:coverage   # Genera el reporte de cobertura
```

### Frontend

```bash
pnpm dev       # Ejecuta Next.js en desarrollo
pnpm build     # Genera la compilación de producción
pnpm start     # Ejecuta la compilación de producción
pnpm lint      # Ejecuta el análisis estático
```

## API REST

Principales grupos de rutas:

```text
/api/auth                     Autenticación y perfil
/api/budgets                  Administración de presupuestos
/api/budgets/:id/expenses     Administración de gastos
```

Las operaciones privadas requieren un token JWT válido y verifican que el recurso solicitado pertenezca al usuario autenticado.

## Seguridad

El proyecto contempla las siguientes medidas:

- Contraseñas almacenadas mediante hash con bcrypt.
- Autenticación basada en JWT.
- Cookie de sesión `httpOnly` gestionada desde Next.js.
- Validación de solicitudes en frontend y backend.
- Rate limiting para endpoints sensibles.
- Verificación de propiedad sobre presupuestos y gastos.
- Variables sensibles administradas mediante archivos de entorno.

## Pruebas

El backend incluye pruebas unitarias y de integración para:

- Registro e inicio de sesión.
- Confirmación de cuentas.
- Recuperación de contraseña.
- Autorización mediante JWT.
- Operaciones CRUD de presupuestos.
- Operaciones CRUD de gastos.
- Middlewares y controladores.

Ejecuta las pruebas con:

```bash
cd backend
pnpm test
```
