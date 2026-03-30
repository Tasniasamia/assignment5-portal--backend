import { Router } from "express";
import { categoryController } from "./category.controller";
import { checkAuth } from "../../../middleware/checkAuth";
import { Role } from "../../../../generated/prisma/enums";


const router = Router();

router.get("/", categoryController.getAllCategories);
router.post("/", checkAuth(Role.ADMIN), categoryController.createCategory);
router.patch("/:id", checkAuth(Role.ADMIN), categoryController.updateCategory);
router.delete("/:id", checkAuth(Role.ADMIN), categoryController.deleteCategory);
router.get("/:id", checkAuth(Role.ADMIN), categoryController.getCategoryById);

export const categoryRoutes = router;