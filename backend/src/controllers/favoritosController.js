import Favorito from "../models/Favorito.js";

// Obtener todos los favoritos del usuario logueado
export const getFavoritos = async (req, res) => {
  try {
    const favoritos = await Favorito.find({ usuario: req.usuario.id }).sort({ createdAt: -1 });
    res.json(favoritos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Agregar una ciudad a favoritos
export const agregarFavorito = async (req, res) => {
  try {
    const { ciudad } = req.body;

    // Verificamos si la ciudad ya está en favoritos
    const yaExiste = await Favorito.findOne({
      usuario: req.usuario.id,
      ciudad: ciudad,
    });

    if (yaExiste) {
      return res.status(400).json({ message: "Esta ciudad ya está en favoritos" });
    }

    // Creamos el favorito
    const favorito = await Favorito.create({
      usuario: req.usuario.id,
      ciudad,
    });

    res.status(201).json(favorito);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar una ciudad de favoritos
export const eliminarFavorito = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscamos el favorito y verificamos que pertenezca al usuario
    const favorito = await Favorito.findOneAndDelete({
      _id: id,
      usuario: req.usuario.id,
    });

    if (!favorito) {
      return res.status(404).json({ message: "Favorito no encontrado" });
    }

    res.json({ message: "Favorito eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
