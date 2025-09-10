<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
    fileList: Array,
    deleteFile: Function,
});

const router = useRouter();

function getFileIconClass(fileName) {
    const ext = fileName.toLowerCase().split(".").pop();
    switch (ext) {
        case "txt":
            return "bi bi-file-earmark-text";
        case "md":
            return "bi bi-markdown";
        case "pdf":
            return "bi bi-file-earmark-pdf";
        default:
            return "bi bi-file-earmark";
    }
}

function pushMaterialView(index) {
    router.push(`/materials/${props.fileList[index]._id}`);
}
</script>

<template>
    <div v-if="fileList.length === 0" class="text-muted">No files.</div>

    <div class="d-flex flex-wrap gap-3">
        <div
            v-for="(file, index) in fileList"
            :key="index"
            class="btn position-relative border rounded p-3 bg-light text-dark d-flex flex-column align-items-start"
            style="width: 180px; height: 75px"
            @click="pushMaterialView(index)"
        >
            <!-- Icon + name -->
            <div class="d-flex align-items-center gap-2">
                <i :class="getFileIconClass(file.fileName)" class="fs-4"></i>
                <span class="text-truncate small" style="max-width: 110px">
                    {{ file.fileName }}
                </span>
            </div>

            <!-- Button for removing -->
            <button
                type="button"
                class="btn-close position-absolute top-0 end-0 m-2"
                aria-label="Close"
                @click.prevent="deleteFile(index)"
            ></button>
        </div>
    </div>
</template>

<style scoped></style>
