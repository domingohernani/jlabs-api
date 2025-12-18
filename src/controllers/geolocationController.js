import Geoloation from "../model/Geolocation.js";


export const getAllGeoloation = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            throw new Error("User ID is required");
        }

        const result = await Geoloation.getAll(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            message: error.message || "Failed to fetch geolocations",
            success: false,
        });
    }
};

export const addGeolocation = async (req, res) => {
    try {
        const { userId, geolocation } = req.body;

        if (!userId) {
            throw new Error("User ID is required");
        }
        if (!geolocation) {
            throw new Error("Geolocation data is required");
        }

        const result = await Geoloation.add(userId, geolocation)
        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({
            message: "Invalid email or password",
            isValid: false
        });
    }
};

