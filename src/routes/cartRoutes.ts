import { Router } from "express";
import { errorHandler } from "../error-handler";
import { authMiddleware } from "../middlewares/auth";
import {
  addItemToCart,
  changeQuantity,
  deleteItemToCart,
  getCart,
} from "../controllers/cartController";

const router: Router = Router();

router.post("/", [authMiddleware], errorHandler(addItemToCart));
router.get("/", [authMiddleware], errorHandler(getCart));
router.delete("/:id", [authMiddleware], errorHandler(deleteItemToCart));
router.put("/:id", [authMiddleware], errorHandler(changeQuantity));

export default router;
