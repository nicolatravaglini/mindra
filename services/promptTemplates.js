export function generateCoursePrompt(content) {
    return `
Given the following university course content, generate a structured summary divided into:
- Macro topics
- Micro topics under each macro
- Simple quizzes for each micro topic

Material:
---
${content}
---
Respond following the indications for the fields of the JSON:
{
	course: [
	  {
		title: "Macro topic title",
		description: "Description",
		micro: [
		  {
			title: "Micro topic title",
			description: "Description",
			content: "The content of the micro explained from the material, formatted in html. It must explain everything regarding the micro topic, deep into details.",
			estimatedPomodoros: "Each one is 25 minutes of study, this number must be an integer >= 1"
			quizzes: ["Question 1", "Question 2"]
		  }
		]
	  }
	]
}

Write the formulas in LaTeX enclosed between \( ... \) for inline and \[ ... \] for block display. Do not convert them into images, and do not use any other HTML.
`.trim();
}
