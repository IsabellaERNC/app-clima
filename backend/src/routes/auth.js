import { Router } from "express";
import { registro, login } from "../controllers/authController.js";
import { validar } from "../middlewares/validar.js";
import { registroSchema, loginSchema } from "../schemas/authSchema.js";

const router = Router();

// Ruta de registro - valida los datos antes de crear el usuario
router.post("/registro", validar(registroSchema), registro);

// Ruta de login - valida los datos antes de buscar el usuario
router.post("/login", validar(loginSchema), login);

export default router;
