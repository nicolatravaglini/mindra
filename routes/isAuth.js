import { promisify } from "util";

export default function (db) {
    const dbFindOne = promisify(db.findOne.bind(db));

    return async (req, res, next) => {
        if (req.session && req.session.userId) {
            const user = await dbFindOne({ _id: req.session.userId });
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
    };
}
