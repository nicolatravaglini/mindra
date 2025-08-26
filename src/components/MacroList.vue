<script setup>
import { useCourseStore } from "../stores/course.js";
import { ref } from "vue";
import MicroList from "./MicroList.vue";

const courseStore = useCourseStore();

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
</script>

<template>
    <div
        class="d-flex flex-column justify-content-start align-items-center gap-3 w-100"
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
                <div class="mt-3">
                    <MicroList :macro="macro" :idx="i" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
