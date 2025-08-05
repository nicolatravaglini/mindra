import express from "express";
import { promisify } from "util";
import { User } from "../schemas.js";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const router = express.Router();

// Google Sign-In constants
const client = new OAuth2Client(process.env.CLIENT_ID);

async function verify(id_token) {
    const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.CLIENT_ID,
    });
    return ticket.getPayload();
}

router.post("/", async (req, res) => {
    const { id_token } = req.body;

    if (!id_token) {
        return res.status(400).json({ error: "Token ID missing" });
    }

    try {
        const payload = await verify(id_token);
        const { sub: googleId, email, name, picture } = payload;

        // Usa upsert per inserire o aggiornare in una sola operazione
        const result = await User.findOneAndUpdate(
            { googleId: googleId },
            {
                $set: {
                    email: email,
                    name: name,
                    picture: picture,
                },
            },
            {
                upsert: true,
                returnUpdatedDocs: true,
            },
        );

        // Recupera l'utente aggiornato
        const user = await User.findOne({ googleId: googleId });

        req.session.userId = user._id;

        res.status(200).json({
            message: "Access granted",
            user: user,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(401).json({ error: "Authentication failed" });
    }
});

export default router;
