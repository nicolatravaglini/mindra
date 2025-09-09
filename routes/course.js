import express from "express";
import isAuthenticated from "./isAuth.js";
import { Course, Material } from "../schemas.js";
import { generateCourse, generateMicro } from "../services/aiService.js";

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

router.delete("/:id", isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId;
        const courseId = req.params.id;
        await Course.deleteOne({
            userId: userId,
            _id: courseId,
        });
        res.status(200).send();
    } catch (err) {
        console.error("Error while deleting:", err);
        res.status(500).json({ error: err });
    }
});

router.delete("/:id/inner", isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId;
        const courseId = req.params.id;
        await Course.updateOne(
            {
                userId: userId,
                _id: courseId,
            },
            {
                $unset: {
                    course: [],
                    progress: {},
                },
            },
        );
        res.status(200).send();
    } catch (err) {
        console.error("Error while deleting:", err);
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
        const gen = await generateCourse(materials);
        const genJson = JSON.parse(gen);
        await Course.updateOne(
            { _id: courseId },
            {
                $set: {
                    course: genJson,
                    progress: [],
                },
            },
        );
        res.status(200).json({ gen: genJson });
    } catch (err) {
        console.error("Error while generating:", err);
        res.status(500).json({ error: err });
    }
});

router.get(
    "/:id/generate/:macroIdx/:microIdx",
    isAuthenticated,
    async (req, res) => {
        try {
            const userId = req.session.userId;
            const courseId = req.params.id;
            const macroIdx = req.params.macroIdx;
            const microIdx = req.params.microIdx;
            const course = await Course.findOne({
                userId: userId,
                _id: courseId,
            });
            const materialIds = course.materialIds;
            const materials = await Material.find({
                _id: { $in: materialIds },
            });
            const json = {
                materials: materials,
                title: course.course[macroIdx].micro[microIdx].title,
                description:
                    course.course[macroIdx].micro[microIdx].description,
            };
            const gen = await generateMicro(json);
            const genJson = JSON.parse(gen);
            await Course.updateOne(
                { _id: courseId },
                {
                    $set: {
                        [`course.${macroIdx}.micro.${microIdx}.content`]:
                            genJson.content,
                    },
                    $push: {
                        [`course.${macroIdx}.micro.${microIdx}.quizzes`]:
                            genJson.quizzes,
                    },
                },
            );
            res.status(200).json({ gen: genJson });
        } catch (err) {
            console.error("Error while generating:", err);
            res.status(500).json({ error: err });
        }
    },
);

export default router;
