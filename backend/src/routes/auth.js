// Importamos Router de Express para crear las rutas
import { Router } from "express";

// Importamos las funciones de registro y login
// que creamos en authController.js
import { registro, login } from "../controllers/authController.js";

// Creamos un router - es como un mini servidor
// que maneja solo las rutas de autenticación
const router = Router();

// Ruta para registrarse
// POST → significa que recibe datos (nombre, email, password)
// "/registro" → la URL completa es /api/auth/registro
// registro → es la función que se ejecuta cuando alguien llama esta URL
router.post("/registro", registro);

// Ruta para iniciar sesión
// POST → recibe email y password
// "/login" → la URL completa es /api/auth/login
// login → es la función que se ejecuta cuando alguien llama esta URL
router.post("/login", login);

// Exportamos el router para usarlo en index.js
export default router;
