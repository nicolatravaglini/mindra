<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useCourseStore } from "../stores/course.js";
import { sendQuestion } from "../api/question.js";
import { useSectionLoader } from "../composables/useSectionLoader.js";
import Loader from "../components/Loader.vue";
import Content from "../components/Content.vue";

const route = useRoute();

const courseStore = useCourseStore();

const { isLoading: isLoadingQuestion, load: loadQuestion } =
    useSectionLoader("question");

const macroIdx = computed(() => route.params.macroIdx);
const microIdx = computed(() => route.params.microIdx);
const micro = computed(
    () => courseStore.course[macroIdx.value].micro[microIdx.value],
);

const question = ref("");
const answer = ref("");

async function ask() {
    loadQuestion(async () => {
        answer.value = await sendQuestion(
            micro.value.title,
            micro.value.content,
            question.value,
        );
    });
}
</script>

<template>
    <div
        class="d-flex flex-row justify-content-between align-items-center w-100 gap-3"
    >
        <input
            class="form-control rounded-pill flex-grow-1"
            style="font-size: 18px"
            type="text"
            placeholder="Start typing..."
            v-model="question"
            @keyup.enter="ask"
            :disabled="isLoadingQuestion"
        />
        <button
            class="btn btn-dark rounded-circle d-flex flex-row justify-content-center align-items-center p-0"
            style="width: 2.5rem; aspect-ratio: 1/1"
            :disabled="isLoadingQuestion"
            @click="ask"
        >
            <i class="bi bi-stars"></i>
        </button>
    </div>
    <Loader v-if="answer || isLoadingQuestion" :isLoading="isLoadingQuestion">
        <Content :content="answer" style="font-size: 18px" />
    </Loader>
</template>

<style scoped></style>
