import status from "http-status";
import { Role, UserStatus } from "../../../generated/prisma/enums";
import { AppError } from "../../errorHelplers/appError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import type { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../../config/env";
import type { IJwtUserPayload } from "../../interfaces/token.interface";
import type { IUpdateAdminPayload, IUpdateMember, IUpdateProfilePayload, TChangePasswordPayload } from "./auth.interface";
import type { Request, Response } from "express";
import { cookieUtils } from "../../utils/cookie";
import  { deleteFileFromCloudinary } from "../../../config/cloude.config";

interface IRegisterMemberPayload {
  name: string;
  email: string;
  password: string;
}
interface ILoginUserPayload {
  email: string;
  password: string;
}

const register = async (payload: IRegisterMemberPayload) => {
  const { name, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      needPasswordChanges: true,
      role: Role.MEMBER,
      status:UserStatus.ACTIVE
    },
  });

  if (!data.user) {
    throw new Error("Failed to register member");
  }
  try {
    const memberTx = await prisma.$transaction(async (tx) => {
      return await tx.member.create({
        data: { name: name, email: email, userId: data?.user?.id },
      });
    });
    return { ...data?.user, ...memberTx };
  } catch (error: any) {
    await prisma.user.delete({ where: { id: data?.user?.id } });
    throw error;
  }
};

const loginUser = async (payload: ILoginUserPayload) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });
  console.log("login data",data)

  const { token, user } = data;
  const tokenPayload = {
    email: user?.email,
    role: user?.role,
    id: user?.id,
    status: user?.status,
    isDeleted: user?.isDeleted,
    name: user?.name,
  };
  const accessToken = await tokenUtils.generateAccessToken(
    tokenPayload as JwtPayload
  );
  const refreshToken = await tokenUtils.generateRefreshToken(
    tokenPayload as JwtPayload
  );

  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError(status.FORBIDDEN, "User is blocked");
  }

  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError(status.NOT_FOUND, "User is deleted");
  }

  return { data, accessToken, refreshToken, token };
};

const getProfile = async (user: JwtPayload) => {
  const findUser = await prisma.user.findFirst({
    where: { id: user?.id, isDeleted: false },
    include: {
  
      admin:true,
      member: true,
    },
  });
  if (!findUser) {
    throw new AppError(
      status.UNAUTHORIZED,
      "Unauthrozied Access. You are not athorized here"
    );
  }
  return findUser;
};


const updateProfile = async (payload: IUpdateProfilePayload, user: JwtPayload) => {
  // ১. User আছে কিনা check করো
  // console.log("payload here",payload);
  const existingUser = await prisma.user.findUnique({
    where: { id: user?.id, isDeleted: false },include:{admin:true,member:true}
  });

  if (!existingUser) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }
  console.log("authSerivce payload",payload);

  const result = await prisma.$transaction(async (tx) => {
    // ২. User table update করো
    const updatedUser = await tx.user.update({
      where: { id: user?.id },
      include: { admin: true, member: true },
      data: {
        ...(payload.name && { name: payload.name }),
        ...(payload.image && { image: payload.image }),
      },
    });

    // ৩. rolePayload — শুধু দেওয়া fields update হবে
    const rolePayload = {
      ...(payload.name && { name: payload.name }),
      ...(payload.image && { profilePhoto: payload.image }),          // ✅ payload.image দিয়ে profilePhoto
      ...(payload.contactNumber && { contactNumber: payload.contactNumber }),
    };

    // ৪. ADMIN হলে admin table upsert
    if (user?.role === Role.ADMIN) {
      await tx.admin.upsert({
        where: { userId: user?.id },
        update: rolePayload,                                           // ✅ শুধু দেওয়া fields update
        create: {
          userId: user?.id as string,
          name: payload.name ?? existingUser.name,                    // ✅ fallback
          email: existingUser.email,                                   // ✅ required field
          ...(payload.image && { profilePhoto: payload.image }),
          ...(payload.contactNumber && { contactNumber: payload.contactNumber }),
        },
      });
    }

    // ৫. MEMBER হলে member table upsert
    if (user?.role === Role.MEMBER) {
      await tx.member.upsert({
        where: { userId: user?.id as string },
        update: rolePayload,                                           // ✅ শুধু দেওয়া fields update
        create: {
          userId: user?.id as string,
          name: payload.name ?? existingUser.name,                    // ✅ fallback
          email: existingUser.email,                                   // ✅ required field
          ...(payload.image && { profilePhoto: payload.image }),
          ...(payload.contactNumber && { contactNumber: payload.contactNumber }),
        },
      });
    }

    return updatedUser;
  });

  return result;
};









const getNewToken = async (refreshToken: string, sessionToken: string) => {
  const verifyRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET
  );
  if (!verifyRefreshToken?.success) {
    throw new AppError(
      status.BAD_REQUEST,
      verifyRefreshToken?.message as string
    );
  }

  const user = verifyRefreshToken.data as JwtPayload;

  console.log("user", user);
  const accessTokenNew = await tokenUtils.generateAccessToken({
    email: user?.email,
    role: user?.role,
    id: user?.id,
    status: user?.status,
    isDeleted: user?.isDeleted,
    name: user?.name,
  });
  const refreshTokenNew = await tokenUtils.generateRefreshToken({
    email: user?.email,
    role: user?.role,
    id: user?.id,
    status: user?.status,
    isDeleted: user?.isDeleted,
    name: user?.name,
  });
  // console.log("accessTokenNew", accessTokenNew);

  const sessionExist = await prisma.session.findFirst({
    where: {
      token: sessionToken,
    },
    include: {
      user: true,
    },
  });
  console.log("sessionExist", sessionExist);

  if (!sessionExist) {
    throw new AppError(
      status.UNAUTHORIZED,
      "Unauthorized Access. You are not authenticate here"
    );
  }

  const sessionTokenExpirationUpdate = await prisma.session.update({
    where: { token: sessionToken },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000 * 24),
      updatedAt: new Date(),
    },
  });
  console.log("sessionTokenExpirationUpdate", sessionTokenExpirationUpdate);
  if (sessionTokenExpirationUpdate) {
    return {
      accessToken: accessTokenNew,
      refreshToken: refreshTokenNew,
      token: sessionToken,
    };
  }

  return null;
};

