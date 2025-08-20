<script setup>
const props = defineProps(["isLoading"]);
</script>

<template>
    <div v-if="isLoading">
        <div class="spinner-border" role="status"></div>
    </div>

    <slot v-else></slot>
</template>

<style scoped></style>
