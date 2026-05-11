<template>
  <div class="admin-container">
    <nav class="navbar">
      <h1>⚙️ Panel de Admin</h1>
      <div class="nav-right">
        <router-link to="/clima">🌤️ Inicio</router-link>
        <span>{{ authStore.usuario?.nombre }}</span>
        <button @click="handleLogout">Cerrar sesión</button>
      </div>
    </nav>

    <div class="content">
      <!-- Tabs para cambiar entre usuarios e historial -->
      <div class="tabs">
        <button :class="{ activo: tabActiva === 'usuarios' }" @click="tabActiva = 'usuarios'">
          👥 Usuarios
        </button>
        <button :class="{ activo: tabActiva === 'historial' }" @click="tabActiva = 'historial'">
          🕒 Historial
        </button>
      </div>

      <!-- Tab de usuarios -->
      <div v-if="tabActiva === 'usuarios'">
        <h2>👥 Usuarios registrados ({{ usuarios.length }})</h2>
        <div class="tabla-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Fecha registro</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="usuario in usuarios" :key="usuario._id">
                <td>{{ usuario.nombre }}</td>
                <td>{{ usuario.email }}</td>
                <td>
                  <span :class="`rol rol-${usuario.rol}`">
                    {{ usuario.rol }}
                  </span>
                </td>
                <td>{{ formatFecha(usuario.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab de historial -->
      <div v-if="tabActiva === 'historial'">
        <h2>🕒 Historial de búsquedas</h2>
        <div class="tabla-container">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Ciudad</th>
                <th>Temperatura</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in historial" :key="item._id">
                <td>{{ item.usuario?.nombre }}</td>
                <td>{{ item.ciudad }}</td>
                <td>{{ Math.round(item.temperatura) }}°C</td>
                <td>{{ formatFecha(item.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "../stores/auth";
import api from "../services/api";

export default {
  name: "AdminView",
  data() {
    return {
      usuarios: [],
      historial: [],
      tabActiva: "usuarios",
      authStore: useAuthStore(),
    };
  },
  mounted() {
    this.cargarUsuarios();
    this.cargarHistorial();
  },
  methods: {
    // Carga todos los usuarios del sistema
    async cargarUsuarios() {
      try {
        const response = await api.get("/admin/usuarios");
        this.usuarios = response.data;
      } catch (e) {
        console.error("Error cargando usuarios:", e);
      }
    },

    // Carga todo el historial de busquedas
    async cargarHistorial() {
      try {
        const response = await api.get("/admin/historial");
        this.historial = response.data;
      } catch (e) {
        console.error("Error cargando historial:", e);
      }
    },

    // Formatea la fecha
    formatFecha(fecha) {
      return new Date(fecha).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },

    // Cierra la sesion
    handleLogout() {
      this.authStore.logout();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.admin-container {
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
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}
.tabs button {
  padding: 0.7rem 2rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.3);
  color: rgb(0, 0, 0);
  transition: background 0.2s;
}
.tabs button.activo {
  background: white;
  color: #333;
}
h2 {
  color: rgb(0, 0, 0);
  margin-bottom: 1rem;
}
.tabla-container {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem;
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  color: rgb(0, 0, 0);
}
th {
  text-align: left;
  padding: 0.8rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  font-weight: bold;
}
td {
  padding: 0.8rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
tr:hover td {
  background: rgba(255, 255, 255, 0.1);
}
.rol {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
}
.rol-admin {
  background: #ffd700;
  color: #333;
}
.rol-usuario {
  background: rgba(255, 255, 255, 0.3);
  color: rgb(0, 0, 0);
}
</style>
