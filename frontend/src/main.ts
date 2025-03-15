import { createApp } from "vue";
import { createVfm } from "vue-final-modal";
import "./style.css";
import App from "./App.vue";
import router from "./router/router";

const app = createApp(App);
app.use(createVfm());
app.use(router);
app.mount("#app");
