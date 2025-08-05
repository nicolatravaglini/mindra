import express from "express";
import cors from "cors";
import Datastore from "nedb";
import courseRoute from "./routes/course.js";
import authRoute from "./routes/auth.js";
import isAuthenticated from "./routes/isAuth.js";
import session from "express-session";
import { OAuth2Client } from "google-auth-library";

const app = express();
const port = 8000;

const CLIENT_ID =
    "71677208610-9ccg33h9hb9bbo31m8uoqoa1n6g9nn71.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

app.use(express.json({ limit: "50mb" }));
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
);
app.use(
    session({
        // TODO: change secret key
        secret: "INDOVINA",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 3600000,
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
        },
    }),
);

// Database
let db = {};
db.course = new Datastore({
    filename: "./db/course.db",
    autoload: true,
});
db.user = new Datastore({
    filename: "./db/user.db",
    autoload: true,
});

// Check auth
app.get("/api/isauth", isAuthenticated(db.user), (req, res) => {
    res.status(200).send();
});

// Routes
app.use("/api/course", courseRoute(db.course, db.user));
app.use("/api/auth", authRoute(db.user, client, CLIENT_ID));

// Client
app.use(express.static("dist"));

app.listen(port, () => {
    console.log("Server listening...");
});
