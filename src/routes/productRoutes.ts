import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  searchProducts,
  updateProduct,
} from "../controllers/productController";
import { errorHandler } from "../error-handler";
import { authMiddleware } from "../middlewares/auth";
import { adminMiddleware } from "../middlewares/admin";

const router: Router = Router();

router.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(createProduct)
);
router.put(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateProduct)
);
router.delete(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(deleteProduct)
);
router.get("/", [authMiddleware, adminMiddleware], errorHandler(listProducts));
router.get("/search", [authMiddleware], errorHandler(searchProducts));
router.get(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(getProductById)
);

export default router;
