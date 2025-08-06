import { createWebHistory, createRouter } from "vue-router";
import Login from "../components/Login.vue";
import CoursesMenu from "../components/CoursesMenu.vue";
import Course from "../components/Course.vue";
import { checkAuth } from "../api/checkAuth.js";

const routes = [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login, meta: { login: true } },
    { path: "/courses", component: CoursesMenu, meta: { requiresAuth: true } },
    { path: "/courses/:id", component: Course, meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        const authenticated = await checkAuth();
        if (!authenticated) return next("/login");
        next();
    } else if (to.meta.login) {
        const authenticated = await checkAuth();
        if (authenticated) return next("/courses");
        next();
    }
});

export default router;
