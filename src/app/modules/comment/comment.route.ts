import { Router } from "express";
import { commentController } from "./comment.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validationRequest } from "../../middleware/validationRequest";
import { commentValidationSchema } from "./comment.validation";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/:ideaId", commentController.getCommentsByIdea);

router.post(
  "/:ideaId",
  checkAuth(Role.MEMBER, Role.ADMIN),
  validationRequest(commentValidationSchema.createCommentSchema),
  commentController.createComment
);

// ✅ Member/Admin — delete
router.delete(
  "/:id",
  checkAuth(Role.MEMBER, Role.ADMIN),
  commentController.deleteComment
);

export const commentRoutes = router;