const changePassword = async (
  payload: TChangePasswordPayload,
  sessionToken: string
) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  if (!session) {
    throw new AppError(status.UNAUTHORIZED, "Invalid session token");
  }

  const data = await auth.api.changePassword({
    body: {
      newPassword: payload?.newPassword,
      currentPassword: payload?.currentPassword,
      revokeOtherSessions: true,
    },

    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  if (session.user.needPasswordChanges) {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        needPasswordChanges: false,
      },
    });
  }
  const tokenPayload = {
    email: data?.user?.email,
    role: data?.user?.role,
    id: data?.user?.id,
    status: data?.user?.status,
    isDeleted: data?.user?.isDeleted,
    name: data?.user?.name,
  };
  const accessToken = await tokenUtils.generateAccessToken(
    tokenPayload as JwtPayload
  );
  const refreshToken = await tokenUtils.generateRefreshToken(
    tokenPayload as JwtPayload
  );

  console.log("password data", data);
  return { data, accessToken, refreshToken, token: data?.token };
};

const logOut = async (res: Response, sessionToken: string) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  let accessTokenClear, refreshTokenClear, sessionTokenClear;
  if (result) {
    accessTokenClear = await cookieUtils.clearCookie(res, "accessToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    refreshTokenClear = await cookieUtils.clearCookie(res, "refreshToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    sessionTokenClear = await cookieUtils.clearCookie(
      res,
      "better-auth.session_token",
      {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      }
    );
  }

  if (accessTokenClear && refreshTokenClear && sessionTokenClear) {
    return result;
  }
  return null;
};

const verifyEmail = async (payload: { email: string; otp: string }) => {
  const isVerifiedUser = await prisma.user.findUnique({
    where: { email: payload?.email, emailVerified: true },
  });
  if (isVerifiedUser) {
    throw new Error("User is already verified");
  }
  const result = await auth.api.verifyEmailOTP({
    body: {
      email: payload?.email,
      otp: payload?.otp,
    },
  });

  if (result?.status && !result?.user?.emailVerified) {
    await prisma.user.update({
      where: { email: payload?.email },
      data: { emailVerified: true },
    });
  }

  console.log("emailVerified Result", result);
  return result;
};

const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(status.UNAUTHORIZED, "User not found");
  }
  if (!user?.emailVerified) {
    throw new AppError(status.BAD_REQUEST, "User Email not verified");
  }

  if (user.status !== UserStatus.ACTIVE || user.isDeleted) {
    throw new AppError(
      status.NOT_FOUND,
      "User is not eligible for password reset"
    );
  }

  const data = await auth.api.requestPasswordResetEmailOTP({
    body: { email },
  });

  return data;
};

const resetPassword = async (payload: {
  email: string;
  otp: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({
    where: { email: payload?.email },
  });

  if (!user) {
    throw new AppError(status.UNAUTHORIZED, "User not found");
  }
  if (!user?.emailVerified) {
    throw new AppError(status.BAD_REQUEST, "User Email not verified");
  }

  if (user.status !== UserStatus.ACTIVE || user.isDeleted) {
    throw new AppError(
      status.NOT_FOUND,
      "User is not eligible for password reset"
    );
  }

  const data = await auth.api.resetPasswordEmailOTP({
    body: {
      email: payload?.email,
      otp: payload?.otp,
      password: payload?.password,
    },
  });

  if (data) {
    await prisma.session.deleteMany({ where: { userId: user?.id } });
  }
  if (user?.needPasswordChanges) {
    await prisma.user.update({
      where: { id: user?.id },
      data: { needPasswordChanges: false },
    });
  }

  return data;
};

const googleSuccess = async (user: JwtPayload) => {
  console.log("user", user);
  const findPatient = await prisma.member.findUnique({
    where: { userId: user?.id },
  });
  let createPatient;
  // if (!findPatient?.id) {
  //    createPatient = await prisma.member.create({
  //     data: { name: user?.name, email: user?.email, userId: user?.id },
  //   });
  // }

  if (user?.id) {
    const accessToken = await tokenUtils.generateAccessToken(
      user as JwtPayload
    );
    const refreshToken = await tokenUtils.generateRefreshToken(
      user as JwtPayload
    );
    return { accessToken, refreshToken };
  }

  return null;
};

export const deleteAuthFile=async(filePath:string,user:JwtPayload)=>{
// const { filePath } = req.body;
const result=await deleteFileFromCloudinary(filePath);
let userUpdate,adminUpdate,memberUpdate
if(result){
  userUpdate= await prisma.user.update({
    where:{id:user?.id},
    data:{image:null}
  })
  if(user?.role === "ADMIN"){
      adminUpdate= await prisma.admin.update({
    where:{userId:user?.id},
    data:{profilePhoto:null}
  })
  }
  if(user?.role === "MEMBER"){
      memberUpdate= await prisma.member.update({
    where:{userId:user?.id},
    data:{profilePhoto:null}
  })
  }
}

return {data:{...result,user:userUpdate,admin:adminUpdate,member:memberUpdate}};
} 




export const AuthService = {
  register,
  loginUser,
  getProfile,
  getNewToken,
  changePassword,
  logOut,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  googleSuccess,
  updateProfile,
  deleteAuthFile
};
