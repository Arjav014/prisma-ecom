import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import {
  addAddress,
  changeRole,
  deleteAddress,
  getUserById,
  listAddress,
  listUsers,
  updateUser,
} from "../controllers/userController";

const router: Router = Router();

router.post("/address", [authMiddleware], errorHandler(addAddress));
router.delete("/address/:id", [authMiddleware], errorHandler(deleteAddress));
router.get("/address", [authMiddleware], errorHandler(listAddress));
router.put("/", [authMiddleware], errorHandler(updateUser));
router.get("/", [authMiddleware], errorHandler(listUsers));
router.get("/:id", [authMiddleware], errorHandler(getUserById));
router.put("/role/:id", [authMiddleware], errorHandler(changeRole));

export default router;
