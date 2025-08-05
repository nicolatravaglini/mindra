import express from "express";
import { promisify } from "util";
import isAuthenticated from "./isAuth.js";

export default function (dbCourse, dbUser) {
    const router = express.Router();

    const dbInsert = promisify(dbCourse.insert.bind(dbCourse));
    const dbFind = promisify(dbCourse.find.bind(dbCourse));

    const auth = isAuthenticated(dbUser);

    router.post("/", auth, async (req, res) => {
        try {
            const body = req.body;
            if (!body) return res.status(400).json({ error: "Invalid body" });
            body.userId = req.session.userId;
            const newCourse = await dbInsert(body);
            console.log("Insertion completed:", newCourse);
            res.status(201).json(newCourse);
        } catch (err) {
            console.error("Error while inserting:", err);
            res.status(500).json({ error: err });
        }
    });

    router.get("/", auth, async (req, res) => {
        try {
            const userId = req.session.userId;
            const allCourses = await dbFind({ userId: userId });
            res.status(200).json({ courses: allCourses });
        } catch (err) {
            console.error("Error while fetching:", err);
            res.status(500).json({ error: err });
        }
    });

    return router;
}
