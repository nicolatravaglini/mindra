<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user.js";
import { useCourseStore } from "../stores/course.js";

const router = useRouter();
const userStore = useUserStore();
const courseStore = useCourseStore();

// TODO: at least pdfs!
const supportedExtensions = ["txt", "md"];
const files = ref([]);
const fileInput = ref(null);

function addFiles(fileList) {
    for (const file of fileList) {
        // NOTE: they're considered plain text files...
        const reader = new FileReader();

        reader.onload = () => {
            files.value.push({
                name: file.name,
                content: reader.result,
            });
        };

        reader.onerror = () => {
            console.error("Errore nella lettura del file:", file.name);
        };

        reader.readAsText(file);
    }
}

function triggerFileInput() {
    fileInput.value.click();
}

function handleDrop(event) {
    addFiles(event.dataTransfer.files);
}

function handleFileSelect(event) {
    let validFiles = [];

    Array.from(event.target.files).forEach((file) => {
        const extension = file.name.toLowerCase().split(".").pop();
        if (!supportedExtensions.includes(extension)) {
            console.log("File", file.name, "non supportato ancora!");
        } else {
            validFiles.push(file);
        }
    });

    addFiles(validFiles);
}

async function confirmFiles() {
    console.log(files.value);
}

function goBack() {
    courseStore.$reset();
    router.push("/courses");
}
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
                <h5 class="mb-3">Materiale caricato</h5>
                <ul class="list-unstyled">
                    <li v-for="(file, index) in files" :key="index">
                        {{ file.name }}
                    </li>
                    <li v-if="files.length === 0" class="text-muted">
                        Nessun file caricato.
                    </li>
                </ul>
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
