import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useCourseStore = defineStore(
    "course",
    () => {
        const _id = ref("");
        const name = ref("");
        const userId = ref("");
        function $reset() {
            _id.value = "";
            name.value = "";
            userId.value = "";
        }

        return { _id, name, userId, $reset };
    },
    { persist: true },
);
