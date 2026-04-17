// Importamos las funciones necesarias de Vue Router
import { createRouter, createWebHistory } from "vue-router";

// Importamos el store de autenticación para saber
// si el usuario está logueado o no
import { useAuthStore } from "../stores/auth";

// Creamos el router con todas las rutas de la app
const router = createRouter({
  // createWebHistory → usa URLs limpias como /login, /clima
  // en vez de /#/login, /#/clima
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      // Ruta raíz → redirige automáticamente al login
      path: "/",
      redirect: "/login",
    },
    {
      // Ruta del login
      // component: () => import() → carga el componente solo cuando
      // el usuario navega a esta ruta (carga lazy)
      // Esto hace la app más rápida
      path: "/login",
      name: "login",
      component: () => import("../views/auth/LoginView.vue"),
    },
    {
      // Ruta del registro
      path: "/registro",
      name: "registro",
      component: () => import("../views/auth/RegistroView.vue"),
    },
    {
      // Ruta del clima - es una ruta PRIVADA
      path: "/clima",
      name: "clima",
      component: () => import("../views/ClimaView.vue"),

      // meta: { requiresAuth: true } → marca esta ruta como privada
      // El Navigation Guard de abajo la leerá para saber
      // si necesita verificar si el usuario está logueado
      meta: { requiresAuth: true },
    },
  ],
});

// ==========================================
// NAVIGATION GUARD
// ==========================================
// Esto es lo que pide el profe: "Navigation Guards para proteger rutas privadas"
// Se ejecuta ANTES de cada navegación - es como un guardia en la puerta
// to → la ruta a donde va el usuario
// from → la ruta de donde viene
// next → función que decide qué hacer
router.beforeEach((to, from, next) => {
  // Leemos el store para saber si el usuario está logueado
  const authStore = useAuthStore();

  // CASO 1: Si la ruta necesita autenticación (requiresAuth: true)
  // y el usuario NO está logueado
  // → lo mandamos al login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  }

  // CASO 2: Si el usuario YA está logueado
  // e intenta ir al login o registro
  // → lo mandamos al clima (ya no necesita loguearse)
  else if ((to.path === "/login" || to.path === "/registro") && authStore.isAuthenticated) {
    next("/clima");
  }

  // CASO 3: Todo está bien → dejamos pasar
  else {
    next();
  }
});

export default router;
