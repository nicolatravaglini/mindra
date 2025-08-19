<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user.js";
import { useCourseStore } from "../stores/course.js";
import { useMaterialsStore } from "../stores/material.js";
import {
    getMaterialsFromCourseById,
    addMaterialsToCourse,
    deleteMaterialFromCourseById,
} from "../api/material.js";
import { getCourse, generateCourse } from "../api/course.js";
import { useSectionLoader } from "../composables/useSectionLoader.js";

const router = useRouter();

// Stores
const userStore = useUserStore();
const courseStore = useCourseStore();
const materialsStore = useMaterialsStore();

// TODO: at least pdfs (with parsing)!
const supportedExtensions = ["txt", "md"];
const fileInput = ref(null);

// States
const { isLoading: isLoadingFiles, load: loadFiles } =
    useSectionLoader("files");

function readFileAsText(file) {
    // NOTE: they're all considered plain text files...
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);

        reader.readAsText(file);
    });
}

async function refreshCourse() {
    const fresh = await getCourse(courseStore._id);
    courseStore.set(fresh);
}

async function refreshMaterials() {
    loadFiles(async () => {
        const fresh = await getMaterialsFromCourseById(courseStore._id);
        materialsStore.materials = fresh;
    });
}

async function uploadFiles(fileList) {
    let materials = [];

    for (const file of fileList) {
        const content = await readFileAsText(file);
        materials.push({
            fileName: file.name,
            content: content,
        });
    }

    console.log(materials);

    await addMaterialsToCourse(courseStore._id, materials);
    await refreshCourse();
    await refreshMaterials();
}

async function deleteFile(index) {
    const id = materialsStore.materials[index]._id;
    await deleteMaterialFromCourseById(id, courseStore._id);
    await refreshCourse();
    await refreshMaterials();
}

// Insertion files handling
function triggerFileInput() {
    fileInput.value.click();
}

function handleDrop(event) {
    uploadFiles(event.dataTransfer.files);
}

function handleFileSelect(event) {
    let validFiles = [];

    Array.from(event.target.files).forEach((file) => {
        const extension = file.name.toLowerCase().split(".").pop();
        if (!supportedExtensions.includes(extension)) {
            console.log("File", file.name, "not supported yet!");
        } else {
            validFiles.push(file);
        }
    });

    uploadFiles(validFiles);
}

function getFileIconClass(fileName) {
    const ext = fileName.toLowerCase().split(".").pop();
    switch (ext) {
        case "txt":
            return "bi bi-file-earmark-text";
        case "md":
            return "bi bi-markdown";
        default:
            return "bi bi-file-earmark";
    }
}

onMounted(async () => {
    await refreshMaterials();
});
</script>

<template>
    <!-- Show materials -->
    <div class="accordion mb-3" id="accordion">
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#materialAccordion"
                >
                    Materials loaded
                </button>
            </h2>

            <div
                id="materialAccordion"
                :class="[
                    'accordion-collapse',
                    'collapse',
                    courseStore.course.length == 0 ? 'show' : '',
                ]"
                data-bs-parent="#accordion"
            >
                <div class="accordion-body">
                    <div v-if="isLoadingFiles">
                        <div class="spinner-border" role="status"></div>
                    </div>

                    <div v-else>
                        <div
                            v-if="materialsStore.materials.length === 0"
                            class="text-muted"
                        >
                            No files.
                        </div>

                        <div class="d-flex flex-wrap gap-3">
                            <div
                                v-for="(
                                    file, index
                                ) in materialsStore.materials"
                                :key="index"
                                class="position-relative border rounded p-3 bg-light text-dark d-flex flex-column align-items-start"
                                style="width: 180px; height: 75px"
                            >
                                <!-- Icon + name -->
                                <div class="d-flex align-items-center gap-2">
                                    <i
                                        :class="getFileIconClass(file.fileName)"
                                        class="fs-4"
                                    ></i>
                                    <span
                                        class="text-truncate small"
                                        style="max-width: 110px"
                                    >
                                        {{ file.fileName }}
                                    </span>
                                </div>

                                <!-- Button for removing -->
                                <button
                                    type="button"
                                    class="btn-close position-absolute top-0 end-0 m-2"
                                    aria-label="Close"
                                    @click="deleteFile(index)"
                                ></button>
                            </div>
                        </div>
                    </div>

                    <!-- Dropzone -->
                    <div
                        class="border rounded mt-3 p-5 text-center bg-light"
                        @dragover.prevent
                        @dragenter.prevent
                        @drop.prevent="handleDrop"
                        @click="triggerFileInput"
                        style="cursor: pointer"
                    >
                        <p class="mb-0 text-muted">
                            Drag and drop here the materials or click to insert
                            them.
                        </p>
                        <p class="mb-0 text-muted">
                            (note: the supported extensions are
                            {{ supportedExtensions.join(", ") }})
                        </p>

                        <input
                            ref="fileInput"
                            type="file"
                            :accept="
                                supportedExtensions
                                    .map((ext) => '.' + ext)
                                    .join(',')
                            "
                            multiple
                            class="d-none"
                            @change="handleFileSelect"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
