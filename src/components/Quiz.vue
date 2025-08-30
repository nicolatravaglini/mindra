<script setup>
import { ref, computed, onMounted, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import Content from "./Content.vue";
import Loader from "./Loader.vue";
import { useSectionLoader } from "../composables/useSectionLoader.js";
import { useCourseStore } from "../stores/course.js";
import { checkAnswer, saveAnswer } from "../api/quiz.js";
import { getCourse } from "../api/course.js";

const props = defineProps({
    quiz: String,
    idx: Number,
});

const route = useRoute();
const courseStore = useCourseStore();
const valutationLoader = useSectionLoader(`valutation-${props.idx}`);
console.log(valutationLoader.isLoading.value);

const answer = ref("");

const macroIdx = computed(() => route.params.macroIdx);
const microIdx = computed(() => route.params.microIdx);
const micro = computed(
    () => courseStore.course[macroIdx.value].micro[microIdx.value],
);
const findQuiz = computed(() => {
    return courseStore.progress.filter(
        (p) =>
            p.macroIndex == macroIdx.value &&
            p.microIndex == microIdx.value &&
            p.quizIndex == props.idx,
    );
});

async function sendAnswer() {
    valutationLoader.load(async () => {
        const valutation = await checkAnswer(
            micro.value.content,
            props.quiz,
            answer.value,
        );
        await saveAnswer(
            courseStore._id,
            macroIdx.value,
            microIdx.value,
            props.idx,
            answer.value,
            valutation.valutation,
            valutation.comment,
        );
        const fresh = await getCourse(courseStore._id);
        courseStore.set(fresh);
        console.log(courseStore.progress);
    });
}
onMounted(() => {});
</script>

<template>
    <div
        class="card-body d-flex flex-column justify-content-start align-items-start gap-1"
    >
        <p class="card-title border-bottom pb-1 w-100">
            Question {{ idx + 1 }}
        </p>
        <Content :content="quiz" class="fs-5" />
        <textarea
            class="form-control mb-2"
            rows="3"
            placeholder="Write you answer..."
            v-model="answer"
        ></textarea>
        <button :disabled="!answer" class="btn btn-dark" @click="sendAnswer">
            Check answer
        </button>
        <div class="mt-3">
            <Loader :isLoading="valutationLoader.isLoading.value">
                <div v-if="findQuiz.length > 0" class="border-top">
                    <div class="py-2">
                        <span class="fw-bold">Answer: </span>
                        {{ findQuiz[0].answer }}
                    </div>
                    <div class="fs-4 fw-bold">
                        {{ findQuiz[0].valutation }} / 10
                    </div>
                    <div class="fw-lighter">
                        <Content :content="findQuiz[0].comment" />
                    </div>
                </div>
            </Loader>
        </div>
    </div>
</template>

<style scoped></style>
