<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "../stores/user.js";
import { useCourseStore } from "../stores/course.js";
import { useMaterialsStore } from "../stores/material.js";
import { getCourse, generateCourse } from "../api/course.js";
import { useSectionLoader } from "../composables/useSectionLoader.js";
import CourseMaterialView from "./CourseMaterialView.vue";
import CourseView from "./CourseView.vue";
import Navbar from "./Navbar.vue";

// Stores
const userStore = useUserStore();
const courseStore = useCourseStore();
const materialsStore = useMaterialsStore();

// TODO: at least pdfs (with parsing)!
const supportedExtensions = ["txt", "md"];
const fileInput = ref(null);

// States
const { isLoading: isGeneratingCourse, load: genCourseLoader } =
    useSectionLoader("genCourse");

async function refreshCourse() {
    const fresh = await getCourse(courseStore._id);
    courseStore.set(fresh);
}

async function generate() {
    genCourseLoader(async () => {
        await generateCourse(courseStore._id);
        await refreshCourse();
    });
}

onMounted(async () => {
    await refreshCourse();
});
</script>

<template>
    <div class="container-fluid">
        <Navbar />

        <div class="container pt-5">
            <!-- Name of the course -->
            <div class="mb-4">
                <h1>{{ courseStore.name }}</h1>
            </div>

            <CourseMaterialView />
        </div>

        <div class="container pt-3">
            <div class="text-center">
                <button
                    :disabled="
                        materialsStore.materials.length === 0 ||
                        isGeneratingCourse
                    "
                    class="btn btn-dark rounded-pill"
                    @click="generate"
                >
                    Generate course
                </button>
            </div>

            <div v-if="isGeneratingCourse" class="text-center py-3">
                <div class="spinner-border" role="status"></div>
            </div>

            <div v-else-if="courseStore.course.length > 0">
                <CourseView />
            </div>
        </div>
    </div>
</template>

<style scoped></style>
