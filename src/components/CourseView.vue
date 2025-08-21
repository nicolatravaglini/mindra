<script setup>
import { computed, ref } from "vue";
import { useCourseStore } from "../stores/course.js";

// Stores
const courseStore = useCourseStore();

const progPerc = computed(
    () =>
        ((courseStore.progress.macroIndex + courseStore.progress.microIndex) *
            100) /
        (courseStore.course.length +
            courseStore.course.reduce(
                (acc, current) => acc + current.micro.length,
                0,
            )),
);
const visibleMacro = ref({});

function progTest(i) {
    courseStore.progress.macroIndex = i;
    courseStore.progress.microIndex = courseStore.course
        .slice(0, i)
        .reduce((acc, current) => acc + current.micro.length, 0);
}

function showMacro(i) {
    progTest(i);
    visibleMacro.value[i] = visibleMacro.value[i]
        ? !visibleMacro.value[i]
        : true;
    console.log(visibleMacro.value[i]);
}
</script>

<template>
    <div class="container mt-5">
        <h3>Course - {{ progPerc.toFixed(1) }}%</h3>

        <!-- Progress -->
        <div class="progress" style="height: 3px">
            <div
                class="progress-bar bg-dark"
                :style="{ width: progPerc + '%' }"
            ></div>
        </div>

        <!-- Course -->
        <div
            class="mt-4 d-flex flex-column justify-content-start align-items-center gap-3 w-100"
        >
            <div
                v-for="(macro, i) in courseStore.course"
                :key="i"
                class="d-flex flex-column justify-content-start align-items-center gap-3 w-100"
            >
                <button
                    class="btn d-flex justify-content-center align-items-center bg-dark text-white text-center shadow w-100 p-5 fs-3"
                    @click="showMacro(i)"
                >
                    {{ macro.title }}
                </button>

                <div v-if="visibleMacro[i] === true" class="w-100">
                    <div class="text-dark border rounded-4 p-3">
                        {{ macro.description }}
                    </div>
                    <div
                        class="d-flex flex-column justify-content-start align-items-start gap-3 mt-3"
                    >
                        <div
                            v-for="(micro, j) in macro.micro"
                            :key="j"
                            class="d-flex flex-row justify-content-start align-items-stretch bg-white text-dark text-center text-wrap border rounded-5 shadow-sm p-0 w-100 gap-3"
                            style="min-height: 150px"
                        >
                            <div
                                class="flex-shrink-0 d-flex justify-content-center align-items-center border-end fs-5 fw-bold p-1"
                                style="width: 220px; overflow-wrap: break-word"
                            >
                                {{ micro.title }}
                            </div>

                            <div class="flex-grow-1 text-start my-3">
                                <span class="fw-bold">Description: </span>
                                {{ micro.description }}
                            </div>

                            <div
                                class="flex-shrink-0 d-flex justify-content-center align-items-center"
                            >
                                <button
                                    class="btn bg-dark text-white h-100"
                                    style="aspect-ratio: 1/1"
                                >
                                    <i class="bi bi-play-fill"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--
        <div class="accordion mt-3" id="courseAccordion">
            <div
                class="accordion-item"
                v-for="(macro, i) in courseStore.course"
                :key="i"
            >
                <h2 class="accordion-header" :id="`heading-${i}`">
                    <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        :data-bs-target="`#collapse-${i}`"
                        aria-expanded="false"
                        :aria-controls="`collapse-${i}`"
                        @click="test(i)"
                    >
                        {{ macro.title }}
                    </button>
                </h2>
                <div
                    :id="`collapse-${i}`"
                    class="accordion-collapse collapse"
                    :aria-labelledby="`heading-${i}`"
                    data-bs-parent="#courseAccordion"
                >
                    <div class="accordion-body">
                        <p>
                            <strong>Description:</strong>
                            {{ macro.description }}
                        </p>

                        <div
                            class="card mb-3"
                            v-for="(micro, j) in macro.micro"
                            :key="j"
                        >
                            <div class="card-body">
                                <h5 class="card-title">{{ micro.title }}</h5>
                                <p class="card-text">{{ micro.description }}</p>

                                <ul
                                    v-if="micro.quizzes.length"
                                    class="list-group list-group-flush"
                                >
                                    <li
                                        v-for="(quiz, k) in micro.quizzes"
                                        :key="k"
                                        class="list-group-item"
                                    >
                                        {{ quiz }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
		-->
    </div>
</template>

<style scoped></style>
