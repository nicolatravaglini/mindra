import express from "express";
import { promisify } from "util";

async function verify(id_token, client, CLIENT_ID) {
    const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: CLIENT_ID,
    });
    return ticket.getPayload();
}

export default function (db, client, CLIENT_ID) {
    const router = express.Router();

    const dbFindOne = promisify(db.findOne.bind(db));
    const dbUpdate = promisify(db.update.bind(db));
    const dbInsert = promisify(db.insert.bind(db));

    router.post("/", async (req, res) => {
        const { id_token } = req.body;

        if (!id_token) {
            return res.status(400).json({ error: "Token ID missing" });
        }

        try {
            const payload = await verify(id_token, client, CLIENT_ID);
            const { sub: googleId, email, name, picture } = payload;

            // Usa upsert per inserire o aggiornare in una sola operazione
            const result = await dbUpdate(
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
            const user = await dbFindOne({ googleId: googleId });

            req.session.userId = user._id;

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
