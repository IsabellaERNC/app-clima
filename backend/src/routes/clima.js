// Importamos Router de Express para crear las rutas
import { Router } from "express";

// Importamos las funciones del clima e historial
// que creamos en climaController.js
import { getClima, getHistorial } from "../controllers/climaController.js";

// Importamos el middleware que verifica el token
// Solo usuarios logueados pueden buscar el clima
import { verificarToken } from "../middlewares/auth.js";

// Creamos el router para las rutas del clima
const router = Router();

// Ruta para buscar el clima de una ciudad
// GET → solo lee datos, no envía nada
// "/:ciudad" → el ":" significa que es un parámetro variable
// Ejemplo: /api/clima/Cali → ciudad = "Cali"
//          /api/clima/Bogota → ciudad = "Bogota"
// verificarToken → primero verifica que el usuario esté logueado
// getClima → luego ejecuta la función que busca el clima
router.get("/:ciudad", verificarToken, getClima);

// Ruta para obtener el historial de búsquedas
// GET → solo lee datos
// "/historial/mis-busquedas" → URL completa: /api/clima/historial/mis-busquedas
// verificarToken → verifica que el usuario esté logueado
// getHistorial → trae las últimas 10 búsquedas del usuario
router.get("/historial/mis-busquedas", verificarToken, getHistorial);

// Exportamos el router para usarlo en index.js
export default router;
