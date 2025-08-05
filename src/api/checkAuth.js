const API_URL = import.meta.env.VITE_MINDRA_API;

export async function checkAuth() {
    const response = await fetch(`${API_URL}/api/isauth`, {
        method: "GET",
        credentials: "include",
    });
    return response.ok;
}
