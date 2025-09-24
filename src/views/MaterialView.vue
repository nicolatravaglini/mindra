<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import { getMaterialById } from "../api/material.js";
import Content from "../components/Content.vue";
import markdownit from "markdown-it";
import VuePdfEmbed from "vue-pdf-embed";
import Loader from "../components/Loader.vue";
import { useSectionLoader } from "../composables/useSectionLoader.js";
import "vue-pdf-embed/dist/styles/textLayer.css";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const md = markdownit();

// States
const { isLoading: isLoadingPdf, load: loadPdf } = useSectionLoader("pdf");

const route = useRoute();
const material = ref({});
const ext = computed(() =>
    material.value.fileName?.toLowerCase().split(".").pop(),
);
const pdfPage = ref(1);
const numPdfPages = ref(null);
const divRef = ref(null);
const divPixels = ref(null);

let resizeObserver;

async function refreshMaterial() {
    const id = route.params.id;
    material.value = await getMaterialById(id);
}

async function loadPdfPages() {
    const loadingTask = pdfjsLib.getDocument(material.value.file);
    const pdf = await loadingTask.promise;
    numPdfPages.value = pdf.numPages;
}

watch(
    divRef,
    (el) => {
        resizeObserver?.disconnect();
        resizeObserver = null;

        if (el) {
            divPixels.value = el.offsetWidth;

            resizeObserver = new ResizeObserver(() => {
                divPixels.value = el.offsetWidth;
            });

            resizeObserver.observe(el);
        }
    },
    { immediate: true },
);

onMounted(async () => {
    loadPdf(async () => {
        await refreshMaterial();
        if (ext.value === "pdf") {
            await loadPdfPages();
        }
    });
});

onUnmounted(() => {
    resizeObserver?.disconnect();
});
</script>

<template>
    <div class="container-fluid">
        <div class="container pt-5">
            <Loader :isLoading="isLoadingPdf" msg="Loading the material...">
                <!-- Title -->
                <div class="mb-4 border-bottom">
                    <h1>{{ material.fileName }}</h1>
                </div>

                <!-- Content -->
                <div v-if="ext === 'md'" class="mt-4">
                    <Content :content="md.render(material.content)" />
                </div>
                <div v-else-if="ext === 'txt'" class="mt-4">
                    {{ material.content }}
                </div>
                <div v-else-if="ext === 'pdf'" class="mt-4">
                    <div
                        class="d-flex flex-column justify-content-start align-items-center gap-3"
                        ref="divRef"
                    >
                        <div
                            class="d-flex flex-row justify-content-between align-items-center gap-3"
                        >
                            <button
                                class="btn border-0"
                                @click="pdfPage--"
                                :disabled="pdfPage === 1"
                            >
                                <i class="bi bi-arrow-left"></i>
                            </button>
                            <div class="">Page: {{ pdfPage }}</div>
                            <button
                                class="btn border-0"
                                @click="pdfPage++"
                                :disabled="pdfPage === numPdfPages"
                            >
                                <i class="bi bi-arrow-right"></i>
                            </button>
                        </div>
                        <div
                            class="my-2 border border-dark-subtle border-secondary rounded-4 p-0"
                            style="overflow: hidden"
                        >
                            <VuePdfEmbed
                                text-layer
                                :source="material.file"
                                :page="pdfPage"
                                :width="divPixels"
                            />
                        </div>
                    </div>
                </div>
            </Loader>
        </div>
    </div>
</template>

<style scoped></style>
