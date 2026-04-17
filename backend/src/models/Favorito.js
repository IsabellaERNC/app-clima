import mongoose from "mongoose";

// Modelo de favoritos - guarda las ciudades favoritas de cada usuario
const favoritoSchema = new mongoose.Schema(
  {
    // Usuario al que pertenece el favorito
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Nombre de la ciudad favorita
    ciudad: {
      type: String,
      required: true,
      trim: true,
    },
  },
  // Agrega createdAt y updatedAt automáticamente
  { timestamps: true },
);

export default mongoose.model("Favorito", favoritoSchema);
