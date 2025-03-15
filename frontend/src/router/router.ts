import { createWebHistory, createRouter } from "vue-router";

import UserEntry from "../pages/UserEntry.vue";
import GameInterface from "../pages/GameInterface.vue";
import VirtualKeyboard from "../components/gameinteface-components/Cheats/VirtualKeyboard.vue";
import Footer from "../components/footer-components/Footer.vue";
import Score from "../pages/Score.vue";
import GodSphere from "../components/gameinteface-components/GodSphere/GodSphere.vue";

const routes = [
  { path: "/", component: UserEntry },
  { path: "/type-test", component: GameInterface },
  { path: "/virtual-keyboard", component: VirtualKeyboard },
  { path: "/footer", component: Footer },
  { path: "/scores", component: Score },
  { path: "/god-sphere", component: GodSphere },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
