<template>
  <div class="clima-container">
    <nav class="navbar">
      <h1>App de Clima</h1>
      <div class="nav-right">
        <span>Hola, {{ authStore.usuario?.nombre }}</span>
        <button @click="handleLogout">Cerrar sesión</button>
      </div>
    </nav>

    <div class="content">
      <div class="search-box">
        <input
          v-model="ciudad"
          @keyup.enter="buscarClima"
          type="text"
          placeholder="Busca una ciudad..."
        />
        <button @click="buscarClima" :disabled="cargando">
          {{ cargando ? "..." : "🔍" }}
        </button>
      </div>

      <div v-if="error" class="error">{{ error }}</div>

      <div v-if="clima" class="clima-card">
        <h2>{{ clima.ciudad }}</h2>
        <img
          :src="`https://openweathermap.org/img/wn/${clima.icono}@2x.png`"
          :alt="clima.descripcion"
        />
        <p class="temperatura">{{ Math.round(clima.temperatura) }}°C</p>
        <p class="descripcion">{{ clima.descripcion }}</p>
        <div class="detalles">
          <div>
            <span> Humedad</span>
            <span>{{ clima.humedad }}%</span>
          </div>
          <div>
            <span> Sensación</span>
            <span>{{ Math.round(clima.sensacion) }}°C</span>
          </div>
        </div>
      </div>

      <div v-if="historial.length > 0" class="historial">
        <h3>Historial de búsquedas</h3>
        <div class="historial-lista">
          <div
            v-for="item in historial"
            :key="item._id"
            class="historial-item"
            @click="buscarDesdeHistorial(item.ciudad)"
          >
            <span>{{ item.ciudad }}</span>
            <span>{{ Math.round(item.temperatura) }}°C</span>
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
  name: "ClimaView",
  data() {
    return {
      ciudad: "",
      clima: null,
      historial: [],
      error: "",
      cargando: false,
      authStore: useAuthStore(),
    };
  },
  mounted() {
    this.cargarHistorial();
  },
  methods: {
    async buscarClima() {
      if (!this.ciudad.trim()) return;
      this.error = "";
      this.cargando = true;
      try {
        const response = await api.get(`/clima/${this.ciudad}`);
        this.clima = response.data;
        await this.cargarHistorial();
      } catch (e) {
        this.error = "Ciudad no encontrada";
      } finally {
        this.cargando = false;
      }
    },
    async cargarHistorial() {
      try {
        const response = await api.get("/clima/historial/mis-busquedas");
        this.historial = response.data;
      } catch (e) {
        console.error(e);
      }
    },
    buscarDesdeHistorial(ciudad) {
      this.ciudad = ciudad;
      this.buscarClima();
    },
    handleLogout() {
      this.authStore.logout();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.clima-container {
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
  color: white;
  margin: 0;
}
.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
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
  max-width: 600px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.search-box {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.search-box input {
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
}
.search-box button {
  padding: 0.8rem 1.2rem;
  background: white;
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
  cursor: pointer;
}
.clima-card {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  color: white;
  margin-bottom: 1.5rem;
}
.clima-card h2 {
  font-size: 2rem;
  margin: 0;
}
.temperatura {
  font-size: 4rem;
  font-weight: bold;
  margin: 0;
}
.descripcion {
  font-size: 1.2rem;
  text-transform: capitalize;
}
.detalles {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}
.detalles div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}
.historial {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  color: white;
}
.historial h3 {
  margin: 0 0 1rem 0;
}
.historial-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.historial-item:hover {
  background: rgba(255, 255, 255, 0.2);
}
.error {
  background: #fee;
  color: #c00;
  padding: 0.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
}
</style>
