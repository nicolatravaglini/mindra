const API_URL = import.meta.env.VITE_MINDRA_API;

export async function addCourse(course) {
    const response = await fetch(`${API_URL}/api/course`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
    });
    return await response;
}

export async function getCourses() {
    const response = await fetch(`${API_URL}/api/course`, {
        method: "GET",
        credentials: "include",
    });
    return (await response.json()).courses;
}

export async function getCourse(id) {
    const response = await fetch(`${API_URL}/api/course/${id}`, {
        method: "GET",
        credentials: "include",
    });
    return (await response.json()).course;
}

export async function deleteCourseById(id) {
    const response = await fetch(`${API_URL}/api/course/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    return await response;
}

export async function generateCourse(id) {
    const response = await fetch(`${API_URL}/api/course/${id}/generate`, {
        method: "GET",
        credentials: "include",
    });
    return (await response.json()).gen;
}
