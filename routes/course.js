import express from "express";
import isAuthenticated from "./isAuth.js";
import { Course, Material } from "../schemas.js";
import { generateCourse } from "../services/aiService.js";

const router = express.Router();

router.post("/", isAuthenticated, async (req, res) => {
    try {
        const body = req.body;
        if (!body) return res.status(400).json({ error: "Invalid body" });
        body.userId = req.session.userId;
        const newCourse = await Course.create(body);
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
        const allCourses = await Course.find({ userId: userId });
        res.status(200).json({ courses: allCourses });
    } catch (err) {
        console.error("Error while fetching:", err);
        res.status(500).json({ error: err });
    }
});

router.get("/:id", isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId;
        const courseId = req.params.id;
        const course = await Course.findOne({
            userId: userId,
            _id: courseId,
        });
        res.status(200).json({ course: course });
    } catch (err) {
        console.error("Error while fetching:", err);
        res.status(500).json({ error: err });
    }
});

router.get("/:id/generate", isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId;
        const courseId = req.params.id;
        const course = await Course.findOne({
            userId: userId,
            _id: courseId,
        });
        const materialIds = course.materialIds;
        const materials = await Material.find({ _id: { $in: materialIds } });
        const gen = JSON.parse(await generateCourse(materials));
        await Course.updateOne({ _id: courseId }, { $set: { course: gen } });
        res.status(200).json({ gen: gen });
    } catch (err) {
        console.error("Error while fetching:", err);
        res.status(500).json({ error: err });
    }
});

export default router;
