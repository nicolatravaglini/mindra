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
    materialsStore.$reset();
    courseStore.$reset();
    router.back();
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
    <nav class="navbar navbar-expand">
        <div
            class="container-fluid justify-content-between gap-3 align-items-center"
        >
            <div
                :style="{
                    visibility:
                        route.path === '/courses' ? 'hidden' : 'visible',
                }"
            >
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
