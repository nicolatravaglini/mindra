import express from "express";
import isAuthenticated from "./isAuth.js";
import { Material, Course } from "../schemas.js";

const router = express.Router();

// Post materials to your course and globally
router.post("/toCourse", isAuthenticated, async (req, res) => {
    try {
        const courseId = req.query.courseId;
        const userId = req.session.userId;
        let body = req.body;
        console.log("POST MATERIALS");
        console.log(body);
        if (!body) return res.status(400).json({ error: "Invalid body" });
        body = body.map((mat) => ({ ...mat, userId: userId }));
        body.forEach((mat) => {
            mat.file = Buffer.from(mat.file, "base64");
        });
        const newMaterials = await Material.insertMany(body);
        console.log("Insertion completed:", newMaterials);
        const updatedCourse = await Course.updateOne(
            { _id: courseId },
            {
                $addToSet: {
                    materialIds: {
                        $each: newMaterials.map((nmat) => nmat._id),
                    },
                },
            },
        );
        console.log("Update completed:", updatedCourse);
        res.status(201).json(newMaterials);
    } catch (err) {
        console.error("Error while inserting:", err);
        res.status(500).json({ error: err });
    }
});

router.get("/fromCourse", isAuthenticated, async (req, res) => {
    try {
        const courseId = req.query.courseId;
        const course = await Course.findOne({ _id: courseId });
        const materialIds = course.materialIds;
        const allMaterials = await Material.find(
            { _id: { $in: materialIds } },
            { _id: 1, userId: 1, fileName: 1, content: 1 },
        );
        res.status(200).json({ materials: allMaterials });
    } catch (err) {
        console.error("Error while fetching:", err);
        res.status(500).json({ error: err });
    }
});

router.get("/fromUser", isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId;
        const allMaterials = await Material.find(
            { userId: userId },
            { _id: 1, userId: 1, fileName: 1 },
        );
        res.status(200).json({ materials: allMaterials });
    } catch (err) {
        console.error("Error while fetching:", err);
        res.status(500).json({ error: err });
    }
});

router.get("/:id", isAuthenticated, async (req, res) => {
    try {
        const id = req.params.id;
        const material = await Material.findOne({ _id: id });
        res.status(200).json({ material: material });
    } catch (err) {
        console.error("Error while fetching:", err);
        res.status(500).json({ error: err });
    }
});

// Delete the material globally
router.delete("/:id", isAuthenticated, async (req, res) => {
    try {
        const materialId = req.params.id;
        await Material.deleteOne({ _id: materialId });
        await Course.updateMany(
            {},
            {
                $pull: { materialIds: materialId },
            },
        );
        console.log("Deletion completed");
        res.status(200).send();
    } catch (err) {
        console.error("Error while deleting:", err);
        res.status(500).json({ error: err });
    }
});

// Delete the material locally to your course
router.delete("/:id/fromCourse", isAuthenticated, async (req, res) => {
    try {
        const courseId = req.query.courseId;
        const materialId = req.params.id;
        const updatedCourse = await Course.updateOne(
            { _id: courseId },
            { $pull: { materialIds: materialId } },
        );
        console.log("Update completed:", updatedCourse);
        res.status(200).send();
    } catch (err) {
        console.error("Error while deleting:", err);
        res.status(500).json({ error: err });
    }
});

export default router;
