import { promisify } from "util";
import Datastore from "nedb";

const collections = ["course", "user"];
const operators = ["findOne", "find", "update", "insert"];

class DbDAO {
    constructor() {
        this.db = {};
        collections.forEach((coll) => {
            const ds = new Datastore({
                filename: `./db/${coll}.db`,
                autoload: true,
            });

            this.db[coll] = {};
            operators.forEach((oper) => {
                this.db[coll][oper] = promisify(ds[oper].bind(ds));
            });
        });
        console.log(this.db);
    }

    async call(collection, operator, ...parameters) {
        return await this.db[collection][operator](...parameters);
    }
}

export default DbDAO;
