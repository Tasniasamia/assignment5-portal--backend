import { Router } from "express";
import { userController } from "./user.controller";
import { userValidationSchema } from "./user.validation";
import { validationRequest } from "../../middleware/validationRequest";

const router = Router();

router.post(
  "/create-admin",
  validationRequest(userValidationSchema.CreateAdminSchema),
  userController.createAdmin,
);

// userStatus Update
// Role Update
//delete user
// get all users (admin)

export const userRoutes = router;
