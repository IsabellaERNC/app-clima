import { Router } from "express";       // Importamos Router desde express la cual sirve para crear rutas separadas
import {getFavoritos,agregarFavorito,eliminarFavorito,} from "../controllers/favoritosController.js";

// Importamos el middleware que verifica el token "usuario autenticado
import { verificarToken } from "../middlewares/auth.js";

const router = Router();

//------------RUTAS-----------

// Obtener todos los favoritos del usuario
router.get("/", verificarToken, getFavoritos);
// Primero pasa por el middlewarede seguridad
// Luego ejecuta la funcion del controlador

// Agregar una ciudad a favoritos
router.post("/", verificarToken, agregarFavorito);

// Eliminar una ciudad de favoritos
router.delete("/:id", verificarToken, eliminarFavorito);

export default router;
