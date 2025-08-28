import express from "express";
import isAuthenticated from "./isAuth.js";
import { checkAnswer } from "../services/aiService.js";

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

export default router;
