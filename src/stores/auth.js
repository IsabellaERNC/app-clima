// Importamos defineStore de Pinia para crear el store
// Pinia es el manejador de estado global de Vue uso de Pinia para gestionar la sesion
import { defineStore } from "pinia";

// Importamos api (axios configurado) para hacer peticiones al backend
import api from "../services/api";

// Creamos el store llamado "auth"
// Este store maneja todo lo relacionado con la sesion del usuario
// Cualquier componente de Vue puede acceder a este store
export const useAuthStore = defineStore("auth", {
  
  // STATE - son los datos que guardamos-----------

  state: () => ({
    // Leemos el usuario de localStorage cuando la app arranca
    // JSON.parse convierte el texto guardado en un objeto JavaScript
    // Si no hay usuario guardado, es null
    usuario: JSON.parse(localStorage.getItem("usuario")) || null,

    // Leemos el token de localStorage cuando la app arranca
    // Asi el usuario no tiene que loguearse cada vez que abre la app
    token: localStorage.getItem("token") || null,
  }),

 
  // GETTERS - son datos calculados del state-------
  
  getters: {
    // isAuthenticated devuelve true si hay token, false si no hay
    // !! convierte cualquier valor a true o false
    // Se usa para saber si el usuario esta logueado
    isAuthenticated: (state) => !!state.token,

    // isAdmin → devuelve true si el rol del usuario es "admin"
    // El "?" significa que si usuario es null, no da error
    isAdmin: (state) => state.usuario?.rol === "admin",
  },

  // ACTIONS - son las funciones que modifican el state---

  actions: {
    // Funcion de login
    // Recibe email y password, llama al backend y guarda la sesion
    async login(email, password) {
      // Llamamos al backend POST /api/auth/login
      const response = await api.post("/auth/login", { email, password });

      // Guardamos el token y usuario en el state de Pinia
      this.token = response.data.token;
      this.usuario = response.data.usuario;

      // Tambien guardamos en localStorage para que
      // la sesion persista cuando el usuario cierra y abre el navegador
      localStorage.setItem("token", this.token);
      localStorage.setItem("usuario", JSON.stringify(this.usuario));
    },

    // Funcion de registro
    // Recibe nombre, email y password, llama al backend y guarda la sesion
    async registro(nombre, email, password) {
      // Llamamos al backend POST /api/auth/registro
      const response = await api.post("/auth/registro", { nombre, email, password });

      // Guardamos el token y usuario en Pinia y localStorage
      this.token = response.data.token;
      this.usuario = response.data.usuario;
      localStorage.setItem("token", this.token);
      localStorage.setItem("usuario", JSON.stringify(this.usuario));
    },

    // Función de logout (cerrar sesion)
    logout() {
      // Borramos el token y usuario del state de Pinia
      this.token = null;
      this.usuario = null;

      // Tambien los borramos del localStorage
      // Asi el usuario queda completamente deslogueado
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
    },
  },
});
