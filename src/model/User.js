import connectDB from "../config/db.js";
import { ObjectId } from "mongodb";

class User {
    static #collection = "users";

    static async getById(id) {
        if (!id) {
            throw new Error("ID is required");
        }

        const db = await connectDB();
        const collection = db.collection(this.#collection);

        const user = await collection.findOne({ _id: new ObjectId(id) }, {
            projection: { password: 0 },
        });

        return user;
    }

    static async getByEmail(email) {
        if (!email) {
            throw new Error("Email is required");
        }

        const db = await connectDB();
        const collection = db.collection(this.#collection);

        const user = await collection.findOne({ email: email });

        return user;
    }
}

export default User;