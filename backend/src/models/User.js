// Importamos mongoose para crear el modelo
import mongoose from "mongoose";

// Creamos el "esquema" es el molde que define
// como se ve un usuario en la base de datos
const userSchema = new mongoose.Schema(
  {
    // required: true es obligatorio, no puede estar vacio
    // trim: true elimina espacios al inicio y al final
    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    // Campo email:
    // type: String es texto
    // required: true es obligatorio
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

    // Campo password:
    // type: String es texto
    // required: true es obligatorio
    // Nota: aquí se guarda la contraseña YA encriptada con bcrypt
    password: {
      type: String,
      required: true,
    },

    // Campo rol:
    // type: String → es texto
    // enum solo puede ser "admin" o "usuario", nada más
    // default: "usuario" → si no se especifica, por defecto es "usuario"
    rol: {
      type: String,
      enum: ["admin", "usuario"],
      default: "usuario",
    },
  },

  // timestamps: true → MongoDB agrega automáticamente
  // createdAt (fecha de creación) y updatedAt (fecha de actualización)
  { timestamps: true },
);

// Exportamos el modelo llamado "User"
// Esto crea una colección llamada "users" en MongoDB
export default mongoose.model("User", userSchema);
