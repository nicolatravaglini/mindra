<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
</script>

<template>
    <Navbar />
    <div style="padding-top: 56px">
        <RouterView />
    </div>
</template>

<style scoped></style>
