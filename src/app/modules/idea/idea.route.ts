import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validationRequest } from "../../middleware/validationRequest";
import { ideaValidationSchema } from "./idea.validation";
import { ideaUploadMiddleware } from "./idea.middleware";
import { multerUpload } from "../../../config/multer.config";
import { Role } from "../../../generated/prisma/enums";
import { ideaController } from "./idea.controller";

const router = Router();

// ✅ Public
router.get("/", ideaController.getAllIdeas);

// ✅ Member
router.post(
  "/",
  checkAuth(Role.MEMBER, Role.ADMIN),
  multerUpload.fields([{ name: "images", maxCount: 5 }]),
  ideaUploadMiddleware,
  validationRequest(ideaValidationSchema.createIdeaSchema),
  ideaController.createIdea
);

router.patch(
  "/:id",
  checkAuth(Role.MEMBER, Role.ADMIN),
  multerUpload.fields([{ name: "images", maxCount: 5 }]),
  ideaUploadMiddleware,
  validationRequest(ideaValidationSchema.updateIdeaSchema),
  ideaController.updateIdea
);

router.delete(
  "/:id",
  checkAuth(Role.MEMBER, Role.ADMIN),
  ideaController.deleteIdea
);

router.patch(
  "/:id/submit",
  checkAuth(Role.MEMBER),
  ideaController.submitIdea
);

// ✅ Member Dashboard
router.get(
  "/roleWise",
  checkAuth(Role.MEMBER, Role.ADMIN),
  ideaController.getMyIdeas
);

// ✅ Admin
router.get(
  "/admin",
  checkAuth(Role.ADMIN),
  ideaController.getAllIdeasAdmin
);

router.patch(
  "/:id/approve",
  checkAuth(Role.ADMIN),
  ideaController.approveIdea
);

router.patch(
  "/:id/reject",
  checkAuth(Role.ADMIN),
  validationRequest(ideaValidationSchema.rejectIdeaSchema),
  ideaController.rejectIdea
);
router.patch(
  "/:id/under-review",
  checkAuth(Role.ADMIN),
  ideaController.moveToUnderReview
);
router.get("/:id",checkAuth(Role.MEMBER, Role.ADMIN), ideaController.getIdeaById);

export const ideaRoutes = router;