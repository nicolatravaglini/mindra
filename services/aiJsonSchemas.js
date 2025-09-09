import { z } from "zod";

const Course = z.object({
    course: z.array(
        z.object({
            title: z.string(),
            description: z.string(),
            micro: z.array(
                z.object({
                    title: z.string(),
                    description: z.string(),
                    estimatedPomodoros: z.number(),
                }),
            ),
        }),
    ),
});

const Micro = z.object({
    content: z.string(),
    quizzes: z.array(z.string()),
});

const Check = z.object({
    valutation: z.number(),
    comment: z.string(),
});

export { Course, Micro, Check };
