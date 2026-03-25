import { Router } from "express";
import { voteController } from "./vote.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { validationRequest } from "../../middleware/validationRequest";
import { voteValidationSchema } from "./vote.validation";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// ✅ Public — vote count দেখা
router.get("/:ideaId", voteController.getVoteCount);

// ✅ Member — vote দেওয়া
router.post(
  "/:ideaId",
  checkAuth(Role.MEMBER, Role.ADMIN),
  validationRequest(voteValidationSchema.voteSchema),
  voteController.voteIdea
);

// ✅ Member — vote remove
router.delete(
  "/:ideaId",
  checkAuth(Role.MEMBER, Role.ADMIN),
  voteController.removeVote
);

export const voteRoutes = router;