import express from "express";
import isAuthenticated from "./isAuth.js";
import { checkAnswer } from "../services/aiService.js";
import { Course } from "../schemas.js";

const router = express.Router();

router.post("/check", isAuthenticated, async (req, res) => {
    try {
        const body = req.body;
        if (!body) return res.status(400).json({ error: "Invalid body" });
        const gen = await checkAnswer(body);
        const genJson = JSON.parse(gen);
        res.status(201).json(genJson);
    } catch (err) {
        console.error("Error while generating:", err);
        res.status(500).json({ error: err });
    }
});

router.post("/save", isAuthenticated, async (req, res) => {
    try {
        const body = req.body;
        if (!body) return res.status(400).json({ error: "Invalid body" });
        const {
            courseId,
            macroIndex,
            microIndex,
            quizIndex,
            answer,
            valutation,
            comment,
        } = body;

        // Provo ad aggiornare se esiste
        const updated = await Course.updateOne(
            { _id: courseId },
            {
                $set: {
                    "progress.$[elem].answer": answer,
                    "progress.$[elem].valutation": valutation,
                    "progress.$[elem].comment": comment,
                },
            },
            {
                arrayFilters: [
                    {
                        "elem.macroIndex": macroIndex,
                        "elem.microIndex": microIndex,
                        "elem.quizIndex": quizIndex,
                    },
                ],
            },
        );

        // Se non è stato aggiornato nulla, allora faccio il push
        if (updated.modifiedCount === 0) {
            await Course.updateOne(
                { _id: courseId },
                {
                    $push: {
                        progress: {
                            macroIndex,
                            microIndex,
                            quizIndex,
                            answer,
                            valutation,
                            comment,
                        },
                    },
                },
            );
        }

        // await Course.updateOne(
        //     {
        //         _id: courseId,
        //         "progress.$.macroIndex": macroIndex,
        //         "progress.$.microIndex": microIndex,
        //         "progress.$.quizIndex": quizIndex,
        //     },
        //     {
        //         $set: {
        //             "progress.$.answer": answer,
        //             "progress.$.valutation": valutation,
        //             "progress.$.comment": comment,
        //         },
        //     },
        // );
        //
        // await Course.updateOne(
        //     {
        //         _id: courseId,
        //         progress: {
        //             $not: {
        //                 $elemMatch: {
        //                     macroIndex,
        //                     microIndex,
        //                     quizIndex,
        //                 },
        //             },
        //         },
        //     },
        //     {
        //         $push: {
        //             progress: {
        //                 macroIndex,
        //                 microIndex,
        //                 quizIndex,
        //                 answer,
        //                 valutation,
        //                 comment,
        //             },
        //         },
        //     },
        // );
        res.status(200).send();
    } catch (err) {
        console.error("Error while updating:", err);
        res.status(500).json({ error: err });
    }
});

export default router;
