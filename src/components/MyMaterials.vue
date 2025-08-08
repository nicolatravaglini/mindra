<script setup>
import { ref, onMounted } from "vue";
import Navbar from "./Navbar.vue";
import { useSectionLoader } from "../composables/useSectionLoader.js";
import { getMaterialsFromUserId, deleteMaterialById } from "../api/material.js";
import { useMaterialsStore } from "../stores/material.js";

const materialsStore = useMaterialsStore();

const { isLoading: isLoadingMyMaterials, load: loadMyMaterials } =
    useSectionLoader("mymaterials");

async function refreshMaterials() {
    loadMyMaterials(async () => {
        const fresh = await getMaterialsFromUserId();
        materialsStore.materials = fresh;
    });
}

function getFileIconClass(fileName) {
    const ext = fileName.toLowerCase().split(".").pop();
    switch (ext) {
        case "txt":
            return "bi bi-file-earmark-text";
        case "md":
            return "bi bi-markdown";
        default:
            return "bi bi-file-earmark";
    }
}

async function deleteFile(index) {
    const id = materialsStore.materials[index]._id;
    await deleteMaterialById(id);
    await refreshMaterials();
}

onMounted(async () => {
    await refreshMaterials();
});
</script>

<template>
    <div class="container-fluid">
        <Navbar />

        <div class="container pt-5">
            <div v-if="isLoadingMyMaterials" class="text-center">
                <div class="spinner-border" role="status"></div>
            </div>

            <div v-else>
                <div
                    v-if="materialsStore.materials.length === 0"
                    class="text-muted"
                >
                    No files.
                </div>

                <div class="d-flex flex-wrap gap-3">
                    <div
                        v-for="(file, index) in materialsStore.materials"
                        :key="index"
                        class="position-relative border rounded p-3 bg-light text-dark d-flex flex-column align-items-start"
                        style="width: 180px; height: 75px"
                    >
                        <!-- Icon + name -->
                        <div class="d-flex align-items-center gap-2">
                            <i
                                :class="getFileIconClass(file.fileName)"
                                class="fs-4"
                            ></i>
                            <span
                                class="text-truncate small"
                                style="max-width: 110px"
                            >
                                {{ file.fileName }}
                            </span>
                        </div>

                        <!-- Button for removing -->
                        <button
                            type="button"
                            class="btn-close position-absolute top-0 end-0 m-2"
                            aria-label="Close"
                            @click="deleteFile(index)"
                        ></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
