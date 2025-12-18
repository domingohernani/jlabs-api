import { Router } from "express";
import {
    login,
    createToken,
    getAuthUser,
} from "../controllers/authController.js";
import { verifyJwt } from "../middlewares/verifyJwt.js";
const router = Router();


router.post("/login", login);

router.post("/create-token", createToken);

router.get("/me", verifyJwt, getAuthUser);

export default router;