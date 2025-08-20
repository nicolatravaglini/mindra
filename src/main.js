import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import router from "./router/router.js";
import GoogleSignInPlugin from "vue3-google-signin";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(router);
app.use(pinia);
app.use(GoogleSignInPlugin, {
    clientId: CLIENT_ID,
});

app.mount("#app");
