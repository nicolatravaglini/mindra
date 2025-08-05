import express from "express";
import cors from "cors";
import Datastore from "nedb";
import courseRoute from "./routes/course.js";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(express.static("dist"));

// Database
let db = {};
db.course = new Datastore({
    filename: "./db/course.db",
    autoload: true,
});

// Routes
app.use("/course", courseRoute(db.course));

app.listen(8000, () => {
    console.log("Server listening...");
});
