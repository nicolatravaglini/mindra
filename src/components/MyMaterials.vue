<script setup>
import { ref, onMounted } from "vue";
import Navbar from "./Navbar.vue";
import FileList from "./FileList.vue";
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

            <FileList
                v-else
                :fileList="materialsStore.materials"
                :deleteFile="deleteFile"
            />
        </div>
    </div>
</template>

<style scoped></style>
