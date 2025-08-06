<script setup>
import { GoogleSignInButton } from "vue3-google-signin";
import { useRouter } from "vue-router";
import { sendGoogleIdToken } from "../api/auth.js";
import { useUserStore } from "../stores/user.js";

const router = useRouter();
const userStore = useUserStore();

async function handleLoginSuccess(response) {
    const credential = response.credential;
    const res = await sendGoogleIdToken(credential);

    if (res.ok) {
        const data = await res.json();
        userStore._id = data.user._id;
        userStore.name = data.user.name;
        userStore.picture = data.user.picture;
        router.push("/courses");
    } else {
        console.error("errore");
    }
}

function handleLoginError() {
    console.error("Login failed");
}
</script>

<template>
    <div class="container-fluid min-vh-100 d-flex flex-column">
        <main
            class="flex-grow-1 d-flex align-items-center justify-content-center"
        >
            <div class="text-center">
                <h1 class="fw-bold mb-3" style="font-size: 2.5rem">Mindra</h1>
                <p class="fw-normal mb-4" style="font-size: 1.1rem">
                    Login to start
                </p>

                <GoogleSignInButton
                    @success="handleLoginSuccess"
                    @error="handleLoginError"
                />
            </div>
        </main>
    </div>
</template>
