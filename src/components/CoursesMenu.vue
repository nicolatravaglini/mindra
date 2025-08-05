<script setup>
import { ref, onMounted } from "vue";
import { addCourse } from "../api/course.js";

let courses = ref([
    {
        name: "Ottimizzazione combinatoria",
    },
    {
        name: "Linguaggi di programmazione",
    },
    {
        name: "Probabilità e statistica",
    },
]);

const showForm = ref(false);
const formCourse = ref({
    name: "",
});

async function submitForm() {
    console.log(formCourse.value);
    const data = await addCourse(formCourse.value);
    console.log(data);
}
</script>

<template>
    <h1>Mindra</h1>
    <div>
        <h3 v-if="courses">Your courses:</h3>
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
                <button class="btn btn-success" @click="submitForm">Add</button>
                <button
                    class="btn btn-outline-secondary"
                    @click="showForm = false"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
