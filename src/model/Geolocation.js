import connectDB from "../config/db.js";
import { ObjectId } from "mongodb";

class Geolocation {
    static #collection = "geolocations";

    static async add(userId, geolocation) {
        if (!userId) {
            throw new Error("User ID is required");
        }
        if (!geolocation) {
            throw new Error("Geolocation data is required");
        }

        const db = await connectDB();
        const collection = db.collection(this.#collection);

        const result = await collection.insertOne({
            userId: new ObjectId(userId),
            ...geolocation,
        });

        return await collection.findOne({ _id: result.insertedId });
    }

    static async get(userId) {
        if (!userId) {
            throw new Error("User ID is required");
        }

        const db = await connectDB();
        const collection = db.collection(this.#collection);

        const geoData = await collection.findOne(
            { userId: new ObjectId(userId) },
            { projection: { _id: 0 } }
        );

        return geoData;
    }

    static async getAll(userId) {
        if (!userId) {
            throw new Error("User ID is required");
        }

        const db = await connectDB();
        const collection = db.collection(this.#collection);

        return await collection
            .find({ userId: new ObjectId(userId) })
            .toArray();
    }
}

export default Geolocation;
