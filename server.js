import express from "express";
import cors from "cors";

const app = express();
app.use(express.static("dist"));
app.use(cors());

app.post("/course", (req, res) => {
    res.json({ message: "dio cane" }).send();
});

console.log("Server listening...");
app.listen(8000);
