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

function progTest(i, j) {
    courseStore.progress.macroIndex = i;
    courseStore.progress.microIndex = courseStore.course
        .slice(0, i)
        .reduce((acc, current) => acc + current.micro.length, 0);
}

function showMacro(i) {
    progTest(i, 0);
    visibleMacro.value[i] = visibleMacro.value[i]
        ? !visibleMacro.value[i]
        : true;
    console.log(visibleMacro.value[i]);
}

function showMicro(i, j) {}
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
                            class="d-flex flex-row align-items-stretch bg-white text-dark border rounded-5 shadow-sm p-0 w-100 gap-3 overflow-hidden"
                            style="min-height: 150px"
                        >
                            <!-- Title -->
                            <div
                                class="flex-shrink-0 w-25 d-flex justify-content-center align-items-center border-end fs-5 fw-bold p-1 text-center text-break"
                            >
                                {{ micro.title }}
                            </div>

                            <!-- Description -->
                            <div class="flex-grow-1 text-start my-3">
                                <span class="fw-bold">Description: </span>
                                {{ micro.description }}
                            </div>

                            <!-- Play button -->
                            <div
                                class="flex-shrink-0 w-25 d-flex justify-content-end align-items-center"
                            >
                                <button
                                    class="btn bg-dark text-white w-50 h-100 rounded-0"
                                    @click="showMicro(i, j)"
                                >
                                    <i class="bi bi-play h1"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
