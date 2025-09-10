<script setup>
import { onMounted, onUpdated, ref } from "vue";
import renderMathInElement from "katex/contrib/auto-render";
import "katex/dist/katex.min.css";

const props = defineProps({
    content: String,
});

const el = ref(null);

const renderMath = () => {
    if (el.value) {
        renderMathInElement(el.value, {
            delimiters: [
                { left: "\\(", right: "\\)", display: false },
                { left: "\\[", right: "\\]", display: true },
                { left: "$", right: "$", display: false },
                { left: "$$", right: "$$", display: true },
            ],
        });
    }
};

onMounted(renderMath);
onUpdated(renderMath);
</script>

<template>
    <!-- Render the AI response -->
    <div ref="el" v-html="content" class="text-wrap w-100"></div>
</template>

<style scoped></style>
