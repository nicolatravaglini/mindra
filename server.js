import express from "express";
import fs from "fs";
import https from "https";
import cors from "cors";
import Datastore from "nedb";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import courseRoute from "./routes/course.js";
import materialRoute from "./routes/material.js";
import quizRoute from "./routes/quiz.js";
import questionRoute from "./routes/question.js";
import isAuthenticated from "./routes/isAuth.js";
import session from "express-session";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
global.rootDir = __dirname;
dotenv.config({ path: `${global.rootDir}/.env` });

// MongoDB
const uri = process.env.MONGODB_DEV;
await mongoose.connect(uri);
console.log("MongoDB connection settled");

const app = express();
const port = process.env.PORT_PROD;

app.use(express.json({ limit: "50mb" }));
app.use(
    cors({
        origin: true,
        credentials: true,
    }),
);
app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 3600000,
            httpOnly: true,
            secure: true,
            sameSite: "None",
        },
    }),
);

// Check auth
app.get("/api/isauth", isAuthenticated, (req, res) => {
    res.status(200).send();
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/course", courseRoute);
app.use("/api/material", materialRoute);
app.use("/api/quiz", quizRoute);
app.use("/api/question", questionRoute);

// Client
app.use(express.static("dist"));
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(global.rootDir, "dist", "index.html"));
});

const options = {
    key: fs.readFileSync("./certs/key.pem"),
    cert: fs.readFileSync("./certs/cert.pem"),
};

// app.listen(port, "0.0.0.0", () => {
//     console.log("Server listening...");
// });
https.createServer(options, app).listen(port, "0.0.0.0", () => {
    console.log(`Server HTTPS listening on port ${port}`);
});

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    process.exit(0);
});
