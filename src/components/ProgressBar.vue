<script setup>
const props = defineProps({
    progPerc: Number,
});
</script>

<template>
    <div class="progress" style="height: 3px">
        <div
            class="progress-bar bg-dark"
            :style="{ width: progPerc + '%' }"
        ></div>
    </div>
</template>

<style scoped></style>
