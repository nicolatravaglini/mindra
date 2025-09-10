<script setup>
const props = defineProps(["isLoading", "msg"]);
</script>

<template>
    <div
        v-if="isLoading"
        class="d-flex flex-row justify-content-start align-items-center gap-3"
    >
        <div class="spinner-border" role="status"></div>
        <div class="fw-lighter" v-if="msg">{{ msg }}</div>
    </div>

    <slot v-else></slot>
</template>

<style scoped></style>
