import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/auth/LoginView.vue"),
    },
    {
      path: "/registro",
      name: "registro",
      component: () => import("../views/auth/RegistroView.vue"),
    },
    {
      path: "/clima",
      name: "clima",
      component: () => import("../views/ClimaView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/favoritos",
      name: "favoritos",
      component: () => import("../views/FavoritosView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/ciudad/:nombre",
      name: "detalle",
      component: () => import("../views/DetalleCiudadView.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

// Navigation Guard - protege rutas privadas
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else if ((to.path === "/login" || to.path === "/registro") && authStore.isAuthenticated) {
    next("/clima");
  } else {
    next();
  }
});

export default router;
