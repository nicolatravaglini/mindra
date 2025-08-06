import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useCourseStore = defineStore(
    "course",
    () => {
        const _id = ref("");
        const name = ref("");
        const userId = ref("");
        const materialIds = ref([]);
        const course = ref([]);

        function $reset() {
            _id.value = "";
            name.value = "";
            userId.value = "";
            materialIds.value = [];
            course.value = [];
        }

        function set(data) {
            Object.assign(this, data);
        }

        return { _id, name, userId, materialIds, course, $reset, set };
    },
    { persist: true },
);
