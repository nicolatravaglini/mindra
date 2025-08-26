<script setup></script>

<template>
    <div class="dropdown">
        <button class="btn rounded dropdown-toggle" data-bs-toggle="dropdown">
            <i class="bi bi-gear"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
            <slot></slot>
        </ul>
    </div>
</template>

<style scoped></style>
