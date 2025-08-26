import { createWebHistory, createRouter } from "vue-router";
import Login from "../components/Login.vue";
import CoursesMenu from "../views/CoursesMenu.vue";
import CourseView from "../views/CourseView.vue";
import MyMaterials from "../views/MyMaterials.vue";
import MicroView from "../views/MicroView.vue";
import { checkAuth } from "../api/checkAuth.js";

const routes = [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login, meta: { login: true } },
    { path: "/courses", component: CoursesMenu, meta: { requiresAuth: true } },
    {
        path: "/courses/:id",
        component: CourseView,
        meta: { requiresAuth: true },
    },
    {
        path: "/courses/:id/:macroIdx/:microIdx",
        component: MicroView,
        meta: { requiresAuth: true },
    },
    {
        path: "/mymaterials",
        component: MyMaterials,
        meta: { requiresAuth: true },
    },
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
