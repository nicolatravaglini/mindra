import { z } from "zod";

/* 
    course: [
        {
            title: String,
            description: String,
            micro: [
                {
                    title: String,
                    description: String,
                    content: String,
                    estimatedPomodoros: Number,
                    quizzes: [String],
                },
            ],
        },
    ],
 */

const Course = z.object({
    course: z.array(
        z.object({
            title: z.string(),
            description: z.string(),
            micro: z.array(
                z.object({
                    title: z.string(),
                    description: z.string(),
                    content: z.string(),
                    estimatedPomodoros: z.number(),
                    quizzes: z.array(z.string()),
                }),
            ),
        }),
    ),
});

export { Course };
