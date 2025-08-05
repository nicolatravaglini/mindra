const API_URL = import.meta.env.VITE_MINDRA_API;

export async function logout() {
    const response = await fetch(`${API_URL}/api/user/logout`, {
        method: "GET",
        credentials: "include",
    });
    return await response;
}
