// Importamos axios para hacer peticiones HTTP al backend
import axios from "axios";

// Creamos una instancia personalizada de axios
// baseURL → la URL base del backend
// Asi no tenemos que escribir http://localhost:3000/api
// en cada peticion, solo escribimos /auth/login, /clima/Cali, etc.
const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Interceptor de peticiones
// Un interceptor es como un guardia que revisa CADA peticion
// ANTES de que salga hacia el backend
// Axios con interceptores
// para adjuntar el Token en las cabeceras
api.interceptors.request.use((config) => {
  // Leemos el token que guardamos en localStorage cuando el usuario
  // inicio sesion. localStorage guarda datos en el navegador
  const token = localStorage.getItem("token");

  // Si hay token, lo agregamos al header Authorization
  // Asi el usuario no tiene que enviar el token manualmente
  // en cada peticion - se agrega automaticamente
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Devolvemos la configuracion con el token agregado
  return config;
});

// Exportamos api para usarla en toda la app
// En vez de usar axios directamente, usamos api
// para que siempre lleve el token
export default api;
