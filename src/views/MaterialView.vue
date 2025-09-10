<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getMaterialById } from "../api/material.js";
import Content from "../components/Content.vue";
import markdownit from "markdown-it";

const md = markdownit();

const route = useRoute();
const material = ref({});
const ext = computed(() =>
    material.value.fileName?.toLowerCase().split(".").pop(),
);

async function refreshMaterial() {
    const id = route.params.id;
    material.value = await getMaterialById(id);
}

onMounted(async () => {
    await refreshMaterial();
});
</script>

<template>
    <div class="container-fluid">
        <div class="container pt-5">
            <!-- Title -->
            <div class="mb-4 border-bottom">
                <h1>{{ material.fileName }}</h1>
            </div>

            <!-- Content -->
            <div v-if="ext === 'md'" class="mt-4">
                <Content :content="md.render(material.content)" />
            </div>
            <div v-else-if="ext in ['pdf', 'txt']" class="mt-4">
                {{ material.content }}
            </div>
        </div>
    </div>
</template>

<style scoped></style>
