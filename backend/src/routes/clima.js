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
// GET solo lee datos, no envia nada
// "/:ciudad" el ":" significa que es un parametro variable
// Ejemplo: /api/clima/Cali ciudad = "Cali"
// verificarToken primero verifica que el usuario este logueado
// getClima luego ejecuta la funcion que busca el clima
router.get("/:ciudad", verificarToken, getClima);

// Ruta para obtener el historial de busquedas
// GET solo lee datos
// "/historial/mis-busquedas" URL completa: /api/clima/historial/mis-busquedas
// verificarToken verifica que el usuario este logueado
// getHistorial trae las ultimas 10 busquedas del usuario
router.get("/historial/mis-busquedas", verificarToken, getHistorial);

// Exportamos el router para usarlo en index.js
export default router;
