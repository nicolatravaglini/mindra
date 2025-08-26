<script setup>
import Micro from "./Micro.vue";

const props = defineProps({
    macro: Object,
    idx: Number,
});

function showMicro(j) {}
</script>

<template>
    <div
        class="d-flex flex-column justify-content-start align-items-start gap-3"
    >
        <div
            v-for="(micro, j) in macro.micro"
            :key="j"
            class="d-flex flex-row align-items-stretch bg-white text-dark border rounded-5 shadow-sm p-0 w-100 gap-3 overflow-hidden"
            style="min-height: 150px"
        >
            <Micro :micro="micro" />
        </div>
    </div>
</template>

<style scoped></style>
