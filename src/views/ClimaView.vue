<template>
  <div class="clima-container">
    <!-- Barra de navegacion superior -->
    <nav class="navbar">
      <h1>🌤️ App de Clima</h1>
      <div class="nav-right">
        <router-link to="/favoritos">⭐ Favoritos</router-link>
        <span>Hola, {{ authStore.usuario?.nombre }}</span>
        <button @click="handleLogout">Cerrar sesión</button>
      </div>
    </nav>

    <div class="content">
      <!-- Caja de busqueda centrada arriba -->
      <div class="search-box">
        <input
          v-model="ciudad"
          @keyup.enter="buscarClima"
          type="text"
          placeholder="🔍 Busca una ciudad..."
        />
        <button @click="buscarClima" :disabled="cargando">
          {{ cargando ? "..." : "Buscar" }}
        </button>
      </div>

      <!-- Error -->
      <div v-if="error" class="error">{{ error }}</div>

      <!-- Layout de dos columnas -->
      <div class="grid-layout">
        <!-- Columna izquierda - resultado del clima -->
        <div class="columna-izquierda">
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
                <span>💧 Humedad</span>
                <span>{{ clima.humedad }}%</span>
              </div>
              <div>
                <span>🌡️ Sensación</span>
                <span>{{ Math.round(clima.sensacion) }}°C</span>
              </div>
            </div>
            <button class="agregar-fav-btn" @click="agregarFavorito">⭐ Agregar a favoritos</button>
            <!-- Mensaje cuando se agrega o ya existe un favorito -->
            <p v-if="mensajeFavorito" class="mensaje-favorito">
              {{ mensajeFavorito }}
            </p>
          </div>

          <!-- Mensaje cuando no hay búsqueda -->
          <div v-else class="sin-busqueda">
            <p>🌍 Busca una ciudad para ver el clima</p>
          </div>
        </div>

        <!-- Columna derecha - historial -->
        <div class="columna-derecha">
          <div v-if="historial.length > 0" class="historial">
            <h3>🕒 Historial de búsquedas</h3>
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

          <div v-else class="sin-historial">
            <p>📋 Tu historial aparecerá aquí</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Importamos el store para saber quien esta logueado
import { useAuthStore } from "../stores/auth";

// Importamos api (axios) para hacer peticiones al backend
import api from "../services/api";

export default {
  name: "ClimaView",

  data() {
    return {
      ciudad: "", // ciudad que escribe el usuario
      clima: null, // datos del clima que devuelve el backend
      historial: [], // lista de busquedas anteriores
      error: "", // mensaje de error si hay uno
      cargando: false, // controla si el botón esta deshabilitado
      authStore: useAuthStore(), // accedemos al store de autenticacion
      favoritos: [],
      mensajeFavorito: "", //nuevo
    };
  },

  // mounted → se ejecuta cuando el componente carga
  // Cargamos el historial automaticamente al entrar
  mounted() {
    this.cargarHistorial();
    this.cargarFavoritos();
  },

  methods: {
    // Funcion para buscar el clima de una ciudad
    async buscarClima() {
      // Si el input esta vacio, no hacemos nada
      if (!this.ciudad.trim()) return;

      this.error = "";
      this.cargando = true;

      try {
        // Llamamos al backend GET /api/clima/Cali
        // api.js agrega el token automaticamente
        const response = await api.get(`/clima/${this.ciudad}`);

        // Guardamos los datos del clima
        this.clima = response.data;

        // Actualizamos el historial con la nueva busqueda
        await this.cargarHistorial();
      } catch (e) {
        this.error = "Ciudad no encontrada";
      } finally {
        this.cargando = false;
      }
    },

    // Funcion para cargar el historial de busquedas
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

    // Funcion para buscar desde el historial
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
        //mostar mensaje de exitp
        this.mensajeFavorito = "⭐ Ciudad agregada a favoritos exitosamente";
        await this.cargarFavoritos();
      } catch (e) {
        //mostramos mensaje si ya existe
        this.mensajeFavorito = "⚠️ Esta ciudad ya está en favoritos";
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

    // Funcion para cerrar sesion
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
  max-width: 1100px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.search-box {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
.search-box input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
.search-box button {
  padding: 1rem 2rem;
  background: white;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
.search-box button:disabled {
  opacity: 0.6;
}
.error {
  background: #fee;
  color: #c00;
  padding: 0.5rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1rem;
}
.grid-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}
@media (max-width: 768px) {
  .grid-layout {
    grid-template-columns: 1fr;
  }
}
.clima-card {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  color: rgb(0, 0, 0);
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
  margin: 1rem 0;
}
.detalles div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}
.agregar-fav-btn {
  padding: 0.6rem 1.5rem;
  background: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
}
.sin-busqueda {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  color: rgb(0, 0, 0);
  font-size: 1.2rem;
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
  padding: 0.7rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
.historial-item:hover {
  background: rgba(255, 255, 255, 0.2);
}
.sin-historial {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  color: white;
}
.mensaje-favorito {
  text-align: center;
  color: rgb(0, 0, 0);
  font-weight: bold;
  margin-top: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  border-radius: 8px;
}
</style>
