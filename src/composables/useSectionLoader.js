import { useLoadingStore } from "../stores/loading.js";

export function useSectionLoader(key) {
    const loadingStore = useLoadingStore();
    const isLoading = loadingStore.isLoading(key);

    const load = async (callback) => {
        loadingStore.startLoading(key);
        try {
            await callback();
        } finally {
            loadingStore.stopLoading(key);
        }
    };

    return { isLoading, load };
}
