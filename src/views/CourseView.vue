<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user.js";
import { useCourseStore } from "../stores/course.js";
import { useMaterialsStore } from "../stores/material.js";
import { getCourse, deleteCourseById, generateCourse } from "../api/course.js";
import { useSectionLoader } from "../composables/useSectionLoader.js";
import CourseMaterial from "../components/CourseMaterial.vue";
import Course from "../components/Course.vue";
import SettingsDropdown from "../components/SettingsDropdown.vue";
import Loader from "../components/Loader.vue";

const router = useRouter();

// States
const { isLoading: isLoadingCourse, load: loadCourse } =
    useSectionLoader("course");

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
    loadCourse(async () => {
        await refreshCourse();
    });
});
</script>

<template>
    <div class="container-fluid">
        <div class="container mt-5 p-0">
            <Loader :isLoading="isLoadingCourse" msg="Loading course...">
                <div class="container">
                    <!-- Name of the course -->
                    <div
                        class="d-flex justify-content-between align-items-center"
                    >
                        <div class="mb-4">
                            <h1>{{ courseStore.name }}</h1>
                        </div>

                        <SettingsDropdown>
                            <li>
                                <button
                                    class="dropdown-item d-flex flex-row justify-content-between align-items-center"
                                    @click="deleteCourse"
                                >
                                    Delete
                                    <i class="bi bi-trash"></i>
                                </button>
                            </li>
                        </SettingsDropdown>
                    </div>

                    <CourseMaterial />
                </div>

                <div class="container mt-5">
                    <Course v-if="courseStore.course.length > 0" />
                </div>
            </Loader>
        </div>
    </div>
</template>

<style scoped></style>
