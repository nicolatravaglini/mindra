const API_URL = import.meta.env.VITE_MINDRA_API;

export async function getMaterialsFromCourseById(id) {
    const response = await fetch(
        `${API_URL}/api/material/fromCourse?courseId=${id}`,
        {
            method: "GET",
            credentials: "include",
        },
    );
    return (await response.json()).materials;
}

export async function getMaterialsFromUserId(id) {
    const response = await fetch(`${API_URL}/api/material/fromUser`, {
        method: "GET",
        credentials: "include",
    });
    return (await response.json()).materials;
}

export async function getMaterialById(id) {
    const response = await fetch(`${API_URL}/api/material/${id}`, {
        method: "GET",
        credentials: "include",
    });
    return (await response.json()).material;
}

export async function addMaterialsToCourse(id, materials) {
    const response = await fetch(
        `${API_URL}/api/material/toCourse?courseId=${id}`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(materials),
        },
    );
    return await response;
}

export async function deleteMaterialById(id) {
    const response = await fetch(`${API_URL}/api/material/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    return await response;
}

export async function deleteMaterialFromCourseById(materialId, courseId) {
    const response = await fetch(
        `${API_URL}/api/material/${materialId}/fromCourse?courseId=${courseId}`,
        {
            method: "DELETE",
            credentials: "include",
        },
    );
    return await response;
}
