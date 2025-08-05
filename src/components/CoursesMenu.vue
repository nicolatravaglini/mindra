<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { addCourse, getCourses } from "../api/course.js";
import { logout } from "../api/user.js";

const router = useRouter();

const courses = ref([]);
const showForm = ref(false);
const formCourse = ref({
    name: "",
});

async function submitCourse() {
    const data = await addCourse(formCourse.value);
    courses.value = await getCourses();
    showForm.value = false;
    formCourse.value = { name: "" };
}

async function logoutAndLogin() {
    const response = await logout();
    if (response.ok) router.push("/login");
}

onMounted(async () => {
    courses.value = await getCourses();
});
</script>

<template>
    <div class="container-fluid bg-body-tertiary">
        <nav class="navbar navbar-expand">
            <div class="container-fluid d-flex flex-row justify-content-end">
                <button class="btn btn-outline-danger" @click="logoutAndLogin">
                    Logout
                </button>
            </div>
        </nav>
        <h1>Mindra</h1>
        <div>
            <h3 v-if="courses.length">Your courses:</h3>
            <h3 v-else>No courses yet!</h3>

            <div class="d-flex flex-column">
                <button v-for="course in courses" class="card my-2">
                    {{ course.name }}
                </button>
            </div>

            <button
                class="btn btn-outline-dark my-2"
                @click="showForm = true"
                v-if="!showForm"
            >
                Add a course
            </button>

            <div v-if="showForm">
                <div class="form-floating mb-3">
                    <input
                        v-model="formCourse.name"
                        type="text"
                        class="form-control"
                        id="name"
                        placeholder="Name"
                    />
                    <label for="name">Name</label>
                </div>

                <div class="d-flex justify-content-between">
                    <button class="btn btn-success" @click="submitCourse">
                        Add
                    </button>
                    <button
                        class="btn btn-outline-secondary"
                        @click="showForm = false"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
