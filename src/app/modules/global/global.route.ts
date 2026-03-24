import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import  { deleteFile } from "./global.controller";


const router = Router();




router.post(
  "/",
  checkAuth(Role.MEMBER, Role.ADMIN),
  deleteFile
);

export const globalRoutes=router