import express from "express";
import cors from "cors";
import Datastore from "nedb";
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import courseRoute from "./routes/course.js";
import materialRoute from "./routes/material.js";
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
        origin: "http://localhost:5173",
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
            secure: false,
            sameSite: "Lax",
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

// Client
app.use(express.static("dist"));

app.listen(port, () => {
    console.log("Server listening...");
});
