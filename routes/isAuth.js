import { promisify } from "util";
import DbDAO from "../dbDAO.js";

export default async function (req, res, next) {
    const db = new DbDAO();
    if (req.session && req.session.userId) {
        const user = await db.call("user", "findOne", {
            _id: req.session.userId,
        });
        if (!user) {
            req.session.destroy(() => {
                res.status(401).json({ error: "Session invalid" });
            });
        } else {
            req.user = user;
            next();
        }
    } else {
        console.log(req.session);
        res.status(401).json({ error: "Not authorized" });
    }
}
