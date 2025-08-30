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

export async function saveAnswer(
    courseId,
    macroIndex,
    microIndex,
    quizIndex,
    answer,
    valutation,
    comment,
) {
    const response = await fetch(`${API_URL}/api/quiz/save`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            courseId: courseId,
            macroIndex: macroIndex,
            microIndex: microIndex,
            quizIndex: quizIndex,
            answer: answer,
            valutation: valutation,
            comment: comment,
        }),
    });
    return await response;
}
