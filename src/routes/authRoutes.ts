import { Router } from "express";
import { login, me, signup } from "../controllers/authController";
import { errorHandler } from "../error-handler";
import { authMiddleware } from "../middlewares/auth";

const router: Router = Router();

router.post("/signup", errorHandler(signup));
router.post("/login", errorHandler(login));
router.get("/me", [authMiddleware], errorHandler(me));

export default router;
