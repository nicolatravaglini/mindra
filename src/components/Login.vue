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
            class="flex-grow-1 d-flex flex-column align-items-center justify-content-center gap-3"
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

            <div class="">
                <a href="https://ko-fi.com/N4N71IF71T" target="_blank"
                    ><img
                        height="36"
                        style="border: 0px; height: 36px"
                        src="https://storage.ko-fi.com/cdn/kofi4.png?v=6"
                        border="0"
                        alt="Buy Me a Coffee at ko-fi.com"
                /></a>
            </div>
        </main>
    </div>
</template>
