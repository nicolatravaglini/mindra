import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore(
    "user",
    () => {
        const name = ref("");
        const picture = ref("");
        function $reset() {
            name.value = "";
            picture.value = "";
        }

        return { name, picture, $reset };
    },
    { persist: true },
);
