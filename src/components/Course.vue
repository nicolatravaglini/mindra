<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user.js";
import { useCourseStore } from "../stores/course.js";
import { useMaterialsStore } from "../stores/material.js";
import { getCourse, deleteCourseById, generateCourse } from "../api/course.js";
import { useSectionLoader } from "../composables/useSectionLoader.js";
import CourseMaterialView from "./CourseMaterialView.vue";
import CourseView from "./CourseView.vue";
import Navbar from "./Navbar.vue";

const router = useRouter();

// Stores
const userStore = useUserStore();
const courseStore = useCourseStore();
const materialsStore = useMaterialsStore();

// TODO: at least pdfs (with parsing)!
const supportedExtensions = ["txt", "md"];
const fileInput = ref(null);

async function refreshCourse() {
    const fresh = await getCourse(courseStore._id);
    courseStore.set(fresh);
}

async function deleteCourse() {
    await deleteCourseById(courseStore._id);
    materialsStore.$reset();
    courseStore.$reset();
    router.push("/courses");
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
            <div class="d-flex justify-content-between align-items-center">
                <div class="mb-4">
                    <h1>{{ courseStore.name }}</h1>
                </div>

                <div class="dropdown">
                    <button
                        class="btn rounded dropdown-toggle"
                        data-bs-toggle="dropdown"
                    >
                        <i class="bi bi-gear"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                            <button
                                class="dropdown-item d-flex flex-row justify-content-between align-items-center"
                                @click="deleteCourse"
                            >
                                Delete
                                <i class="bi bi-trash"></i>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <CourseMaterialView />
        </div>

        <CourseView v-if="courseStore.course.length > 0" />
    </div>
</template>

<style scoped></style>
