// Importamos mongoose para crear el modelo
import mongoose from "mongoose";

// Creamos el esquema del historial es el molde que define
// como se ve una busqueda guardada en la base de datos
const historialSchema = new mongoose.Schema(
  {
    // Campo usuario:
    // ObjectId es el ID unico que MongoDB le da a cada usuario
    // ref: User esta relacionado con el modelo User
    // Esto es como una FK en SQL
    // Nos dice A QUE USUARIO pertenece esta busqueda
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Campo ciudad:
    // Guarda el nombre de la ciudad que busco el usuario
    ciudad: {
      type: String,
      required: true,
    },

    // Campo temperatura:
    temperatura: Number,

    // Campo descripcion:
    descripcion: String,

    // Campo icono:
    // String es texto
    // Guarda el codigo del icono del clima de OpenWeatherMap
    // Ejemplo: "01d" que representa el sol
    icono: String,
  },

  // timestamps: true MongoDB agrega automaticamente
  // createdAt cuando se hizo la busqueda
  // updatedAt cuando se actualizo
  { timestamps: true },
);

// Exportamos el modelo llamado "Historial"
// Esto crea una coleccion llamada "historials" en MongoDB
export default mongoose.model("Historial", historialSchema);
