import { Router } from "express";
import {
  getFavoritos,
  agregarFavorito,
  eliminarFavorito,
} from "../controllers/favoritosController.js";
import { verificarToken } from "../middlewares/auth.js";
import { validar } from "../middlewares/validar.js";
import { favoritoSchema } from "../schemas/favoritoSchema.js";

const router = Router();

// Obtener todos los favoritos del usuario
router.get("/", verificarToken, getFavoritos);

// Agregar una ciudad a favoritos - valida los datos antes
router.post("/", verificarToken, validar(favoritoSchema), agregarFavorito);

// Eliminar una ciudad de favoritos
router.delete("/:id", verificarToken, eliminarFavorito);

export default router;
