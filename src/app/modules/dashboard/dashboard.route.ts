import { Router } from "express";
import { dashboardController } from "./dashboard.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// ✅ Admin Dashboard
router.get(
  "/admin/stats",
  checkAuth(Role.ADMIN),
  dashboardController.getAdminStats
);

router.get(
  "/admin/users",
  checkAuth(Role.ADMIN),
  dashboardController.getAllUsers
);

router.patch(
  "/admin/users/:userId/status",
  checkAuth(Role.ADMIN),
  dashboardController.updateUserStatus
);

router.patch(
  "/admin/users/:userId/role",
  checkAuth(Role.ADMIN),
  dashboardController.updateUserRole
);

router.delete(
  "/admin/users/:userId",
  checkAuth(Role.ADMIN),
  dashboardController.deleteUser
);

// ✅ Member Dashboard
router.get(
  "/member/stats",
  checkAuth(Role.MEMBER, Role.ADMIN),
  dashboardController.getMemberStats
);

export const dashboardRoutes = router;