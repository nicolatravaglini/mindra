import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { Course, Check } from "./aiJsonSchemas.js";
import { generateCoursePrompt, checkAnswerPrompt } from "./promptTemplates.js";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateCourse(materials) {
    const prompt = generateCoursePrompt();

    const response = await openai.responses.parse({
        model: process.env.OPENAI_MODEL,
        input: [
            {
                role: "system",
                content: prompt,
            },
            { role: "user", content: JSON.stringify(materials) },
        ],
        text: {
            format: zodTextFormat(Course, "course"),
        },
    });

    return JSON.stringify(response.output_parsed.course);
}

export async function checkAnswer(json) {
    const prompt = checkAnswerPrompt();

    const response = await openai.responses.parse({
        model: process.env.OPENAI_MODEL,
        input: [
            {
                role: "system",
                content: prompt,
            },
            { role: "user", content: JSON.stringify(json) },
        ],
        text: {
            format: zodTextFormat(Check, "check"),
        },
    });

    return JSON.stringify(response.output_parsed);
}
