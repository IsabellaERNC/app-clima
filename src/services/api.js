// Importamos axios para hacer peticiones HTTP al backend
import axios from "axios";

// Creamos una instancia personalizada de axios
// baseURL → la URL base del backend
// Así no tenemos que escribir http://localhost:3000/api
// en cada petición, solo escribimos /auth/login, /clima/Cali, etc.
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Interceptor de peticiones
// Un interceptor es como un guardia que revisa CADA petición
// ANTES de que salga hacia el backend
// Esto es lo que pide el profe: "Axios con interceptores
// para adjuntar el Token en las cabeceras"
api.interceptors.request.use((config) => {
  // Leemos el token que guardamos en localStorage cuando el usuario
  // inició sesión. localStorage guarda datos en el navegador
  const token = localStorage.getItem("token");

  // Si hay token, lo agregamos al header Authorization
  // El backend lo leerá así: "Bearer eyJhbGci..."
  // Así el usuario no tiene que enviar el token manualmente
  // en cada petición - se agrega automáticamente
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Devolvemos la configuración con el token agregado
  return config;
});

// Exportamos api para usarla en toda la app
// En vez de usar axios directamente, usamos api
// para que siempre lleve el token
export default api;
