export function generateCoursePrompt(content) {
    return `
Given the following university course content, generate a structured summary divided into:
- Macro topics
- Micro topics under each macro
- Optionally, simple quizzes for each micro topic

Material:
---
${content}
---
Respond in JSON format following this schema:

[
  {
    "title": "Macro topic title",
    "description": "Description",
    "micro": [
      {
        "title": "Micro topic title",
        "description": "Description",
        "quizzes": ["Question 1", "Question 2"]
      }
    ]
  }
]

Do not use Latex in strings.
`.trim();
}
