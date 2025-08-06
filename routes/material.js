import express from "express";
import isAuthenticated from "./isAuth.js";
import { Material, Course } from "../schemas.js";

const router = express.Router();

// Post materials globally
router.post("/", isAuthenticated, async (req, res) => {
    try {
        const body = req.body;
        if (!body) return res.status(400).json({ error: "Invalid body" });
        body.userId = req.session.userId;
        const newMaterial = await Material.create(body);
        console.log("Insertion completed:", newMaterial);
        res.status(201).json(newMaterial);
    } catch (err) {
        console.error("Error while inserting:", err);
        res.status(500).json({ error: err });
    }
});

// Post materials to your course and globally
router.post("/toCourse", isAuthenticated, async (req, res) => {
    try {
        const courseId = req.query.courseId;
        const userId = req.session.userId;
        let body = req.body;
        if (!body) return res.status(400).json({ error: "Invalid body" });
        body = body.map((mat) => ({ ...mat, userId: userId }));
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
        const allMaterials = await Material.find({ _id: { $in: materialIds } });
        res.status(200).json({ materials: allMaterials });
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
        await Course.update(
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
