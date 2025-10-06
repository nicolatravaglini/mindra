<script setup>
import { ref, computed, onMounted, watchEffect } from "vue";
import Content from "./Content.vue";

const props = defineProps({
    content: Array,
});

const index = ref(1);
const numSlides = computed(() => props.content.length);
</script>

<template>
    <div
        class="w-100 d-flex flex-column justify-content-between align-items-center gap-3"
    >
        <div
            class="d-flex flex-row justify-content-center align-items-center gap-2"
        >
            <button
                class="btn border-0"
                @click="index--"
                :disabled="index === 1"
            >
                <i class="bi bi-arrow-left"></i>
            </button>
            <div>Slide {{ index }}/{{ numSlides }}</div>
            <button
                class="btn border-0"
                @click="index++"
                :disabled="index === numSlides"
            >
                <i class="bi bi-arrow-right"></i>
            </button>
        </div>
        <div class="w-100 border rounded-3 p-3">
            <Content :content="content[index - 1]" />
        </div>
    </div>
</template>

<style scoped></style>
