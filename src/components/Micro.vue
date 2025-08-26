<script setup>
const props = defineProps({
    micro: Object,
});
</script>

<template>
    <!-- Title -->
    <div
        class="flex-shrink-0 w-25 d-flex justify-content-center align-items-center border-end fs-5 fw-bold p-1 text-center text-break"
    >
        {{ micro.title }}
    </div>

    <!-- Description -->
    <div
        class="flex-grow-1 text-start my-3 d-flex flex-column justify-content-between align-items-start"
    >
        <div>
            <span class="fw-bold">Description: </span>
            {{ micro.description }}
        </div>
        <div class="fst-italic">
            {{ micro.estimatedPomodoros }}
            <span><i class="bi bi-stopwatch"></i></span>
        </div>
    </div>

    <!-- Play button -->
    <div
        class="flex-shrink-0 w-25 d-flex justify-content-end align-items-center"
    >
        <button
            class="btn bg-dark text-white w-50 h-100 rounded-0"
            @click="showMicro(j)"
        >
            <i class="bi bi-play h1"></i>
        </button>
    </div>
</template>

<style scoped></style>
