<template>
  <div class="clima-container">
    <!-- Barra de navegación superior -->
    <nav class="navbar">
      <h1>App de Clima</h1>
      <div class="nav-right">
        <!-- authStore.usuario?.nombre → muestra el nombre del usuario logueado
             El "?" evita error si usuario es null -->
        <span>Hola, {{ authStore.usuario?.nombre }}</span>

        <!-- Botón para cerrar sesión -->
        <button @click="handleLogout">Cerrar sesión</button>
      </div>
    </nav>

    <div class="content">
      <!-- Caja de búsqueda -->
      <div class="search-box">
        <!-- v-model="ciudad" → conecta con la variable ciudad
             @keyup.enter → busca cuando el usuario presiona Enter -->
        <input
          v-model="ciudad"
          @keyup.enter="buscarClima"
          type="text"
          placeholder="Busca una ciudad..."
        />
        <!-- :disabled="cargando" → deshabilita mientras carga -->
        <button @click="buscarClima" :disabled="cargando">
          {{ cargando ? "..." : "🔍" }}
        </button>
      </div>

      <!-- v-if="error" → solo muestra si hay error -->
      <div v-if="error" class="error">{{ error }}</div>

      <!-- v-if="clima" → solo muestra la card si ya buscó una ciudad -->
      <div v-if="clima" class="clima-card">
        <h2>{{ clima.ciudad }}</h2>

        <!-- Ícono del clima que viene de OpenWeatherMap -->
        <!-- :src → construye la URL del ícono dinámicamente -->
        <img
          :src="`https://openweathermap.org/img/wn/${clima.icono}@2x.png`"
          :alt="clima.descripcion"
        />

        <!-- Math.round → redondea la temperatura a número entero -->
        <p class="temperatura">{{ Math.round(clima.temperatura) }}°C</p>
        <p class="descripcion">{{ clima.descripcion }}</p>

        <div class="detalles">
          <div>
            <span>Humedad</span>
            <span>{{ clima.humedad }}%</span>
          </div>
          <div>
            <span>Sensación</span>
            <span>{{ Math.round(clima.sensacion) }}°C</span>
          </div>
        </div>
      </div>

      <!-- Botón para agregar a favoritos -->
      <div v-if="clima" class="favorito-btn">
        <button @click="agregarFavorito">⭐ Agregar a favoritos</button>
      </div>

      <!-- Lista de favoritos -->
      <div v-if="favoritos.length > 0" class="favoritos">
        <h3>⭐ Ciudades Favoritas</h3>
        <div class="favoritos-lista">
          <div v-for="item in favoritos" :key="item._id" class="favorito-item">
            <span @click="buscarDesdeHistorial(item.ciudad)">{{ item.ciudad }}</span>
            <button @click="eliminarFavorito(item._id)">🗑️</button>
          </div>
        </div>
      </div>

      <!-- v-if="historial.length > 0" → solo muestra si hay búsquedas guardadas -->
      <div v-if="historial.length > 0" class="historial">
        <h3>Historial de búsquedas</h3>
        <div class="historial-lista">
          <!-- v-for → repite un div por cada búsqueda del historial -->
          <!-- :key → identificador único de cada item -->
          <!-- @click → al hacer clic busca esa ciudad de nuevo -->
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
// Importamos el store para saber quién está logueado
import { useAuthStore } from "../stores/auth";

// Importamos api (axios) para hacer peticiones al backend
import api from "../services/api";

export default {
  name: "ClimaView",

  data() {
    return {
      ciudad: "", // ciudad que escribe el usuario
      clima: null, // datos del clima que devuelve el backend
      historial: [], // lista de búsquedas anteriores
      error: "", // mensaje de error si hay uno
      cargando: false, // controla si el botón está deshabilitado
      authStore: useAuthStore(), // accedemos al store de autenticación
      favoritos: [],
    };
  },

  // mounted → se ejecuta cuando el componente carga
  // Cargamos el historial automáticamente al entrar
  mounted() {
    this.cargarHistorial();
    this.cargarFavoritos();
  },

  methods: {
    // Función para buscar el clima de una ciudad
    async buscarClima() {
      // Si el input está vacío, no hacemos nada
      if (!this.ciudad.trim()) return;

      this.error = "";
      this.cargando = true;

      try {
        // Llamamos al backend GET /api/clima/Cali
        // api.js agrega el token automáticamente
        const response = await api.get(`/clima/${this.ciudad}`);

        // Guardamos los datos del clima
        this.clima = response.data;

        // Actualizamos el historial con la nueva búsqueda
        await this.cargarHistorial();
      } catch (e) {
        this.error = "Ciudad no encontrada";
      } finally {
        this.cargando = false;
      }
    },

    // Función para cargar el historial de búsquedas
    async cargarHistorial() {
      try {
        // Llamamos al backend GET /api/clima/historial/mis-busquedas
        const response = await api.get("/clima/historial/mis-busquedas");

        // Guardamos el historial
        this.historial = response.data;
      } catch (e) {
        console.error(e);
      }
    },

    // Función para buscar desde el historial
    // Cuando el usuario hace clic en una ciudad del historial
    buscarDesdeHistorial(ciudad) {
      // Ponemos la ciudad en el input
      this.ciudad = ciudad;

      // Buscamos el clima de esa ciudad
      this.buscarClima();
    },
    // Cargar favoritos del usuario
    async cargarFavoritos() {
      try {
        const response = await api.get("/favoritos");
        this.favoritos = response.data;
      } catch (e) {
        console.error(e);
      }
    },

    // Agregar ciudad actual a favoritos
    async agregarFavorito() {
      try {
        await api.post("/favoritos", { ciudad: this.clima.ciudad });
        await this.cargarFavoritos();
      } catch (e) {
        alert("Esta ciudad ya está en favoritos");
      }
    },

    // Eliminar ciudad de favoritos
    async eliminarFavorito(id) {
      try {
        await api.delete(`/favoritos/${id}`);
        await this.cargarFavoritos();
      } catch (e) {
        console.error(e);
      }
    },

    // Función para cerrar sesión
    handleLogout() {
      // Borramos el token y usuario del store y localStorage
      this.authStore.logout();

      // Navegamos al login
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
.favorito-btn {
  text-align: center;
  margin-bottom: 1.5rem;
}
.favorito-btn button {
  padding: 0.6rem 1.5rem;
  background: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: bold;
}
.favoritos {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  color: white;
  margin-top: 1.5rem;
}
.favoritos h3 {
  margin: 0 0 1rem 0;
}
.favorito-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.favorito-item:hover {
  background: rgba(255, 255, 255, 0.2);
}
.favorito-item button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}
</style>
