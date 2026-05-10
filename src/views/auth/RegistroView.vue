<template>
  <!-- Contenedor principal que centra todo en la pantalla -->
  <div class="auth-container">
    <div class="auth-card">
      <h2>🌤️ App de Clima</h2>
      <h3>Crear Cuenta</h3>

      <!-- v-if="error" → solo muestra este div si hay un error -->
      <div v-if="error" class="error">{{ error }}</div>

      <!-- @submit.prevent → evita que la pagina se recargue
           y llama a handleRegistro() -->
      <form @submit.prevent="handleRegistro">
        <div class="form-group">
          <label>Nombre</label>
          <!-- v-model="nombre" → conecta con la variable nombre -->
          <input v-model="nombre" type="text" placeholder="Tu nombre" required />
        </div>

        <div class="form-group">
          <label>Email</label>
          <!-- v-model="email" → conecta con la variable email -->
          <input v-model="email" type="email" placeholder="tu@email.com" required />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <!-- v-model="password" → conecta con la variable password -->
          <input v-model="password" type="password" placeholder="••••••" required />
        </div>

        <!-- :disabled="cargando" → deshabilita el boton mientras carga -->
        <button type="submit" :disabled="cargando">
          {{ cargando ? "Cargando..." : "Registrarse" }}
        </button>
      </form>

      <!-- Si ya tiene cuenta, lo manda al login -->
      <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link></p>
    </div>
  </div>
</template>

<script>
// Importamos el store de autenticacion
import { useAuthStore } from "../../stores/auth";

export default {
  name: "RegistroView",

  // Variables reactivas del componente
  data() {
    return {
      nombre: "", // guarda el nombre que escribe el usuario
      email: "", // guarda el email
      password: "", // guarda la contraseña
      error: "", // guarda el mensaje de error
      cargando: false, // controla si el boton esta deshabilitado
    };
  },

  methods: {
    // Funcion que se ejecuta cuando el usuario hace clic en "Registrarse"
    async handleRegistro() {
      // Limpiamos el error anterior
      this.error = "";

      // Activamos el estado de cargando
      this.cargando = true;

      try {
        // Obtenemos el store de autenticacion
        const authStore = useAuthStore();

        // Llamamos a la funcion registro del store
        // que hace la peticion al backend con nombre, email y password
        await authStore.registro(this.nombre, this.email, this.password);

        // Si el registro fue exitoso, navegamos al clima
        this.$router.push("/clima");
      } catch (e) {
        // Si hubo error, mostramos el mensaje
        this.error = "Error al registrarse, intenta de nuevo";
      } finally {
        // Se ejecuta siempre, haya error o no
        // Desactivamos el estado de cargando
        this.cargando = false;
      }
    },
  },
};
</script>
<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #74ebd5, #acb6e5);
}
.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}
h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
h3 {
  color: #555;
  margin-bottom: 1.5rem;
}
.form-group {
  margin-bottom: 1rem;
  text-align: left;
}
label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: bold;
  color: #333;
}
input {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(135deg, #74ebd5, #acb6e5);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 0.5rem;
}
button:disabled {
  opacity: 0.6;
}
.error {
  background: #fee;
  color: #c00;
  padding: 0.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}
p {
  margin-top: 1rem;
  color: #555;
}
a {
  color: #74ebd5;
  font-weight: bold;
}
</style>
