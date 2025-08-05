import express from "express";
import cors from "cors";
import courseRoute from "./routes/course.js";
import authRoute from "./routes/auth.js";
import isAuthenticated from "./routes/isAuth.js";
import session from "express-session";

const app = express();
const port = 8000;

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

// Check auth
app.get("/api/isauth", isAuthenticated, (req, res) => {
    res.status(200).send();
});

// Routes
app.use("/api/course", courseRoute);
app.use("/api/auth", authRoute);

// Client
app.use(express.static("dist"));

app.listen(port, () => {
    console.log("Server listening...");
});
