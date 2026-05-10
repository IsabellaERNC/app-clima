<template>
  <div class="detalle-container">
    <nav class="navbar">
      <h1>🌤️ Detalle del Clima</h1>
      <div class="nav-right">
        <router-link to="/favoritos">⭐ Favoritos</router-link>
        <router-link to="/clima">🔍 Buscar</router-link>
        <button @click="handleLogout">Cerrar sesión</button>
      </div>
    </nav>

    <div class="content">
      <!-- Botón volver -->
      <button class="volver-btn" @click="$router.back()">← Volver</button>

      <!-- Cargando -->
      <div v-if="cargando" class="cargando">
        <p>Cargando clima...</p>
      </div>

      <!-- Error -->
      <div v-if="error" class="error">{{ error }}</div>

      <!-- Detalle del clima -->
      <div v-if="clima" class="detalle-card">
        <div class="detalle-header">
          <h2>{{ clima.ciudad }}</h2>
          <img
            :src="`https://openweathermap.org/img/wn/${clima.icono}@2x.png`"
            :alt="clima.descripcion"
          />
          <p class="temperatura">{{ Math.round(clima.temperatura) }}°C</p>
          <p class="descripcion">{{ clima.descripcion }}</p>
        </div>

        <div class="detalle-info">
          <div class="info-item">
            <span class="info-label">💧 Humedad</span>
            <span class="info-valor">{{ clima.humedad }}%</span>
          </div>
          <div class="info-item">
            <span class="info-label">🌡️ Sensación térmica</span>
            <span class="info-valor">{{ Math.round(clima.sensacion) }}°C</span>
          </div>
        </div>

        <!-- Botón agregar a favoritos -->
        <button class="favorito-btn" @click="agregarFavorito">⭐ Agregar a favoritos</button>

        <p v-if="mensajeFavorito" class="mensaje-favorito">
          {{ mensajeFavorito }}
        </p>
      </div>

      <!-- Historial de búsquedas -->
      <div v-if="historial.length > 0" class="historial">
        <h3>🕒 Historial de búsquedas</h3>
        <div class="historial-lista">
          <div
            v-for="item in historial"
            :key="item._id"
            class="historial-item"
            @click="$router.push(`/ciudad/${item.ciudad}`)"
          >
            <span>{{ item.ciudad }}</span>
            <span>{{ Math.round(item.temperatura) }}°C</span>
            <span class="historial-fecha">{{ formatFecha(item.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "../stores/auth";
import api from "../services/api";

export default {
  name: "DetalleCiudadView",
  data() {
    return {
      clima: null,
      historial: [],
      cargando: false,
      error: "",
      mensajeFavorito: "",
      authStore: useAuthStore(),
    };
  },
  mounted() {
    // Cargamos el clima de la ciudad que viene en la URL
    this.buscarClima();
    this.cargarHistorial();
  },
  methods: {
    // Busca el clima de la ciudad que viene en params de la URL
    async buscarClima() {
      this.cargando = true;
      this.error = "";
      try {
        const ciudad = this.$route.params.nombre;
        const response = await api.get(`/clima/${ciudad}`);
        this.clima = response.data;
      } catch (e) {
        this.error = "No se pudo cargar el clima de esta ciudad";
      } finally {
        this.cargando = false;
      }
    },

    // Carga el historial de búsquedas del usuario
    async cargarHistorial() {
      try {
        const response = await api.get("/clima/historial/mis-busquedas");
        this.historial = response.data;
      } catch (e) {
        console.error("Error cargando historial:", e);
      }
    },

    // Agrega la ciudad actual a favoritos
    async agregarFavorito() {
      try {
        await api.post("/favoritos", { ciudad: this.clima.ciudad });
        this.mensajeFavorito = "⭐ Ciudad agregada a favoritos";
      } catch (e) {
        this.mensajeFavorito = "Esta ciudad ya está en favoritos";
      }
    },

    // Formatea la fecha a formato legible
    formatFecha(fecha) {
      return new Date(fecha).toLocaleDateString("es-CO", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
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
.detalle-container {
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
  max-width: 700px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.volver-btn {
  background: rgba(255, 255, 255, 0.3);
  border: none;
  color: rgb(0, 0, 0);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 1.5rem;
}
.cargando {
  text-align: center;
  color: white;
  font-size: 1.2rem;
  padding: 2rem;
}
.error {
  background: #fee;
  color: #c00;
  padding: 0.5rem;
  border-radius: 8px;
  text-align: center;
}
.detalle-card {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  color: rgb(0, 0, 0);
  margin-bottom: 1.5rem;
}
.detalle-header h2 {
  font-size: 2.5rem;
  margin: 0;
}
.temperatura {
  font-size: 5rem;
  font-weight: bold;
  margin: 0;
}
.descripcion {
  font-size: 1.3rem;
  text-transform: capitalize;
  margin-bottom: 1.5rem;
}
.detalle-info {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin: 1.5rem 0;
}
.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}
.info-label {
  font-size: 0.9rem;
  opacity: 0.8;
}
.info-valor {
  font-size: 1.5rem;
  font-weight: bold;
}
.favorito-btn {
  padding: 0.7rem 2rem;
  background: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
}
.mensaje-favorito {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}
.historial {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  color: rgb(0, 0, 0);
}
.historial h3 {
  margin: 0 0 1rem 0;
}
.historial-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.historial-item:hover {
  background: rgba(255, 255, 255, 0.2);
}
.historial-fecha {
  font-size: 0.8rem;
  opacity: 0.8;
}
</style>
