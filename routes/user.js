import express from "express";
import { promisify } from "util";
import isAuthenticated from "./isAuth.js";
import { Course } from "../schemas.js";

const router = express.Router();

router.get("/logout", isAuthenticated, async (req, res) => {
    try {
        req.session.destroy();
        res.status(200).send();
    } catch (err) {
        console.error("Error while inserting:", err);
        res.status(500).json({ error: err });
    }
});

export default router;
