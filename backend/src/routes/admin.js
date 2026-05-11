import { Router } from "express";
import { getUsuarios, getTodoHistorial } from "../controllers/adminController.js";
import { verificarToken, verificarAdmin } from "../middlewares/auth.js";

const router = Router();

// Todas las rutas de admin requieren token Y rol de admin
// verificarToken → verifica que este logueado
// verificarAdmin → verifica que sea admin

// Obtener todos los usuarios
router.get("/usuarios", verificarToken, verificarAdmin, getUsuarios);

// Obtener todo el historial de busquedas
router.get("/historial", verificarToken, verificarAdmin, getTodoHistorial);

export default router;
