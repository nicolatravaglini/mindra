import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/router.js";
import GoogleSignInPlugin from "vue3-google-signin";

const app = createApp(App);
app.use(router);
app.use(GoogleSignInPlugin, {
    clientId:
        "71677208610-9ccg33h9hb9bbo31m8uoqoa1n6g9nn71.apps.googleusercontent.com",
});

app.mount("#app");
