import { defineStore } from "pinia";
import { reactive, computed } from "vue";

export const useLoadingStore = defineStore("loading", () => {
    const loadingMap = reactive({});

    function startLoading(key) {
        loadingMap[key] = true;
    }

    function stopLoading(key) {
        loadingMap[key] = false;
    }

    function isLoading(key) {
        return computed(() => !!loadingMap[key]);
    }

    return { startLoading, stopLoading, isLoading };
});
