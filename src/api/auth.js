const API_URL = import.meta.env.VITE_MINDRA_API;

export async function sendGoogleIdToken(id_token) {
    const response = await fetch(`${API_URL}/api/auth`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_token: id_token }),
    });
    return await response;
}
