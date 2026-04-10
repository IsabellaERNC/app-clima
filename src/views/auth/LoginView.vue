```vue
<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>App de Clima</h2>
      <h3>Iniciar Sesión</h3>

      <div v-if="error" class="error">{{ error }}</div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="tu@email.com" required />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="password" type="password" placeholder="••••••" required />
        </div>

        <button type="submit" :disabled="cargando">
          {{ cargando ? "Cargando..." : "Entrar" }}
        </button>
      </form>

      <p>¿No tienes cuenta? <router-link to="/registro">Regístrate</router-link></p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "../../stores/auth";

export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
      error: "",
      cargando: false,
    };
  },
  methods: {
    async handleLogin() {
      this.error = "";
      this.cargando = true;
      try {
        const authStore = useAuthStore();
        await authStore.login(this.email, this.password);
        this.$router.push("/clima");
      } catch (e) {
        this.error = "Email o contraseña incorrectos";
      } finally {
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

```
