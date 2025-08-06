<script setup>
import { useCourseStore } from "../stores/course.js";
const courseStore = useCourseStore();
</script>

<template>
    <div class="container my-4">
        <div class="accordion" id="courseAccordion">
            <div
                class="accordion-item"
                v-for="(macro, i) in courseStore.course"
                :key="i"
            >
                <h2 class="accordion-header" :id="`heading-${i}`">
                    <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        :data-bs-target="`#collapse-${i}`"
                        aria-expanded="false"
                        :aria-controls="`collapse-${i}`"
                    >
                        {{ macro.title }}
                    </button>
                </h2>
                <div
                    :id="`collapse-${i}`"
                    class="accordion-collapse collapse"
                    :aria-labelledby="`heading-${i}`"
                    data-bs-parent="#courseAccordion"
                >
                    <div class="accordion-body">
                        <p>
                            <strong>Description:</strong>
                            {{ macro.description }}
                        </p>

                        <div
                            class="card mb-3"
                            v-for="(micro, j) in macro.micro"
                            :key="j"
                        >
                            <div class="card-body">
                                <h5 class="card-title">{{ micro.title }}</h5>
                                <p class="card-text">{{ micro.description }}</p>

                                <ul
                                    v-if="micro.quizzes.length"
                                    class="list-group list-group-flush"
                                >
                                    <li
                                        v-for="(quiz, k) in micro.quizzes"
                                        :key="k"
                                        class="list-group-item"
                                    >
                                        {{ quiz }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
