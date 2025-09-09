<script setup>
import { ref, computed, onMounted } from "vue";
import { useCourseStore } from "../stores/course.js";
import { useRouter, useRoute } from "vue-router";
import { generateMicro, getCourse } from "../api/course.js";
import { useSectionLoader } from "../composables/useSectionLoader.js";
import Loader from "../components/Loader.vue";

const router = useRouter();

const props = defineProps({
    micro: Object,
    macroIdx: Number,
    microIdx: Number,
});

const { isLoading: isLoadingMicro, load: loadMicro } = useSectionLoader(
    `micro-${props.macroIdx}-${props.microIdx}`,
);

const courseStore = useCourseStore();

const totalQuizzes = computed(() => {
    return (micro) => micro.quizzes.length;
});
const totalCompletedQuizzes = computed(() => {
    return (macroIdx, microIdx) =>
        courseStore.progress.filter(
            (p) =>
                p.macroIndex == macroIdx &&
                p.microIndex == microIdx &&
                p.valutation >= 6,
        ).length;
});
const isAhead = computed(() => {
    if (props.microIdx == 0) {
        return (
            props.macroIdx > 0 &&
            totalCompletedQuizzes.value(
                props.macroIdx - 1,
                courseStore.course[props.macroIdx - 1].micro.length - 1,
            ) <
                totalQuizzes.value(
                    courseStore.course[props.macroIdx - 1].micro[
                        courseStore.course[props.macroIdx - 1].micro.length - 1
                    ],
                )
        );
    } else {
        return (
            totalCompletedQuizzes.value(props.macroIdx, props.microIdx - 1) <
            totalQuizzes.value(
                courseStore.course[props.macroIdx].micro[props.microIdx - 1],
            )
        );
    }
});

let modalInstance = null;
const confirmModal = ref(null);

function pushMicro() {
    router.push(
        `/courses/${courseStore._id}/${props.macroIdx}/${props.microIdx}`,
    );
}

function showMicro() {
    if (isAhead.value) {
        modalInstance.show();
    } else {
        pushMicro();
    }
}

function confirmShowMicro() {
    modalInstance.hide();
    pushMicro();
}

async function refreshCourse() {
    const fresh = await getCourse(courseStore._id);
    courseStore.set(fresh);
}

async function genMicro() {
    loadMicro(async () => {
        const test = await generateMicro(
            courseStore._id,
            props.macroIdx,
            props.microIdx,
        );
        await refreshCourse();
    });
}

onMounted(() => {
    modalInstance = new bootstrap.Modal(confirmModal.value);
});
</script>

<template>
    <!-- Title -->
    <div
        class="flex-shrink-0 w-25 d-flex justify-content-center align-items-center border-end fs-5 fw-bold p-1 text-center text-break"
    >
        {{ micro.title }}
    </div>

    <!-- Description -->
    <div
        class="flex-grow-1 text-start my-3 d-flex flex-column justify-content-between align-items-start"
    >
        <div>
            <span class="fw-bold">Description: </span>
            {{ micro.description }}
        </div>
        <div
            class="d-flex flex-row justify-content-start align-items-center gap-5"
        >
            <div class="fst-italic">
                {{ micro.estimatedPomodoros }}
                <span><i class="bi bi-stopwatch"></i></span>
            </div>
            <div class="fst-italic" v-if="totalQuizzes(micro) > 0">
                {{ totalCompletedQuizzes(macroIdx, microIdx) }}/{{
                    totalQuizzes(micro)
                }}
                <span><i class="bi bi-patch-question"></i></span>
            </div>
        </div>
    </div>

    <!-- Play button -->
    <div
        class="flex-shrink-0 w-25 d-flex justify-content-end align-items-center"
    >
        <button
            v-if="micro.content"
            type="button"
            :class="[
                'btn',
                isAhead ? 'bg-secondary' : 'bg-dark',
                'text-white',
                'w-50',
                'h-100',
                'rounded-0',
            ]"
            @click="showMicro"
        >
            <i class="bi bi-play h1"></i>
        </button>
        <button
            v-else
            type="button"
            :class="[
                'btn',
                'bg-dark',
                'text-white',
                'w-50',
                'h-100',
                'rounded-0',
            ]"
            :disabled="isLoadingMicro"
            @click="genMicro"
        >
            <Loader :isLoading="isLoadingMicro">
                <i class="bi bi-stars h1"></i>
            </Loader>
        </button>
    </div>

    <div class="modal fade" ref="confirmModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Warning</h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                    ></button>
                </div>
                <div class="modal-body">
                    You should complete the previous micro courses first.
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-outline-dark"
                        data-bs-dismiss="modal"
                    >
                        Dismiss
                    </button>
                    <button
                        type="button"
                        class="btn btn-dark"
                        @click="confirmShowMicro"
                    >
                        Start anyway
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
