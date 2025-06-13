import { Router } from "express";
import authRoutes from "./authRoutes";
import productRoutes from "./productRoutes";
import userRoutes from "./userRoutes";
import cartRoutes from "./cartRoutes";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/cart", cartRoutes)

export default router;