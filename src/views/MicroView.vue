<script setup>
import { ref, computed, onMounted, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useCourseStore } from "../stores/course.js";
import Content from "../components/Content.vue";
import QuizList from "../components/QuizList.vue";
import { avg } from "../utils.js";

const router = useRouter();
const route = useRoute();

const courseStore = useCourseStore();

const macroIdx = computed(() => route.params.macroIdx);
const microIdx = computed(() => route.params.microIdx);
const micro = computed(
    () => courseStore.course[macroIdx.value].micro[microIdx.value],
);
const avgGrades = computed(() =>
    avg(
        courseStore.progress
            .filter(
                (p) =>
                    p.macroIndex == macroIdx.value &&
                    p.microIndex == microIdx.value,
            )
            .map((fp) => fp.valutation),
    ),
);

onMounted(() => {});
</script>

<template>
    <div class="container">
        <div
            class="d-flex flex-column justify-content-start align-items-center gap-3 mt-3 w-100"
        >
            <div class="border rounded-3 p-4 w-100">
                <div class="fs-3 pb-2 border-bottom fw-bold">
                    {{ micro.title }}
                </div>
                <Content
                    class="mt-3"
                    style="font-size: 20px"
                    :content="micro.content"
                />
            </div>
            <div class="accordion mt-3 w-100" id="accordionQuiz">
                <div class="accordion-item w-100">
                    <h2 class="accordion-header">
                        <button
                            class="accordion-button bg-transparent fs-4"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#quizAccordion"
                        >
                            Quiz
                        </button>
                    </h2>

                    <div
                        id="quizAccordion"
                        :class="['accordion-collapse', 'collapse', 'show']"
                        data-bs-parent="#accordionQuiz"
                    >
                        <div class="accordion-body">
                            <div class="mt-3">
                                <QuizList :quizzes="micro.quizzes" />
                            </div>
                            <div v-if="avgGrades" class="fs-3 mt-3">
                                Average grades: {{ avgGrades.toFixed(2) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
