<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCourseStore } from "../stores/course.js";
import Content from "../components/Content.vue";

const router = useRouter();
const route = useRoute();

const courseStore = useCourseStore();

const micro = ref({});

onMounted(() => {
    micro.value =
        courseStore.course[route.params.macroIdx].micro[route.params.microIdx];
    console.log(micro.value);
});
</script>

<template>
    <div class="container">
        <div class="mt-3 fs-3 py-2 border-bottom">
            {{ micro.title }}
        </div>
        <Content class="mt-3" :content="micro.content"></Content>
    </div>
</template>

<style scoped></style>
