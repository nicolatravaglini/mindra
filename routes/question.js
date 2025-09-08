import express from "express";
import isAuthenticated from "./isAuth.js";
import { answerQuestion } from "../services/aiService.js";

const router = express.Router();

router.post("/", isAuthenticated, async (req, res) => {
    try {
        const body = req.body;
        if (!body) return res.status(400).json({ error: "Invalid body" });
        const gen = await answerQuestion(body);
        res.status(201).json({ answer: gen });
    } catch (err) {
        console.error("Error while generating:", err);
        res.status(500).json({ error: err });
    }
});

export default router;
