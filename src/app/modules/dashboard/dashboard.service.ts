import { prisma } from "../../lib/prisma";
import { IdeaStatus, UserStatus, Role } from "../../../generated/prisma/enums";
import type { JwtPayload } from "jsonwebtoken";

// ✅ Admin Dashboard Stats
const getAdminStats = async () => {
  const [
    totalUsers,
    totalIdeas,
    totalVotes,
    totalComments,
    totalPayments,
    pendingIdeas,
    approvedIdeas,
    rejectedIdeas,
    underReviewIdeas,
  ] = await Promise.all([
    prisma.user.count({ where: { isDeleted: false } }),
    prisma.idea.count({ where: { isDeleted: false } }),
    prisma.vote.count(),
    prisma.comment.count({ where: { isDeleted: false } }),
    prisma.payment.count(),
    prisma.idea.count({ where: { status: IdeaStatus.PENDING, isDeleted: false } }),
    prisma.idea.count({ where: { status: IdeaStatus.APPROVED, isDeleted: false } }),
    prisma.idea.count({ where: { status: IdeaStatus.REJECTED, isDeleted: false } }),
    prisma.idea.count({ where: { status: IdeaStatus.UNDER_REVIEW, isDeleted: false } }),
  ]);

  return {
    totalUsers,
    totalIdeas,
    totalVotes,
    totalComments,
    totalPayments,
    ideaStats: {
      pending: pendingIdeas,
      approved: approvedIdeas,
      rejected: rejectedIdeas,
      underReview: underReviewIdeas,
    },
  };
};

// ✅ Member Dashboard Stats
const getMemberStats = async (user: JwtPayload) => {
  const [
    totalIdeas,
    draftIdeas,
    approvedIdeas,
    rejectedIdeas,
    underReviewIdeas,
    totalVotes,
    totalComments,
    totalPayments,
  ] = await Promise.all([
    prisma.idea.count({ where: { authorId: user?.id, isDeleted: false } }),
    prisma.idea.count({ where: { authorId: user?.id, status: IdeaStatus.DRAFT, isDeleted: false } }),
    prisma.idea.count({ where: { authorId: user?.id, status: IdeaStatus.APPROVED, isDeleted: false } }),
    prisma.idea.count({ where: { authorId: user?.id, status: IdeaStatus.REJECTED, isDeleted: false } }),
    prisma.idea.count({ where: { authorId: user?.id, status: IdeaStatus.UNDER_REVIEW, isDeleted: false } }),
    prisma.vote.count({ where: { userId: user?.id } }),
    prisma.comment.count({ where: { authorId: user?.id, isDeleted: false } }),
    prisma.payment.count({ where: { userId: user?.id } }),
  ]);

  return {
    totalIdeas,
    totalVotes,
    totalComments,
    totalPayments,
    ideaStats: {
      draft: draftIdeas,
      approved: approvedIdeas,
      rejected: rejectedIdeas,
      underReview: underReviewIdeas,
    },
  };
};

// ✅ Admin — All Users
const getAllUsers = async (query: any) => {
  const { page = 1, limit = 10, search, status, role } = query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {
  
    ...(status && { status }),
    ...(role && { role }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        _count: {
          select: { ideas: true, votes: true, comments: true },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: users,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

// ✅ Admin — User Status Update (activate/deactivate)
const updateUserStatus = async (userId: string, status: UserStatus) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isDeleted: false },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { status },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return updated;
};

// ✅ Admin — User Role Update
const updateUserRole = async (userId: string, role: Role) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isDeleted: false },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return updated;
};

// ✅ Admin — Delete User
const deleteUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isDeleted: false },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const deleted = await prisma.user.update({
    where: { id: userId },
    data: { isDeleted: true,status:UserStatus.DELETED, deletedAt: new Date() },
  });

  return deleted;
};

export const dashboardService = {
  getAdminStats,
  getMemberStats,
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
};