import { Router } from "express";
import {
    addGeolocation,
    getAllGeoloation
} from "../controllers/geolocationController.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";
const router = Router();


router.get("/user/:id", getAllGeoloation);

router.post("/user", verifyJwt, addGeolocation);

export default router;