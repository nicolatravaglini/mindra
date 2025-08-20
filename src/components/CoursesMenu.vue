<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { addCourse, getCourses, getCourse } from "../api/course.js";
import { useCourseStore } from "../stores/course.js";
import { useSectionLoader } from "../composables/useSectionLoader.js";
import Navbar from "./Navbar.vue";
import Loader from "./Loader.vue";

const router = useRouter();
const courseStore = useCourseStore();

const courses = ref([]);
const showForm = ref(false);
const formCourse = ref({ name: "" });

// States
const { isLoading: isLoadingCourses, load: loadCourses } =
    useSectionLoader("courses");

async function downloadCourses() {
    loadCourses(async () => {
        courses.value = await getCourses();
    });
}

async function submitCourse() {
    const data = await addCourse(formCourse.value);
    await downloadCourses();
    showForm.value = false;
    formCourse.value = { name: "" };
}

async function selectCourse(course) {
    const c = await getCourse(course._id);
    courseStore.set(c);
    router.push(`/courses/${c._id}`);
}

onMounted(async () => {
    await downloadCourses();
});
</script>

<template>
    <div class="container-fluid">
        <Navbar />

        <div class="container pt-5">
            <!-- Title -->
            <div class="mb-4">
                <h2 class="fw-medium">
                    {{ courses.length ? "Your courses" : "No courses yet!" }}
                </h2>
            </div>

            <!-- List of courses -->
            <div class="d-grid gap-3 mb-4">
                <Loader :isLoading="isLoadingCourses">
                    <button
                        v-for="course in courses"
                        class="text-start px-4 py-3 border text-dark bg-white"
                        style="
                            font-size: 1.05rem;
                            border-color: black;
                            border-radius: 0.5rem;
                        "
                        @click="selectCourse(course)"
                    >
                        {{ course.name }}
                    </button>
                </Loader>
            </div>

            <!-- Button for adding courses -->
            <div class="text-center mb-4">
                <button
                    v-if="!showForm"
                    class="btn btn-outline-dark rounded-pill px-4"
                    @click="showForm = true"
                >
                    + Add a course
                </button>
            </div>

            <!-- Form for adding courses -->
            <div
                v-if="showForm"
                class="p-4 border bg-white rounded"
                style="max-width: 500px; margin: 0 auto"
            >
                <div class="mb-3">
                    <label for="name" class="form-label fw-medium"
                        >Course name</label
                    >
                    <input
                        v-model="formCourse.name"
                        type="text"
                        class="form-control rounded"
                        id="name"
                        style="background-color: white"
                    />
                </div>

                <div class="d-flex justify-content-end gap-2">
                    <button class="btn btn-dark rounded" @click="submitCourse">
                        Add
                    </button>
                    <button
                        class="btn btn-outline-dark rounded"
                        @click="showForm = false"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
