import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import {
  addAddress,
  deleteAddress,
  listAddress,
  updateUser,
} from "../controllers/userController";

const router: Router = Router();

router.post("/address", [authMiddleware], errorHandler(addAddress));
router.delete("/address/:id", [authMiddleware], errorHandler(deleteAddress));
router.get("/address", [authMiddleware], errorHandler(listAddress));
router.put("/", [authMiddleware], errorHandler(updateUser));

export default router;
