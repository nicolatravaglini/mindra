import { promisify } from "util";
import { User } from "../schemas.js";

async function isAuthorized(req, res, next) {
    if (req.session && req.session.userId) {
        const user = await User.findOne({ _id: req.session.userId });
        if (!user) {
            req.session.destroy(() => {
                res.status(401).json({ error: "Session invalid" });
            });
        } else {
            req.user = user;
            next();
        }
    } else {
        res.status(401).json({ error: "Not authorized" });
    }
}

export default isAuthorized;
