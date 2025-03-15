import { createWebHistory, createRouter } from "vue-router";

import UserEntry from "@/pages/UserEntry.vue";
import GameInterface from "@/pages/GameInterface.vue";
import VirtualKeyboard from "@/components/gameinterface-components/virtual-keyboard-components/VirtualKeyboard.vue";
import Footer from "@/components/gameinterface-components/footer-components/Footer.vue";
import Score from "@/pages/Score.vue";
import GodSphere from "@/components/gameinterface-components/cheat-sphere-components/CheatSphere.vue";

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
