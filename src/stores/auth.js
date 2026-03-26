import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    usuario: JSON.parse(localStorage.getItem("usuario")) || null,
    token: localStorage.getItem("token") || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.usuario?.rol === "admin",
  },

  actions: {
    async login(email, password) {
      const response = await api.post("/auth/login", { email, password });
      this.token = response.data.token;
      this.usuario = response.data.usuario;
      localStorage.setItem("token", this.token);
      localStorage.setItem("usuario", JSON.stringify(this.usuario));
    },

    async registro(nombre, email, password) {
      const response = await api.post("/auth/registro", { nombre, email, password });
      this.token = response.data.token;
      this.usuario = response.data.usuario;
      localStorage.setItem("token", this.token);
      localStorage.setItem("usuario", JSON.stringify(this.usuario));
    },

    logout() {
      this.token = null;
      this.usuario = null;
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
    },
  },
});
