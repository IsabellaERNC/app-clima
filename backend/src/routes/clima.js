//Importamos Router de Express para crear las rutas
import { Router } from "express";

//importamos las funciones del clima e historial que se creo en climaController.js
import { getClima, getHistorial } from "../controllers/climaController.js";

//importamos el middleware que verifica el token solo los usuarios registrados pueden buscar el clima
import { verificarToken } from "../middlewares/auth.js";

//creamos el router para las rutas del clima
const router = Router();

//----ruta para buscar el clima de la ciudadd----
//el get solo lee datos mas no envia nada
// "/:ciudad" es el parametro variable ejemplo cali
// verificarToken lo que hace primero verifica que el usuario este registrado
// getClima luego ejecuta la funcion que busca el clima
router.get("/:ciudad", verificarToken, getClima);

//------ruta para obtener el historial de busqueda-----
// getHistorial trae las ultimas 10 busquedas
router.get("/historial/mis-busquedas", verificarToken, getHistorial);

// Exportamos el router para usarlo en index.js
export default router;
