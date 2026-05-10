// Importamos axios para hacer peticiones a la API de OpenWeatherMap
import axios from "axios";

// Importamos el modelo Historial para guardar las búsquedas en MongoDB
import Historial from "../models/Historial.js";

// FUNCION PARA BUSCAR EL CLIMAAAAAAAAAA

// Se ejecuta cuando alguien hace GET /api/clima/Cali
export const getClima = async (req, res) => {
  try {
    // req.params.ciudad obtiene el nombre de la ciudad de la URL
    // Ejemplo: si la URL es /api/clima/Cali → ciudad = "Cali"
    const { ciudad } = req.params;

    // Leemos la API key de OpenWeatherMap del archivo .env
    const API_KEY = process.env.WEATHER_API_KEY;

    // Le pedimos el clima a OpenWeatherMap
    // q=${ciudad} la ciudad que buscamos
    // appid=${API_KEY} nuestra clave de acceso
    // units=metric temperatura en Celsius (no Fahrenheit)
    // lang=es respuesta en español
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`,
    );

    // Extraemos los datos que nos interesa de la respuesta
    // main temperatura, humedad, sensacion termica
    // weather descripcion e icono del clima
    // name nombre oficial de la ciudad
    const { main, weather, name } = response.data;

    // Guardamos la busqueda en MongoDB para el historial
    // req.usuario.id el id del usuario que esta logueado
    // lo obtenemos del token JWT que verifico el middleware
    await Historial.create({
      usuario: req.usuario.id, // a que usuario pertenece esta busqueda
      ciudad: name, // nombre oficial de la ciudad
      temperatura: main.temp, // temperatura actual
      descripcion: weather[0].description, // ej: "cielo despejado"
      icono: weather[0].icon, // codigo del icono ej: "01d"
    });

    // Devolvemos los datos del clima al frontend
    res.json({
      ciudad: name,
      temperatura: main.temp,
      descripcion: weather[0].description,
      icono: weather[0].icon,
      humedad: main.humidity, // porcentaje de humedad
      sensacion: main.feels_like, // sensacion termica
    });
  } catch (error) {
    // Si la ciudad no existe o hay error, devolvemos mensaje de error
    res.status(500).json({ message: "Ciudad no encontrada" });
  }
};

// FUNCION PARA OBTENER EL HISTORIAL

// Se ejecuta cuando alguien hace GET /api/clima/historial/mis-busquedas
export const getHistorial = async (req, res) => {
  try {
    // Buscamos en MongoDB todas las busquedas del usuario logueado
    // { usuario: req.usuario.id } filtra solo las busquedas de ese usuario
    // .sort({ createdAt: -1 }) → ordena de mas reciente a mas antiguo
    // .limit(10) → trae maximo 10 busquedas
    const historial = await Historial.find({ usuario: req.usuario.id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Devolvemos el historial al frontend
    res.json(historial);
  } catch (error) {
    // Si algo salio mal, devolvemos error
    res.status(500).json({ message: error.message });
  }
};
