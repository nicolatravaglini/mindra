const API_URL = import.meta.env.VITE_MINDRA_API;

export async function sendQuestion(title, content, question) {
    const response = await fetch(`${API_URL}/api/question`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title,
            content: content,
            question: question,
        }),
    });
    return (await response.json()).answer;
}
