// Importamos mongoose - es la librería que nos permite
// hablar con MongoDB desde Node.js
import mongoose from "mongoose";

// Creamos una función asíncrona llamada connectDB
// "asíncrona" significa que espera a que MongoDB responda
// antes de continuar
const connectDB = async () => {
  // "try" intenta ejecutar el código
  // si algo falla, va al "catch"
  try {
    // Conectamos a MongoDB usando la URL que está en el .env
    // process.env.MONGODB_URI lee la variable MONGODB_URI del archivo .env
    // family: 4 significa que usa IPv4 (más compatible)
    // serverSelectionTimeoutMS: 10000 espera 10 segundos antes de dar error
    await mongoose.connect(process.env.MONGODB_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
    });

    // Si la conexión fue exitosa, muestra este mensaje en consola
    console.log("MongoDB conectado ✅");
  } catch (error) {
    // Si hubo un error, muestra el mensaje del error
    console.error("Error conectando MongoDB:", error.message);

    // Si falló, intenta reconectarse después de 5 segundos
    // 5000 = 5000 milisegundos = 5 segundos
    setTimeout(connectDB, 5000);
  }
};

// Exportamos la función para poder usarla en index.js
export default connectDB;
