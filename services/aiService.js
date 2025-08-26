import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { Course } from "./aiJsonSchemas.js";
import { generateCoursePrompt } from "./promptTemplates.js";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateCourse(materials) {
    const prompt = generateCoursePrompt(materials);

    const response = await openai.responses.parse({
        model: process.env.OPENAI_MODEL,
        input: [
            {
                role: "system",
                content: "You are a university teaching assistant.",
            },
            { role: "user", content: prompt },
        ],
        text: {
            format: zodTextFormat(Course, "course"),
        },
    });

    console.log(response.output_parsed.course);
    return JSON.stringify(response.output_parsed.course);
}
