<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { addCourse, getCourses } from "../api/course.js";
import { logout } from "../api/user.js";
import { useUserStore } from "../stores/user.js";
import { storeToRefs } from "pinia";

const router = useRouter();
const userStore = useUserStore();

const courses = ref([]);
const showForm = ref(false);
const formCourse = ref({ name: "" });

async function submitCourse() {
    const data = await addCourse(formCourse.value);
    courses.value = await getCourses();
    showForm.value = false;
    formCourse.value = { name: "" };
}

async function logoutAndLogin() {
    const response = await logout();
    if (response.ok) {
        userStore.$reset();
        router.push("/login");
    }
}

onMounted(async () => {
    courses.value = await getCourses();
});
</script>

<template>
    <div class="container-fluid">
        <nav class="navbar navbar-expand">
            <div
                class="container-fluid justify-content-end gap-3 align-items-center"
            >
                <span class="fw-semibold d-none d-sm-block">{{
                    userStore.name
                }}</span>
                <div class="dropdown">
                    <img
                        :src="userStore.picture"
                        alt="User avatar"
                        class="rounded-circle dropdown-toggle"
                        width="40"
                        height="40"
                        style="object-fit: cover"
                        data-bs-toggle="dropdown"
                    />
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                            <button
                                class="dropdown-item"
                                @click="logoutAndLogin"
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <div class="container py-5">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <!-- Titolo -->
                    <div class="text-center mb-4">
                        <h3 class="fw-medium">
                            {{
                                courses.length
                                    ? "Your courses"
                                    : "No courses yet!"
                            }}
                        </h3>
                    </div>

                    <!-- Elenco corsi -->
                    <div class="d-grid gap-3 mb-4">
                        <button
                            v-for="course in courses"
                            class="text-start px-4 py-3 border text-dark bg-white"
                            style="
                                font-size: 1.05rem;
                                border-color: black;
                                border-radius: 0.5rem;
                            "
                        >
                            {{ course.name }}
                        </button>
                    </div>

                    <!-- Bottone per aggiunta -->
                    <div class="text-center mb-4">
                        <button
                            v-if="!showForm"
                            class="btn btn-outline-dark rounded-pill px-4"
                            @click="showForm = true"
                        >
                            + Add a course
                        </button>
                    </div>

                    <!-- Form aggiunta corso -->
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
                            <button
                                class="btn btn-dark rounded"
                                @click="submitCourse"
                            >
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
        </div>
    </div>
</template>

<style scoped></style>
