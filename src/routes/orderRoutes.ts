import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { errorHandler } from "../error-handler";
import {
  cancelOrder,
  changeStatus,
  createOrder,
  getOrderById,
  listAllOrders,
  listOrders,
  listUserOrders,
} from "../controllers/orderController";
import { adminMiddleware } from "../middlewares/admin";

const router: Router = Router();

router.post("/", [authMiddleware], errorHandler(createOrder));
router.get("/", [authMiddleware], errorHandler(listOrders));
router.put("/:id/cancel", [authMiddleware], errorHandler(cancelOrder));
router.get("/index", [authMiddleware, adminMiddleware], errorHandler(listAllOrders));
router.get("/users/:id", [authMiddleware, adminMiddleware], errorHandler(listUserOrders));
router.put("/:id/status", [authMiddleware, adminMiddleware], errorHandler(changeStatus));
router.get("/:id", [authMiddleware], errorHandler(getOrderById));

export default router;
