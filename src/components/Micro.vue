<script setup>
import { computed } from "vue";
import { useCourseStore } from "../stores/course.js";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();

const props = defineProps({
    micro: Object,
    macroIdx: Number,
    microIdx: Number,
});

const courseStore = useCourseStore();

const totalQuizzes = computed(() => props.micro.quizzes.length);
const totalCompletedQuizzes = computed(
    () =>
        courseStore.progress.filter(
            (p) =>
                p.macroIndex == props.macroIdx &&
                p.microIndex == props.microIdx &&
                p.valutation >= 6,
        ).length,
);

function showMicro() {
    router.push(
        `/courses/${courseStore._id}/${props.macroIdx}/${props.microIdx}`,
    );
}
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
        <div
            class="d-flex flex-row justify-content-start align-items-center gap-5"
        >
            <div class="fst-italic">
                {{ micro.estimatedPomodoros }}
                <span><i class="bi bi-stopwatch"></i></span>
            </div>
            <div class="fst-italic">
                {{ totalCompletedQuizzes }}/{{ totalQuizzes }}
                <span><i class="bi bi-patch-question"></i></span>
            </div>
        </div>
    </div>

    <!-- Play button -->
    <div
        class="flex-shrink-0 w-25 d-flex justify-content-end align-items-center"
    >
        <button
            class="btn bg-dark text-white w-50 h-100 rounded-0"
            @click="showMicro"
        >
            <i class="bi bi-play h1"></i>
        </button>
    </div>
</template>

<style scoped></style>
