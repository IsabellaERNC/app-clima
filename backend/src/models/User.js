// Importamos mongoose para crear el modelo
import mongoose from "mongoose";

// Creamos el "esquema" es el molde que define
// como se ve un usuario en la base de datos
const userSchema = new mongoose.Schema(
  {
    // trim: true elimina espacios al inicio y al final
    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    // Campo email:
    // unique: true no puede haber dos usuarios con el mismo email
    // trim: true elimina espacios
    // lowercase: true convierte a minusculas automaticamente
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    // Campo password
    // required: true es obligatorio
    // aqui se guarda la contraseña YA encriptada con bcrypt
    password: {
      type: String,
      required: true,
    },

    // Campo rol:
    // enum solo puede ser "admin" o "usuario"
    rol: {
      type: String,
      enum: ["admin", "usuario"],
      default: "usuario",
    },
  },

  // timestamps: true MongoDB agrega automaticamente
  // createdAt fecha de creacion y updatedAt fecha de actualizacion
  { timestamps: true },
);

// Exportamos el modelo llamado "User"
// Esto crea una coleccion llamada "users" en MongoDB
export default mongoose.model("User", userSchema);
