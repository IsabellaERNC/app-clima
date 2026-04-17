<template>
  <!-- Contenedor principal que centra todo en la pantalla -->
  <div class="auth-container">
    <div class="auth-card">
      <h2>App de Clima</h2>
      <h3>Iniciar Sesión</h3>

      <!-- v-if="error" → solo muestra este div si hay un error -->
      <!-- {{ error }} → muestra el mensaje de error -->
      <div v-if="error" class="error">{{ error }}</div>

      <!-- @submit.prevent → cuando el usuario envía el formulario
           .prevent evita que la página se recargue (comportamiento normal de HTML)
           y en vez de eso llama a handleLogin() -->
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <!-- v-model="email" → conecta este input con la variable email
               Cuando el usuario escribe, email se actualiza automáticamente -->
          <input v-model="email" type="email" placeholder="tu@email.com" required />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <!-- v-model="password" → conecta con la variable password -->
          <input v-model="password" type="password" placeholder="••••••" required />
        </div>

        <!-- :disabled="cargando" → deshabilita el botón mientras carga
             Evita que el usuario haga clic varias veces -->
        <!-- {{ cargando ? "Cargando..." : "Entrar" }} → 
             Si está cargando muestra "Cargando...", si no muestra "Entrar" -->
        <button type="submit" :disabled="cargando">
          {{ cargando ? "Cargando..." : "Entrar" }}
        </button>
      </form>

      <!-- router-link → es como un <a> pero para Vue Router
           Navega a /registro sin recargar la página -->
      <p>¿No tienes cuenta? <router-link to="/registro">Regístrate</router-link></p>
    </div>
  </div>
</template>

<script>
// Importamos el store de autenticación
import { useAuthStore } from "../../stores/auth";

export default {
  name: "LoginView",

  // data() → variables reactivas del componente
  // Cuando cambian, Vue actualiza la pantalla automáticamente
  data() {
    return {
      email: "", // guarda lo que escribe el usuario en el input email
      password: "", // guarda lo que escribe en el input contraseña
      error: "", // guarda el mensaje de error si hay uno
      cargando: false, // controla si el botón está deshabilitado
    };
  },

  methods: {
    // Función que se ejecuta cuando el usuario hace clic en "Entrar"
    async handleLogin() {
      // Limpiamos el error anterior
      this.error = "";

      // Activamos el estado de cargando
      this.cargando = true;

      try {
        // Obtenemos el store de autenticación
        const authStore = useAuthStore();

        // Llamamos a la función login del store
        // que hace la petición al backend y guarda el token
        await authStore.login(this.email, this.password);

        // Si el login fue exitoso, navegamos a la pantalla del clima
        this.$router.push("/clima");
      } catch (e) {
        // Si hubo error, mostramos el mensaje
        this.error = "Email o contraseña incorrectos";
      } finally {
        // finally se ejecuta siempre, haya error o no
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
