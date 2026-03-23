import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { authValidationSchema } from "./auth.validation";
import { validationRequest } from "../../middleware/validationRequest";
import { multerUpload } from "../../../config/multer.config";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.loginUser);
router.get(
  "/me",
  checkAuth(Role.ADMIN, Role.MEMBER),
  AuthController.getProfile
);
router.get("/refresh-token", AuthController.getNewToken);
router.post(
  "/changePassword",
  validationRequest(authValidationSchema.changePasswordSchema),
  AuthController.changePassword
);
router.get("/logOut",checkAuth(Role.ADMIN, Role.MEMBER), AuthController.logOut);
router.post("/resend-otp", AuthController.resendOtp);
router.post("/verify-email",AuthController.verifyEmail);
router.post("/sendOtp",AuthController.requestPasswordReset);
router.post("/resetPassword",AuthController.resetPasswordReset);
router.get("/login/google",AuthController.googleLogin);
router.get("/google/success",AuthController.googleSuccess);
router.patch("/update-profile",checkAuth(Role.ADMIN, Role.MEMBER),multerUpload.single("file"),AuthController.updateProfile)

export const AuthRoutes = router;
