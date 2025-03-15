import { createApp } from "vue";
import { createVfm } from "vue-final-modal";
import "./style.css";
import App from "./App.vue";

const app = createApp(App);
app.use(createVfm());
app.mount("#app");
