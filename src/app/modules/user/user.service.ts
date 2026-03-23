import type { NextFunction } from "express";
// import { Role} from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import type {
  TCreateAdminPayload
} from "./user.interface";
import { AppError } from "../../errorHelplers/appError";
import status from "http-status";



const createAdmin = async (payload: TCreateAdminPayload) => {
  const { password, admin } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: { email: admin?.email },
  });

  if (isUserExist) {
    throw new Error(`User already exist as a ${isUserExist?.role}`);
  }

  // const createUser = await auth.api.signUpEmail({
  //   body: {
  //     name: admin?.name as string,
  //     email: admin?.email as string,
  //     password: password,
  //     needPasswordChanges: true,
  //     role: Role.ADMIN,
  //   },
  // });
  const createUser:any={}

  if (!createUser?.user?.id) {
    throw new Error("Failed to create admin as user into user model");
  }
  try {
    const result = await prisma.$transaction(async (tx:any) => {
      const createAdmin = await tx.admin.create({
        data: { userId: createUser?.user?.id as string, ...admin },
      });
      return await tx.admin.findUnique({
        where: { id: createAdmin?.id },
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
            },
          },
        },
      });
    });
    return result;
  } catch (error: any) {
    await prisma.user.delete({ where: { id: createUser?.user?.id } });
    return;
  }
};


export const userService = {  createAdmin };
