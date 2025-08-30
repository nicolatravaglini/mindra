<script setup>
import { computed, ref } from "vue";
import { useCourseStore } from "../stores/course.js";
import { getCourse, deleteInnerCourseById } from "../api/course.js";
import SettingsDropdown from "./SettingsDropdown.vue";
import ProgressBar from "./ProgressBar.vue";
import MacroList from "./MacroList.vue";

// Stores
const courseStore = useCourseStore();

const estimatedTotalPomodoros = computed(() =>
    courseStore.course.reduce(
        (acc1, macro) =>
            acc1 +
            macro.micro.reduce(
                (acc2, current) => acc2 + current.estimatedPomodoros,
                0,
            ),
        0,
    ),
);
const progPerc = computed(() => 0);

async function deleteCourse() {
    await deleteInnerCourseById(courseStore._id);
    const fresh = await getCourse(courseStore._id);
    courseStore.set(fresh);
}
</script>

<template>
    <div class="container mt-5">
        <div class="d-flex flex-row justify-content-between align-items-start">
            <div>
                <h3>Course</h3>

                <!-- Info -->
                <div>
                    Estimated total pomodoros:
                    <span class="fw-bold">{{ estimatedTotalPomodoros }}</span>
                    <i class="bi bi-stopwatch"></i>
                    <br />
                    Completion percentage:
                    <span class="fw-bold">{{ progPerc.toFixed(1) }}%</span>
                </div>
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

        <!-- Progress -->
        <div class="mt-2">
            <ProgressBar :progPerc="progPerc" />
        </div>

        <!-- Course -->
        <div class="mt-3">
            <MacroList />
        </div>
    </div>
</template>

<style scoped></style>
