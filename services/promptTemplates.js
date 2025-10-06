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
          "estimatedPomodoros": "An integer >= 1, estimating the number of 30-minute Pomodoro sessions required to study this micro topic in depth.",
        }
      ]
    }
  ]
}

Additional requirements:
1. Macro Topics: Divide the material into major areas of study. Each macro topic should cover a coherent set of ideas.
2. Micro Topics: Break each macro into multiple micro topics (at least 2 if possible). Each micro should be atomic, covering a single concept or closely related group of ideas.
3. Pomodoro estimation: Estimate realistically based on content complexity and length.

The language of the course must match the one of the materials.
`.trim();
}

export function generateMicroPrompt() {
    return `
You are given the following university course material and a specific micro argument defined by its title and description.
Your task is to create the content and some quizzes of the micro-course.

The output must strictly follow this structure:

{
  "content": [
    "Each element of this array must be an HTML-formatted string representing a self-contained slide or section of the lesson. Each slide should cover one key concept or subtopic of the micro argument."
  ],
  "quizzes": [
    "At least 2 clear, self-contained quiz questions that test understanding of this micro topic. Questions must be phrased as if for a student self-test. All formulas must be written in LaTeX, using \\( ... \\) for inline and \\[ ... \\] for block display. Do not convert them into images or use MathML."
  ]
}

Critical requirements for the "content" field
1. "content" must be an array of HTML-formatted strings, where each array element represents a single slide or section.
	- Each slide should be a coherent, didactic unit (e.g. “Definition”, “Example”, “Proof”, “Applications”).
	- Aim for 4–10 slides per micro-course, depending on the complexity of the topic.
2. Each slide must contain:
	- A header (e.g. <h2> or <h3>) describing its focus.
	- One or more paragraphs of explanation in <p> tags.
	- Optional lists, examples, or math formulas as needed.
3. Overall, the slides together must form a detailed, structured explanation of the micro topic, rewritten from the provided material. Do not summarize in 2–3 sentences — write at the level of a study guide or mini-chapter.
4. Include:
	- Clear definitions and explanations of all relevant concepts.
	- Step-by-step reasoning for theorems, proofs, or algorithms.
	- Worked-out examples (with explanations of each step).
	- Connections to related ideas where helpful.
5. Use HTML for structure:
	- Headers: <h1>, <h2>, … <h6>
	- Paragraphs: <p> … </p>
	- Lists: <ul>, <ol>, <li>
	- Emphasis: <strong>, <em>
6. All mathematical content must use LaTeX, formatted as:
	- Inline math: \\( ... \\)
	- Block math: \\[ ... \\]
	- Do not output images or MathML.
7. Write in a clear academic style, as if preparing a teaching handout for students.

Additional requirements for "quizzes":
1. Provide 2–5 quiz questions.
2. Each quiz question must:
	- Test understanding, application, or recall.
	- Be clear and self-contained (no dependency on external context).
	- Use HTML for formatting and LaTeX for formulas.
3. Do not include answers — only the questions.

The language of the content must match the one of the provided materials.
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
Be concise in the comment and avoid repeating the material word-for-word, but at the same time be kind: if the student's answer is wrong, your goal is to help
them understand their mistakes.
`.trim();
}

export function generateQuizPrompt() {
    return `
You are an AI that generates quizzes for micro-courses.  

You will receive as input a JSON object containing:  
- The title and content of a micro-course.  
- An array of existing quizzes already associated with the course.  

Your task:  
- Analyze the micro-course content.  
- Create ONE new quiz question that is relevant to the course content.  
- Ensure the quiz is **not a duplicate or too similar** to the existing quizzes.  
- The output must be **only the new quiz as a string**, just the quiz you came up to.  
`.trim();
}

export function answerQuestionPrompt() {
    return `
You are an AI that replies to answers based on the content of a micro-course.

You will receive as input a JSON object containing:
- The title and content of a micro-course.
- A question raised by a student.

Your task:
- Analyze the micro-course content.
- Reply to the question properly.

All formulas must be written in LaTeX, using \\( ... \\) for inline and \\[ ... \\] for block display. Do not convert them into images or use MathML.
`.trim();
}
