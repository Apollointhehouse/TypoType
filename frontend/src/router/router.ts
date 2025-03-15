import { createWebHistory, createRouter } from "vue-router";

import GameInterface from "../pages/GameInterface.vue";
import UserEntry from "../pages/UserEntry.vue";

const routes = [
  { path: "/", component: UserEntry },
  { path: "/type-test", component: GameInterface },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
