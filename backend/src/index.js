import express from "express"; // Framework para el servidor
import cors from "cors"; // Framework para crear el servidor
import dotenv from "dotenv"; // Para usar variables de entorno .env
import connectDB from "./config/db.js"; // Funcion para conectar a la base de datos
import authRoutes from "./routes/auth.js"; // Rutas de autenticacion
import climaRoutes from "./routes/clima.js";
import favoritosRoutes from "./routes/favoritos.js";
import errorHandler from "./middlewares/errorHandler.js";

// Cargamos las variables de entorno
dotenv.config();
connectDB(); //base de datos

const app = express(); // Creamos la aplicacion de Express

// Middleware
app.use(cors()); // Permite que otros dominios como frontend accedan al backend
app.use(express.json()); // Permite recibir datos en formato JSON

app.use("/api/auth", authRoutes);
app.use("/api/clima", climaRoutes);
app.use("/api/favoritos", favoritosRoutes);

//ruta de prueba ppara ver si el servidor funciona
app.get("/", (req, res) => {
  res.json({ message: "Backend App de Clima funcionando " });
});

//manejador de errores globales
app.use(errorHandler);

//seridor en el puerto 3000
app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
