import { Router } from "express";
import {
  getFavoritos,
  agregarFavorito,
  eliminarFavorito,
} from "../controllers/favoritosController.js";
import { verificarToken } from "../middlewares/auth.js";

const router = Router();

// Obtener todos los favoritos del usuario
router.get("/", verificarToken, getFavoritos);

// Agregar una ciudad a favoritos
router.post("/", verificarToken, agregarFavorito);

// Eliminar una ciudad de favoritos
router.delete("/:id", verificarToken, eliminarFavorito);

export default router;
