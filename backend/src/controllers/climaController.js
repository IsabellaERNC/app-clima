import axios from "axios";
import Historial from "../models/Historial.js";

export const getClima = async (req, res) => {
  try {
    const { ciudad } = req.params;
    const API_KEY = process.env.WEATHER_API_KEY;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`,
    );

    const { main, weather, name } = response.data;

    await Historial.create({
      usuario: req.usuario.id,
      ciudad: name,
      temperatura: main.temp,
      descripcion: weather[0].description,
      icono: weather[0].icon,
    });

    res.json({
      ciudad: name,
      temperatura: main.temp,
      descripcion: weather[0].description,
      icono: weather[0].icon,
      humedad: main.humidity,
      sensacion: main.feels_like,
    });
  } catch (error) {
    res.status(500).json({ message: "Ciudad no encontrada" });
  }
};

export const getHistorial = async (req, res) => {
  try {
    const historial = await Historial.find({ usuario: req.usuario.id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(historial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
