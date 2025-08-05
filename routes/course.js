import express from "express";
import { promisify } from "util";
import isAuthenticated from "./isAuth.js";
import DbDAO from "../dbDAO.js";

export default function () {
    const router = express.Router();

    const db = DbDAO.getInstance();

    router.post("/", isAuthenticated, async (req, res) => {
        try {
            const body = req.body;
            if (!body) return res.status(400).json({ error: "Invalid body" });
            body.userId = req.session.userId;
            const newCourse = await db.call("course", "insert", body);
            console.log("Insertion completed:", newCourse);
            res.status(201).json(newCourse);
        } catch (err) {
            console.error("Error while inserting:", err);
            res.status(500).json({ error: err });
        }
    });

    router.get("/", isAuthenticated, async (req, res) => {
        try {
            const userId = req.session.userId;
            const allCourses = await db.call("course", "find", {
                userId: userId,
            });
            res.status(200).json({ courses: allCourses });
        } catch (err) {
            console.error("Error while fetching:", err);
            res.status(500).json({ error: err });
        }
    });

    return router;
}
