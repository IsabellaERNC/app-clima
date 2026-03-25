import { Router } from "express";
import { getClima, getHistorial } from "../controllers/climaController.js";
import { verificarToken } from "../middlewares/auth.js";

const router = Router();

router.get("/:ciudad", verificarToken, getClima);
router.get("/historial/mis-busquedas", verificarToken, getHistorial);

export default router;
