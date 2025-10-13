<script setup>
import { RouterView, useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";

const route = useRoute();
</script>

<template>
    <Navbar />
    <div :style="{ 'padding-top': route.path !== '/login' ? '56px' : '0px' }">
        <RouterView />
    </div>
</template>

<style scoped></style>
