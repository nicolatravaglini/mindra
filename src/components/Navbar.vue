<script setup>
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "../stores/user.js";
import { useCourseStore } from "../stores/course.js";
import { useMaterialsStore } from "../stores/material.js";
import { logout } from "../api/user.js";

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
const courseStore = useCourseStore();
const materialsStore = useMaterialsStore();

function goBack() {
    router.back();
}

function goMyMaterials() {
    router.push("/mymaterials");
}

async function logoutAndLogin() {
    const response = await logout();
    if (response.ok) {
        materialsStore.$reset();
        userStore.$reset();
        router.push("/login");
    }
}
</script>

<template>
    <nav v-if="route.path !== '/login'" class="navbar navbar-expand">
        <div
            class="container-fluid justify-content-between gap-3 align-items-center"
        >
            <div class="d-flex align-items-center justify-content-start">
                <div v-show="route.path !== '/courses'">
                    <button class="btn" @click="goBack">
                        <i class="bi bi-arrow-left"></i>
                    </button>
                </div>

                <div>
                    <button class="btn" @click="goMyMaterials">
                        My materials
                    </button>
                </div>
            </div>

            <div class="d-flex justify-content-end align-items-center gap-3">
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
</template>

<style scoped></style>
