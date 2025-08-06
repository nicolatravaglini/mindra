import { OpenAI } from "openai";
import { generateCoursePrompt } from "./promptTemplates.js";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateCourse(materials) {
    const prompt = generateCoursePrompt(materials);

    const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL,
        messages: [
            {
                role: "system",
                content: "You are a university teaching assistant.",
            },
            { role: "user", content: prompt },
        ],
        temperature: 0.7,
    });

    return response.choices[0].message.content;
}
