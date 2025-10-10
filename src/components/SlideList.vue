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

const updateHeight = async () => {
    await nextTick();
    if (contentRef.value) {
        containerHeight.value = `${contentRef.value.scrollHeight}px`;
    }
};

onMounted(updateHeight);

watch(index, updateHeight);
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
            class="w-100 border rounded-3 p-3 content-container"
            :style="{ height: containerHeight }"
        >
            <div :key="index" ref="contentRef">
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
