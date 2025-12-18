import * as jose from "jose";
import bcrypt from "bcrypt";
import User from "../model/User.js";


const privateKey = process.env.PRIVATE_KEY;
const publicKey = process.env.PUBLIC_KEY;

// I was not able to implement the refresh token due to time constraints,
// so I increased the expiration of the access token instead..
const ACCESS_TOKEN_EXPIRATION = "3hr";
const REFRESH_TOKEN_EXPIRATION = "30d";

const ACCESS_TOKEN_EXPIRATION_MS = 3 * 60 * 60 * 1000;
const REFRESH_TOKEN_EXPIRATION_MS = 30 * 24 * 60 * 60 * 1000;

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.getByEmail(email);

        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        console.log(user);

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

export const createToken = async (req, res) => {
    try {
        const user = req.body;

        const privateK = await jose.importPKCS8(privateKey, "RS256");

        const accessToken = await new jose.SignJWT(user)
            .setProtectedHeader({ alg: "RS256" })
            .setExpirationTime(ACCESS_TOKEN_EXPIRATION)
            .sign(privateK);

        const refreshToken = await new jose.SignJWT(user)
            .setProtectedHeader({ alg: "RS256" })
            .setExpirationTime(REFRESH_TOKEN_EXPIRATION)
            .sign(privateK);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: "/",
            maxAge: ACCESS_TOKEN_EXPIRATION_MS,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            path: "/",
            maxAge: REFRESH_TOKEN_EXPIRATION_MS,
        });

        res.status(200).json({ message: "Sucessfully authenticated", isValid: true });
    } catch (error) {
        res.status(401).json({
            message: "Invalid email or password",
            isValid: false
        });
    }
};

export const getAuthUser = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                message: "User not authenticated or missing ID",
            });
        }
        const fullUser = await User.getById(req.user._id);

        console.log("Full user!:", fullUser);


        if (!fullUser) {
            return res.status(404).json({
                message: "Authenticated user not found in database",
            });
        }
        res.status(200).json(fullUser);
    } catch (error) {
        console.error("Error getting authenticated user:", error);
        res.status(500).json({
            message: "Server error",
        });
    }
};

