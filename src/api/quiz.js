const API_URL = import.meta.env.VITE_MINDRA_API;

export async function checkAnswer(content, quiz, answer) {
    const response = await fetch(`${API_URL}/api/quiz/check`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content: content,
            quiz: quiz,
            answer: answer,
        }),
    });
    return await response.json();
}
