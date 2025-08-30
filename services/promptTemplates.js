export function generateCoursePrompt() {
    return `
You are given the following university course material. Your task is to transform it into a well-structured study plan in JSON format.

The output must strictly follow this structure:
{
  "course": [
    {
      "title": "Macro topic title",
      "description": "A concise summary of the macro topic (2–4 sentences).",
      "micro": [
        {
          "title": "Micro topic title",
          "description": "A brief explanation (1–3 sentences) of what the student will learn in this micro topic.",
          "content": "A detailed explanation of the micro topic extracted from the provided material, written in clear academic style. Use <p>, <ul>, <ol>, <li>, <strong>, and <em> HTML tags for formatting. Include all relevant concepts, theorems, proofs, examples, and explanations. All formulas must be written in LaTeX, using \\( ... \\) for inline and \\[ ... \\] for block display. Do not convert them into images or use MathML.",
          "estimatedPomodoros": "An integer >= 1, estimating the number of 30-minute Pomodoro sessions required to study this micro topic in depth.",
          "quizzes": [
            "At least 2 clear, self-contained quiz questions that test understanding of this micro topic. Questions must be phrased as if for a student self-test."
          ]
        }
      ]
    }
  ]
}

Additional requirements:
1. Macro Topics: Divide the material into major areas of study. Each macro topic should cover a coherent set of ideas.
2. Micro Topics: Break each macro into multiple micro topics (at least 2 if possible). Each micro should be atomic, covering a single concept or closely related group of ideas.
3. Content depth: For each micro, the "content" must be a full explanation from the material, rewritten clearly and enriched with context (not just copied). Use HTML tags for readability, and LaTeX for formulas.
4. Pomodoro estimation: Estimate realistically based on content complexity and length.
5. Quizzes: For each micro, provide 2–5 quiz questions. They should focus on understanding, application, and recall (not just definitions).
`.trim();
}

export function checkAnswerPrompt() {
    return `
You are an AI tutor. Your task is to evaluate a student's answer.

You will be given:
- Some material (reference text the student studied).
- A question based on that material.
- The student’s answer.

Compare the student’s answer with the material and the question, then provide your evaluation following strictly this JSON schema:
{
  "valutation": "A score out of 10 of the answer, should be an integer",
  "comment": "A brief comment on the answer, what could have been said better, what misses, what's good, etc... . All formulas must be written in LaTeX, using \\( ... \\) for inline and \\[ ... \\] for block display. Do not convert them into images or use MathML."
}
Be concise in the comment and avoid repeating the material word-for-word.
`.trim();
}
