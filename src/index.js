import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoute.js"
import geolocationRoute from "./routes/geolocationRoute.js"

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: ["http://localhost:5173"],
        credentials: true
    })
);

app.use("/api/", authRoutes)

app.use("/api/geolocations", geolocationRoute)

// simple route
app.get("/", (req, res) => {
    res.send("Hello!");
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
