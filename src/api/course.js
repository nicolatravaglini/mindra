const API_URL = import.meta.env.VITE_MINDRA_API;

export async function addCourse(course) {
    const response = await fetch(`${API_URL}/course`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
    });
    return await response;
}

export async function getCourses() {
    const response = await fetch(`${API_URL}/course`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return (await response.json()).courses;
}
