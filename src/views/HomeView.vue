<template>
  <div class="home-view">
    <h1>Bienvenido a tu App de Clima</h1>

    <!-- Seccion de Ciudades Favoritas -->
    <section v-if="authStore.isAuthenticated">
      <h2>Mis Ciudades Favoritas</h2>
      <div v-if="favoriteCitiesStore.isLoading">Cargando favoritos...</div>
      <div v-else-if="favoriteCitiesStore.error" class="error-message">
        {{ favoriteCitiesStore.error }}
      </div>
      <ul v-else-if="favoriteCitiesStore.favoriteCities.length > 0">
        <li v-for="city in favoriteCitiesStore.favoriteCities" :key="city.cityId">
          <!-- Enlace para ver el clima de la ciudad favorita -->
          <router-link :to="`/clima/${city.cityId}`">
            {{ city.name }} ({{ city.country }})
          </router-link>
          <!-- Boton para quitar de favoritos -->
          <button
            @click="removeCity(city.cityId)"
            :disabled="favoriteCitiesStore.isLoading"
            class="remove-fav-button"
          >
            Quitar
          </button>
        </li>
      </ul>
      <p v-else>Aun no tienes ciudades favoritas. ¡Agrega algunas!</p>
    </section>
    <section v-else>
      <p>Inicia sesion para ver y gestionar tus ciudades favoritas.</p>
      <!-- Opcional: Boton para ir a login -->
      <router-link to="/login" class="login-button">Iniciar Sesion</router-link>
    </section>

    <!-- Aqui podrias tener otras secciones de tu HomeView -->
    <!-- Por ejemplo, un enlace a la vista de Clima -->
    <div class="clima-link-section">
      <router-link to="/clima" class="clima-link">Ir a la busqueda de Clima</router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useFavoriteCitiesStore } from "@/stores/favoriteCities"; // Asegurate que la ruta sea correcta
import { useAuthStore } from "@/stores/auth"; // Para obtener el userId y el estado de autenticacion
import { useRouter } from "vue-router"; // Para navegacion si es necesario

const favoriteCitiesStore = useFavoriteCitiesStore();
const authStore = useAuthStore();
const router = useRouter(); // Si necesitas redirigir o usar rutas

// Cargar las ciudades favoritas cuando se monta la vista
onMounted(() => {
  // Solo intentar cargar si el usuario esta autenticado
  if (authStore.isAuthenticated) {
    favoriteCitiesStore.fetchFavoriteCities();
  }
});

// Funcion para quitar una ciudad de favoritas
const removeCity = async (cityId) => {
  const success = await favoriteCitiesStore.removeFavoriteCity(cityId);
  if (success) {
    console.log("Ciudad eliminada de favoritos.");
    // Opcional: Mostrar un mensaje de exito temporal
  } else {
    console.error("Error al eliminar ciudad de favoritos.");
    // El error ya se muestra en el store
  }
};
</script>

<style scoped>
.home-view {
  padding: 2rem;
  text-align: center;
}

.home-view section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-background-soft);
}

.home-view h2 {
  color: var(--color-heading);
  margin-bottom: 1.5rem;
}

.home-view ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.home-view li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border-hover);
}

.home-view li:last-child {
  border-bottom: none;
}

.home-view li span {
  font-size: 1.1rem;
}

.home-view li .remove-fav-button {
  padding: 6px 12px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.9rem;
}

.home-view li .remove-fav-button:hover {
  background-color: #c0392b;
}

.home-view li .remove-fav-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.home-view a {
  text-decoration: none;
  color: #4caf50;
  font-weight: bold;
  transition: color 0.3s ease;
}

.home-view a:hover {
  color: #367c39;
  text-decoration: underline;
}

.home-view p {
  color: var(--color-text);
  font-size: 1rem;
}

.login-button {
  display: inline-block;
  margin-top: 1rem;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #367c39;
}

.clima-link-section {
  margin-top: 40px;
}

.clima-link {
  font-size: 1.2rem;
  color: #2c3e50;
  font-weight: bold;
}

.clima-link:hover {
  color: #34495e;
  text-decoration: underline;
}

.error-message {
  color: #e74c3c;
  margin-top: 10px;
  font-weight: bold;
}
</style>
