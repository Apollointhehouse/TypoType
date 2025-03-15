import { createWebHistory, createRouter } from "vue-router";

import GameInterface from "../pages/GameInterface.vue";
import UserEntry from "../pages/UserEntry.vue";
import Score from "../pages/Score.vue";

const routes = [
  { path: "/", component: UserEntry },
  { path: "/type-test", component: GameInterface },
  { path: "/scores", component: Score },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
