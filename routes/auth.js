import express from "express";
import { promisify } from "util";
import { OAuth2Client } from "google-auth-library";
import DbDAO from "../dbDAO.js";

const CLIENT_ID =
    "71677208610-9ccg33h9hb9bbo31m8uoqoa1n6g9nn71.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

async function verify(id_token) {
    const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: CLIENT_ID,
    });
    return ticket.getPayload();
}

export default function () {
    console.log("authentication started");
    const router = express.Router();

    const db = DbDAO.getInstance();

    router.post("/", async (req, res) => {
        const { id_token } = req.body;
        console.log(id_token);

        if (!id_token) {
            return res.status(400).json({ error: "Token ID missing" });
        }

        try {
            const payload = await verify(id_token, client, CLIENT_ID);
            const { sub: googleId, email, name, picture } = payload;

            // Usa upsert per inserire o aggiornare in una sola operazione
            const result = await db.call(
                "user",
                "update",
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
            const user = await db.call("user", "findOne", {
                googleId: googleId,
            });

            req.session.userId = user._id;
            req.session.save();

            console.log(req.session);

            const isNewUser = result.numAffected === 0 && result.upserted;

            res.status(isNewUser ? 201 : 200).json({
                message: isNewUser ? "New user created" : "User updated",
                user: user,
            });
        } catch (error) {
            console.error("Error:", error);
            res.status(401).json({ error: "Authentication failed" });
        }
    });

    return router;
}
