import { createWebHistory, createRouter } from "vue-router";

import GameInterface from "../pages/GameInterface.vue";
import UserEntry from "../pages/UserEntry.vue";
import VirtualKeyboard from "../components/gameinteface-components/Cheats/VirtualKeyboard.vue";
import Footer from "../components/footer-components/Footer.vue";

const routes = [
  { path: "/", component: UserEntry },
  { path: "/type-test", component: GameInterface },
  { path: "/virtual-keyboard", component: VirtualKeyboard },
  { path: "/footer", component: Footer }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
