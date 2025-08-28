<script setup>
import { ref, computed, onMounted, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCourseStore } from "../stores/course.js";
import { checkAnswer } from "../api/quiz.js";
import { useSectionLoader } from "../composables/useSectionLoader.js";
import Content from "../components/Content.vue";
import Loader from "../components/Loader.vue";

const router = useRouter();
const route = useRoute();

const courseStore = useCourseStore();

// States
const { isLoading: isLoadingValutation, load: loadValutation } =
    useSectionLoader("valutations");

const micro = computed(
    () =>
        courseStore.course[route.params.macroIdx].micro[route.params.microIdx],
);
const valutationLoaders = ref({});

const answers = ref({});
const valutations = ref({});

async function sendAnswer(i) {
    valutationLoaders.value[i].load(async () => {
        valutations.value[i] = await checkAnswer(
            micro.value.content,
            micro.value.quizzes[i],
            answers.value[i],
        );
    });
}

watchEffect(() => {
    if (micro.value?.quizzes) {
        micro.value.quizzes.forEach((quiz, idx) => {
            if (!valutationLoaders.value[idx]) {
                valutationLoaders.value[idx] = useSectionLoader(
                    `valutation-${idx}`,
                );
            }
        });
    }
});

onMounted(() => {});
</script>

<template>
    <div class="container">
        <div
            class="d-flex flex-column justify-content-start align-items-center gap-3 mt-3"
        >
            <div class="border rounded-3 p-4">
                <div class="fs-3 pb-2 border-bottom">
                    {{ micro.title }}
                </div>
                <Content class="mt-3" :content="micro.content" />
            </div>
            <div class="border rounded-3 p-4 w-100">
                <div class="fs-4">Quiz</div>
                <div
                    class="mt-3 d-flex flex-column justify-content-start align-items-start gap-3"
                >
                    <div v-for="(quiz, i) in micro.quizzes" class="card w-100">
                        <div
                            class="card-body d-flex flex-column justify-content-start align-items-start gap-1"
                        >
                            <p class="card-title border-bottom pb-1 w-100">
                                Question {{ i + 1 }}
                            </p>
                            <Content :content="quiz" class="fs-5" />
                            <textarea
                                class="form-control mb-2"
                                rows="3"
                                placeholder="Write you answer..."
                                v-model="answers[i]"
                            ></textarea>
                            <button
                                :disabled="!answers[i]"
                                class="btn btn-dark"
                                @click="sendAnswer(i)"
                            >
                                Check answer
                            </button>
                            <div class="mt-2">
                                <Loader
                                    :isLoading="valutationLoaders[i].isLoading"
                                >
                                    <div v-if="valutations[i]">
                                        <div class="fs-4 fw-bold">
                                            {{ valutations[i].valutation }} / 10
                                        </div>
                                        <div class="fw-lighter">
                                            <Content
                                                :content="
                                                    valutations[i].comment
                                                "
                                            />
                                        </div>
                                    </div>
                                </Loader>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
