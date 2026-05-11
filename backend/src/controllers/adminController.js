import User from "../models/User.js";
import Historial from "../models/Historial.js";

// Obtener todos los usuarios registrados
export const getUsuarios = async (req, res) => {
  try {
    // Traemos todos los usuarios sin mostrar la contraseña
    const usuarios = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todo el historial de busquedas de todos los usuarios
export const getTodoHistorial = async (req, res) => {
  try {
    const historial = await Historial.find()
      .populate("usuario", "nombre email") // trae el nombre y email del usuario
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(historial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
