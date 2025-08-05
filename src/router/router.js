import { createMemoryHistory, createRouter } from 'vue-router';
import CoursesMenu from '../components/CoursesMenu.vue';

const routes = [
  { path: '/', component: CoursesMenu },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default { router };
