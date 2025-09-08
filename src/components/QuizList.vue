<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useCourseStore } from "../stores/course.js";
import { useSectionLoader } from "../composables/useSectionLoader.js";
import { addQuiz } from "../api/quiz.js";
import { getCourse } from "../api/course.js";
import Quiz from "../components/Quiz.vue";
import Loader from "../components/Loader.vue";

const props = defineProps({
    quizzes: Array,
});

const route = useRoute();

const courseStore = useCourseStore();
const { isLoading: isLoadingQuizzes, load: loadQuizzes } =
    useSectionLoader("quizzes");

const macroIdx = computed(() => route.params.macroIdx);
const microIdx = computed(() => route.params.microIdx);

async function add() {
    loadQuizzes(async () => {
        await addQuiz(
            courseStore._id,
            macroIdx.value,
            microIdx.value,
            courseStore.course[macroIdx.value].micro[microIdx.value].title,
            courseStore.course[macroIdx.value].micro[microIdx.value].content,
            courseStore.course[macroIdx.value].micro[microIdx.value].quizzes,
        );
        const fresh = await getCourse(courseStore._id);
        courseStore.set(fresh);
    });
}
</script>

<template>
    <div
        class="d-flex flex-column justify-content-start align-items-start gap-3"
    >
        <div v-for="(quiz, i) in quizzes" class="card w-100">
            <Quiz :quiz="quiz" :idx="i" />
        </div>

        <Loader :isLoading="isLoadingQuizzes"></Loader>

        <button
            class="btn btn-outline-dark rounded-pill align-self-center my-2"
            @click="add"
            :disabled="isLoadingQuizzes"
        >
            + Add quiz
        </button>
    </div>
</template>

<style scoped></style>
