import express from "express";
import { promisify } from "util";

export default function (db) {
    const router = express.Router();

    const dbInsert = promisify(db.insert.bind(db));
    const dbFind = promisify(db.find.bind(db));

    router.post("/", async (req, res) => {
        try {
            const body = req.body;
            if (!body) return res.status(400).json({ error: "Invalid body" });
            const newCourse = await dbInsert(body);
            console.log("Insertion completed:", newCourse);
            res.status(201).json(newCourse);
        } catch (err) {
            console.error("Error while inserting:", err);
            res.status(500).json({ error: err });
        }
    });

    router.get("/", async (req, res) => {
        try {
            const allCourses = await dbFind({});
            res.status(200).json({ courses: allCourses });
        } catch (err) {
            console.error("Error while fetching:", err);
            res.status(500).json({ error: err });
        }
    });

    return router;
}
