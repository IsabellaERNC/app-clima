import mongoose from "mongoose";

const historialSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ciudad: {
      type: String,
      required: true,
    },
    temperatura: Number,
    descripcion: String,
    icono: String,
  },
  { timestamps: true },
);

export default mongoose.model("Historial", historialSchema);
