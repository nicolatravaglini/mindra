<script setup>
import { GoogleSignInButton } from "vue3-google-signin";
import { useRouter } from "vue-router";
import { sendGoogleIdToken } from "../api/auth.js";

const router = useRouter();

async function handleLoginSuccess(response) {
    const credential = response.credential;
    console.log("ID Token JWT:", credential);
    const res = await sendGoogleIdToken(credential);

    const j = await res.json();
    console.log(j);

    if (res.ok) router.push("/courses");
    else console.error("errore");
}

function handleLoginError() {
    console.error("Login fallito");
}
</script>

<template>
    <h1>Mindra</h1>
    <p>Accedi per iniziare</p>
    <br />
    <GoogleSignInButton
        @success="handleLoginSuccess"
        @error="handleLoginError"
    />
</template>
