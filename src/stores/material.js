import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useMaterialsStore = defineStore(
    "material",
    () => {
        const materials = ref([]);

        function $reset() {
            materials.value = [];
        }

        return { materials, $reset };
    },
    { persist: true },
);
