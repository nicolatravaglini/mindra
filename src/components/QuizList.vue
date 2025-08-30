<script setup>
import Quiz from "../components/Quiz.vue";

const props = defineProps({
    quizzes: Array,
});
</script>

<template>
    <div
        class="d-flex flex-column justify-content-start align-items-start gap-3"
    >
        <div v-for="(quiz, i) in quizzes" class="card w-100">
            <Quiz :quiz="quiz" :idx="i" />
        </div>
    </div>
</template>

<style scoped></style>
