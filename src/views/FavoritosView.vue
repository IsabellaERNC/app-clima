<template>
  <div class="favoritos-container">
    <nav class="navbar">
      <h1>⭐ Mis Favoritos</h1>
      <div class="nav-right">
        <router-link to="/clima">🔍 Buscar</router-link>
        <span>Hola, {{ authStore.usuario?.nombre }}</span>
        <button @click="handleLogout">Cerrar sesión</button>
      </div>
    </nav>

    <div class="content">
      <!-- Mensaje si no hay favoritos -->
      <div v-if="favoritos.length === 0" class="sin-favoritos">
        <p>⭐ No tienes ciudades favoritas aún</p>
        <router-link to="/clima">Busca una ciudad para agregarla</router-link>
      </div>

      <!-- Grid de favoritos -->
      <div v-else class="favoritos-grid">
        <div v-for="item in favoritos" :key="item._id" class="favorito-card">
          <div class="favorito-info" @click="verDetalle(item.ciudad)">
            <h3>🏙️ {{ item.ciudad }}</h3>
            <p>Agregado el {{ formatFecha(item.createdAt) }}</p>
            <span class="ver-mas">Ver clima →</span>
          </div>
          <button class="eliminar-btn" @click="eliminarFavorito(item._id)">🗑️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "../stores/auth";
import api from "../services/api";

export default {
  name: "FavoritosView",
  data() {
    return {
      favoritos: [],
      authStore: useAuthStore(),
    };
  },
  mounted() {
    this.cargarFavoritos();
  },
  methods: {
    // Carga la lista de favoritos del usuario
    async cargarFavoritos() {
      try {
        const response = await api.get("/favoritos");
        this.favoritos = response.data;
      } catch (e) {
        console.error("Error cargando favoritos:", e);
      }
    },

    // Elimina un favorito por su id
    async eliminarFavorito(id) {
      try {
        await api.delete(`/favoritos/${id}`);
        await this.cargarFavoritos();
      } catch (e) {
        console.error("Error eliminando favorito:", e);
      }
    },

    // Navega a la vista de detalle de la ciudad
    verDetalle(ciudad) {
      this.$router.push(`/ciudad/${ciudad}`);
    },

    // Formatea la fecha a formato legible
    formatFecha(fecha) {
      return new Date(fecha).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },

    // Cierra la sesión del usuario
    handleLogout() {
      this.authStore.logout();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.favoritos-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #74ebd5, #acb6e5);
}
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}
.navbar h1 {
  color: rgb(0, 0, 0);
  margin: 0;
}
.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: rgb(0, 0, 0);
}
.nav-right a {
  color: rgb(0, 0, 0);
  text-decoration: none;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.4rem 1rem;
  border-radius: 8px;
}
.nav-right button {
  padding: 0.4rem 1rem;
  background: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}
.content {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.sin-favoritos {
  text-align: center;
  color: rgb(0, 0, 0);
  padding: 3rem;
}
.sin-favoritos a {
  color: rgb(0, 0, 0);
  font-weight: bold;
  text-decoration: underline;
}
.favoritos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
@media (max-width: 768px) {
  .favoritos-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 480px) {
  .favoritos-grid {
    grid-template-columns: 1fr;
  }
}
.favorito-card {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: transform 0.2s;
}
.favorito-card:hover {
  transform: scale(1.03);
}
.favorito-info {
  cursor: pointer;
  color: rgb(0, 0, 0);
}
.favorito-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}
.favorito-info p {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.8;
}
.ver-mas {
  display: inline-block;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  font-weight: bold;
}
.eliminar-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}
</style>
