<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import Content from "./Content.vue";

const props = defineProps({
    content: Array,
});

const index = ref(1);
const numSlides = computed(() => props.content.length);

const contentRef = ref(null);
const containerHeight = ref("auto");

watch(
    contentRef,
    (newElement) => {
        // Questo watcher si attiva ogni volta che l'elemento DOM
        // a cui è legato 'contentRef' cambia (al primo mount e a ogni cambio di :key).
        if (newElement) {
            // Ora che abbiamo il riferimento al *nuovo* elemento,
            // possiamo misurarne l'altezza con sicurezza.
            containerHeight.value = `${newElement.scrollHeight}px`;
        }
    },
    {
        // 'flush: 'post'' assicura che il watcher venga eseguito DOPO
        // che Vue ha aggiornato il DOM. È fondamentale per misurazioni accurate.
        flush: "post",
    },
);
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
            <div>{{ index }}/{{ numSlides }}</div>
            <button
                class="btn border-0"
                @click="index++"
                :disabled="index === numSlides"
            >
                <i class="bi bi-arrow-right"></i>
            </button>
        </div>

        <div
            class="w-100 border rounded-3 content-container"
            :style="{ height: containerHeight }"
        >
            <div :key="index" ref="contentRef" class="p-3">
                <Content :content="content[index - 1]" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.content-container {
    transition: height 0.25s ease-in-out;
    overflow: hidden;
}
</style>
