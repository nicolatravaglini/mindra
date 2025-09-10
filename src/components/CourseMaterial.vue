<script setup>
import { ref, computed, onMounted, watch, watchEffect } from "vue";
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
import FileList from "./FileList.vue";
import Loader from "./Loader.vue";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import { encoding_for_model } from "tiktoken";

const MAX_TPM =
    import.meta.env.VITE_MAX_TPM - import.meta.env.VITE_MAX_PROMPT_SIZE;

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const router = useRouter();

// Stores
const userStore = useUserStore();
const courseStore = useCourseStore();
const materialsStore = useMaterialsStore();

const supportedExtensions = ["txt", "md", "pdf"];
const fileInput = ref(null);

const extensionOf = (fileName) => fileName.toLowerCase().split(".").pop();

// States
const { isLoading: isLoadingFiles, load: loadFiles } =
    useSectionLoader("files");
const { isLoading: isGeneratingCourse, load: genCourseLoader } =
    useSectionLoader("genCourse");

const enc = encoding_for_model("gpt-5-mini");
const numTokens = ref(0);
const percTokens = computed(() => (numTokens.value * 100) / MAX_TPM);

function readFileAsText(file) {
    // NOTE: they're all considered plain text files...
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);

        reader.readAsText(file);
    });
}

function readBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const buffer = reader.result.split(",")[1];
            console.log(buffer);
            resolve(buffer);
        };

        reader.readAsDataURL(file);
    });
}

async function readFileAsPDF(file) {
    // Leggi il file come ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    console.log(arrayBuffer);

    // Carica il PDF
    const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
    }).promise;

    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n\n";
    }

    return fullText;
}

async function refreshCourse() {
    const fresh = await getCourse(courseStore._id);
    courseStore.set(fresh);
}

async function refreshMaterials() {
    const fresh = await getMaterialsFromCourseById(courseStore._id);
    materialsStore.materials = fresh;
}

async function uploadFiles(fileList) {
    loadFiles(async () => {
        let materials = [];

        for (const file of fileList) {
            const extension = extensionOf(file.name);

            let content;
            if (extension === "pdf") {
                content = await readFileAsPDF(file);
            } else {
                content = await readFileAsText(file);
            }

            let buffer = await readBuffer(file);

            materials.push({
                fileName: file.name,
                content: content,
                file: buffer,
            });
        }

        await addMaterialsToCourse(courseStore._id, materials);
        await refreshCourse();
        await refreshMaterials();
    });
}

async function deleteFile(index) {
    loadFiles(async () => {
        const id = materialsStore.materials[index]._id;
        await deleteMaterialFromCourseById(id, courseStore._id);
        await refreshCourse();
        await refreshMaterials();
    });
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
        const extension = extensionOf(file.name);
        if (!supportedExtensions.includes(extension)) {
            console.log("File", file.name, "not supported yet!");
        } else {
            validFiles.push(file);
        }
    });

    uploadFiles(validFiles);
}

async function generate() {
    genCourseLoader(async () => {
        await generateCourse(courseStore._id);
        await refreshCourse();
    });
}

function calculateTokens() {
    numTokens.value = enc.encode(
        materialsStore.materials.reduce(
            (acc, current) => (acc += current.title + current.content),
            "",
        ),
    ).length;
}

watch(materialsStore, () => {
    calculateTokens();
});

onMounted(async () => {
    await refreshMaterials();
    calculateTokens();
});
</script>

<template>
    <!-- Show materials -->
    <div class="accordion mb-3" id="accordion">
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button
                    class="accordion-button bg-transparent fs-4"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#materialAccordion"
                >
                    Materials
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
                    <Loader :isLoading="isLoadingFiles">
                        <FileList
                            :fileList="materialsStore.materials"
                            :deleteFile="deleteFile"
                        />
                    </Loader>

                    <div
                        :class="[
                            'my-3',
                            'w-100',
                            'text-end',
                            numTokens > MAX_TPM ? 'text-danger' : '',
                        ]"
                        style="font-size: 16px"
                    >
                        {{ parseInt(percTokens) }}% toks
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

                    <!-- Generate course button -->
                    <div class="text-center mt-4">
                        <button
                            :disabled="
                                materialsStore.materials.length === 0 ||
                                isGeneratingCourse ||
                                numTokens > MAX_TPM
                            "
                            class="btn btn-dark rounded-pill"
                            @click="generate"
                        >
                            Generate course
                        </button>
                    </div>

                    <div v-if="isGeneratingCourse" class="text-center mt-3">
                        <div class="spinner-border" role="status"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
