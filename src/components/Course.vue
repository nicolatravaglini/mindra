<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user.js";
import { useCourseStore } from "../stores/course.js";
import {
    getMaterialsFromCourseById,
    addMaterialsToCourse,
    deleteMaterialFromCourseById,
} from "../api/material.js";
import { useSectionLoader } from "../composables/useSectionLoader.js";

const router = useRouter();
const userStore = useUserStore();
const courseStore = useCourseStore();

// TODO: at least pdfs (with parsing)!
const supportedExtensions = ["txt", "md"];
const files = ref([]);
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

async function downloadFiles() {
    loadFiles(async () => {
        files.value = await getMaterialsFromCourseById(courseStore._id);
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
    await downloadFiles();
}

async function deleteFile(index) {
    const id = files.value[index]._id;
    await deleteMaterialFromCourseById(id, courseStore._id);
    await downloadFiles();
}

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
            console.log("File", file.name, "non supported yet!");
        } else {
            validFiles.push(file);
        }
    });

    uploadFiles(validFiles);
}

async function confirmFiles() {
    console.log(files.value);
}

function goBack() {
    courseStore.$reset();
    router.push("/courses");
}

async function logoutAndLogin() {
    const response = await logout();
    if (response.ok) {
        userStore.$reset();
        router.push("/login");
    }
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
    await downloadFiles();
});
</script>

<template>
    <div class="container-fluid">
        <nav class="navbar navbar-expand">
            <div
                class="container-fluid justify-content-between gap-3 align-items-center"
            >
                <div>
                    <button class="btn" @click="goBack">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-arrow-left"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                            />
                        </svg>
                    </button>
                </div>
                <div
                    class="d-flex justify-content-end align-items-center gap-3"
                >
                    <span class="fw-semibold d-none d-sm-block">
                        {{ userStore.name }}
                    </span>
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
            </div>
        </nav>

        <div class="container py-5">
            <!-- Name of the course -->
            <div class="mb-4">
                <h1>{{ courseStore.name }}</h1>
            </div>

            <!-- Show materials -->
            <div class="mb-4 border rounded p-4 bg-white text-dark min-vh-25">
                <h5 class="mb-3">Material loaded</h5>

                <div v-if="isLoadingFiles">
                    <div class="spinner-border" role="status"></div>
                </div>

                <div v-else>
                    <div v-if="files.length === 0" class="text-muted">
                        No files.
                    </div>

                    <div class="d-flex flex-wrap gap-3">
                        <div
                            v-for="(file, index) in files"
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

                <button
                    v-if="files.length > 0"
                    class="btn btn-dark"
                    @click="confirmFiles"
                >
                    Confirm
                </button>
            </div>

            <!-- Dropzone -->
            <div
                class="border rounded p-5 text-center bg-light"
                @dragover.prevent
                @dragenter.prevent
                @drop.prevent="handleDrop"
                @click="triggerFileInput"
                style="cursor: pointer"
            >
                <p class="mb-0 text-muted">
                    Drag and drop here the materials or click to insert them.
                </p>
                <p class="mb-0 text-muted">
                    (note: the supported extensions are
                    {{ supportedExtensions.join(", ") }})
                </p>

                <input
                    ref="fileInput"
                    type="file"
                    :accept="
                        supportedExtensions.map((ext) => '.' + ext).join(',')
                    "
                    multiple
                    class="d-none"
                    @change="handleFileSelect"
                />
            </div>
        </div>
    </div>
</template>

<style scoped></style>
