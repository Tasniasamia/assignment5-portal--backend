var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express2 from "express";
import cors from "cors";

// src/app/routes/index.ts
import { Router as Router10 } from "express";

// src/app/modules/auth/auth.route.ts
import { Router } from "express";

// src/app/shared/catchAsyncHandler.ts
var catchAsyncHandler = (functionHandler) => {
  return async (req, res, next) => {
    try {
      await functionHandler(req, res, next);
    } catch (error) {
      console.log("error", error);
      next(error);
    }
  };
};

// src/app/modules/auth/auth.service.ts
import status2 from "http-status";

// src/generated/prisma/enums.ts
var Role = {
  ADMIN: "ADMIN",
  MEMBER: "MEMBER"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED"
};
var VoteType = {
  UPVOTE: "UPVOTE",
  DOWNVOTE: "DOWNVOTE"
};
var PaymentStatus = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  PENDING: "PENDING"
};
var IdeaStatus = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  UNDER_REVIEW: "UNDER_REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
};
var IdeaType = {
  FREE: "FREE",
  PAID: "PAID"
};

// src/app/errorHelplers/appError.ts
var AppError = class extends Error {
  statusCode = 500;
  constructor(statusCode, message, stack) {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};

// src/app/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/app/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import "process";
import * as path from "path";
import { fileURLToPath } from "url";
import "@prisma/client/runtime/client";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.6.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": 'model admin {\n  id            String    @id @default(uuid())\n  userId        String    @unique\n  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  name          String\n  email         String\n  profilePhoto  String?\n  contactNumber String?\n  isDeleted     Boolean   @default(false)\n  deletedAt     DateTime?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n\n  @@index([email], name: "admin_email")\n  @@index([isDeleted], name: "admin_isDeleted")\n  @@map("admin")\n}\n\nmodel Category {\n  id          String    @id @default(uuid())\n  name        String    @unique\n  description String?\n  isDeleted   Boolean   @default(false)\n  deletedAt   DateTime?\n  createdAt   DateTime  @default(now())\n  updatedAt   DateTime  @updatedAt\n\n  // \u2705 \u09A8\u09A4\u09C1\u09A8 relation\n  ideas Idea[]\n\n  @@index([name], name: "category_name")\n  @@map("category")\n}\n\nmodel Comment {\n  id        String    @id @default(uuid())\n  content   String\n  ideaId    String\n  idea      Idea      @relation(fields: [ideaId], references: [id], onDelete: Cascade)\n  authorId  String\n  author    User      @relation(fields: [authorId], references: [id], onDelete: Cascade)\n  parentId  String? // Nested comment \u098F\u09B0 \u099C\u09A8\u09CD\u09AF\n  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id])\n  replies   Comment[] @relation("CommentReplies")\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n\n  @@index([ideaId], name: "comment_ideaId")\n  @@index([parentId], name: "comment_parentId")\n  @@map("comment")\n}\n\nenum Role {\n  ADMIN\n  MEMBER\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum Gender {\n  FEMALE\n  MALE\n  OTHER\n}\n\nenum VoteType {\n  UPVOTE\n  DOWNVOTE\n}\n\nenum PaymentStatus {\n  SUCCESS\n  FAILED\n  PENDING\n}\n\nenum IdeaStatus {\n  DRAFT\n  PENDING\n  UNDER_REVIEW\n  APPROVED\n  REJECTED\n}\n\nenum IdeaType {\n  FREE\n  PAID\n}\n\nmodel Idea {\n  id                String     @id @default(uuid())\n  title             String\n  problemStatement  String\n  proposedSolution  String\n  description       String\n  images            String[]\n  status            IdeaStatus @default(DRAFT)\n  type              IdeaType   @default(FREE)\n  price             Float?\n  rejectionFeedback String?\n  isPaid            Boolean    @default(false)\n  viewCount         Int        @default(0)\n  isDeleted         Boolean    @default(false)\n  deletedAt         DateTime?\n  createdAt         DateTime   @default(now())\n  updatedAt         DateTime   @updatedAt\n  isPublished       Boolean    @default(false)\n  authorId          String\n  author            User       @relation(fields: [authorId], references: [id], onDelete: Cascade)\n\n  categoryId String\n  category   Category @relation(fields: [categoryId], references: [id])\n\n  votes    Vote[]\n  comments Comment[]\n  payments Payment[]\n\n  @@index([status], name: "idea_status")\n  @@index([authorId], name: "idea_authorId")\n  @@index([categoryId], name: "idea_categoryId")\n  @@map("idea")\n}\n\nmodel member {\n  id            String    @id @default(uuid())\n  userId        String    @unique\n  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  name          String\n  email         String\n  profilePhoto  String?\n  contactNumber String?\n  isDeleted     Boolean   @default(false)\n  deletedAt     DateTime?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n\n  @@index([email], name: "member_email")\n  @@index([isDeleted], name: "member_isDeleted")\n  @@map("member")\n}\n\nmodel OtpLog {\n  id        String   @id @default(cuid())\n  email     String\n  createdAt DateTime @default(now())\n}\n\nmodel Payment {\n  id                 String        @id @default(uuid())\n  amount             Float\n  status             PaymentStatus\n  transactionId      String?       @unique\n  stripeEventId      String?       @unique\n  invoiceUrl         String?\n  paymentGatewayData Json?\n  ideaId             String\n  idea               Idea          @relation(fields: [ideaId], references: [id], onDelete: Cascade)\n  userId             String\n  user               User          @relation(fields: [userId], references: [id], onDelete: Cascade)\n  createdAt          DateTime      @default(now())\n  updatedAt          DateTime      @updatedAt\n\n  @@unique([ideaId, userId])\n  @@index([userId], name: "payment_userId")\n  @@map("payment")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id                  String     @id\n  name                String\n  email               String\n  emailVerified       Boolean    @default(false)\n  image               String?\n  role                Role       @default(MEMBER)\n  status              UserStatus @default(ACTIVE)\n  needPasswordChanges Boolean    @default(false)\n  isDeleted           Boolean    @default(false)\n  deletedAt           DateTime?\n  createdAt           DateTime   @default(now())\n  updatedAt           DateTime   @updatedAt\n\n  sessions Session[]\n  accounts Account[]\n  member   member?\n  admin    admin?\n\n  // \u2705 \u09A8\u09A4\u09C1\u09A8 relations\n  ideas    Idea[]\n  votes    Vote[]\n  comments Comment[]\n  payments Payment[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Vote {\n  id        String   @id @default(uuid())\n  type      VoteType\n  ideaId    String\n  idea      Idea     @relation(fields: [ideaId], references: [id], onDelete: Cascade)\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([ideaId, userId]) // \u098F\u0995\u099C\u09A8 user \u098F\u0995\u099F\u09BE idea \u09A4\u09C7 \u098F\u0995\u09AC\u09BE\u09B0\u0987 vote \u09A6\u09BF\u09A4\u09C7 \u09AA\u09BE\u09B0\u09AC\u09C7\n  @@index([ideaId], name: "vote_ideaId")\n  @@map("vote")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"admin":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToadmin"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"admin"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ideas","kind":"object","type":"Idea","relationName":"CategoryToIdea"}],"dbName":"category"},"Comment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"ideaId","kind":"scalar","type":"String"},{"name":"idea","kind":"object","type":"Idea","relationName":"CommentToIdea"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"author","kind":"object","type":"User","relationName":"CommentToUser"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"parent","kind":"object","type":"Comment","relationName":"CommentReplies"},{"name":"replies","kind":"object","type":"Comment","relationName":"CommentReplies"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"comment"},"Idea":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"problemStatement","kind":"scalar","type":"String"},{"name":"proposedSolution","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"images","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"IdeaStatus"},{"name":"type","kind":"enum","type":"IdeaType"},{"name":"price","kind":"scalar","type":"Float"},{"name":"rejectionFeedback","kind":"scalar","type":"String"},{"name":"isPaid","kind":"scalar","type":"Boolean"},{"name":"viewCount","kind":"scalar","type":"Int"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"isPublished","kind":"scalar","type":"Boolean"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"author","kind":"object","type":"User","relationName":"IdeaToUser"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToIdea"},{"name":"votes","kind":"object","type":"Vote","relationName":"IdeaToVote"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToIdea"},{"name":"payments","kind":"object","type":"Payment","relationName":"IdeaToPayment"}],"dbName":"idea"},"member":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserTomember"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"member"},"OtpLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"stripeEventId","kind":"scalar","type":"String"},{"name":"invoiceUrl","kind":"scalar","type":"String"},{"name":"paymentGatewayData","kind":"scalar","type":"Json"},{"name":"ideaId","kind":"scalar","type":"String"},{"name":"idea","kind":"object","type":"Idea","relationName":"IdeaToPayment"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"payment"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChanges","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"member","kind":"object","type":"member","relationName":"UserTomember"},{"name":"admin","kind":"object","type":"admin","relationName":"UserToadmin"},{"name":"ideas","kind":"object","type":"Idea","relationName":"IdeaToUser"},{"name":"votes","kind":"object","type":"Vote","relationName":"UserToVote"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToUser"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Vote":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"VoteType"},{"name":"ideaId","kind":"scalar","type":"String"},{"name":"idea","kind":"object","type":"Idea","relationName":"IdeaToVote"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToVote"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"vote"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","member","admin","author","ideas","_count","category","idea","votes","parent","replies","comments","payments","admin.findUnique","admin.findUniqueOrThrow","admin.findFirst","admin.findFirstOrThrow","admin.findMany","data","admin.createOne","admin.createMany","admin.createManyAndReturn","admin.updateOne","admin.updateMany","admin.updateManyAndReturn","create","update","admin.upsertOne","admin.deleteOne","admin.deleteMany","having","_min","_max","admin.groupBy","admin.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Comment.findUnique","Comment.findUniqueOrThrow","Comment.findFirst","Comment.findFirstOrThrow","Comment.findMany","Comment.createOne","Comment.createMany","Comment.createManyAndReturn","Comment.updateOne","Comment.updateMany","Comment.updateManyAndReturn","Comment.upsertOne","Comment.deleteOne","Comment.deleteMany","Comment.groupBy","Comment.aggregate","Idea.findUnique","Idea.findUniqueOrThrow","Idea.findFirst","Idea.findFirstOrThrow","Idea.findMany","Idea.createOne","Idea.createMany","Idea.createManyAndReturn","Idea.updateOne","Idea.updateMany","Idea.updateManyAndReturn","Idea.upsertOne","Idea.deleteOne","Idea.deleteMany","_avg","_sum","Idea.groupBy","Idea.aggregate","member.findUnique","member.findUniqueOrThrow","member.findFirst","member.findFirstOrThrow","member.findMany","member.createOne","member.createMany","member.createManyAndReturn","member.updateOne","member.updateMany","member.updateManyAndReturn","member.upsertOne","member.deleteOne","member.deleteMany","member.groupBy","member.aggregate","OtpLog.findUnique","OtpLog.findUniqueOrThrow","OtpLog.findFirst","OtpLog.findFirstOrThrow","OtpLog.findMany","OtpLog.createOne","OtpLog.createMany","OtpLog.createManyAndReturn","OtpLog.updateOne","OtpLog.updateMany","OtpLog.updateManyAndReturn","OtpLog.upsertOne","OtpLog.deleteOne","OtpLog.deleteMany","OtpLog.groupBy","OtpLog.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Vote.findUnique","Vote.findUniqueOrThrow","Vote.findFirst","Vote.findFirstOrThrow","Vote.findMany","Vote.createOne","Vote.createMany","Vote.createManyAndReturn","Vote.updateOne","Vote.updateMany","Vote.updateManyAndReturn","Vote.upsertOne","Vote.deleteOne","Vote.deleteMany","Vote.groupBy","Vote.aggregate","AND","OR","NOT","id","VoteType","type","ideaId","userId","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","name","email","emailVerified","image","Role","role","UserStatus","status","needPasswordChanges","isDeleted","deletedAt","every","some","none","amount","PaymentStatus","transactionId","stripeEventId","invoiceUrl","paymentGatewayData","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","profilePhoto","contactNumber","title","problemStatement","proposedSolution","description","images","IdeaStatus","IdeaType","price","rejectionFeedback","isPaid","viewCount","isPublished","authorId","categoryId","has","hasEvery","hasSome","content","parentId","ideaId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide","push"]'),
  graph: "7gVpwAEOAwAAhQMAINoBAACoAwAw2wEAAA0AENwBAACoAwAw3QEBAAAAAeEBAQAAAAHiAUAA1gIAIeMBQADWAgAh_gEBANUCACH_AQEA1QIAIYcCIADrAgAhiAJAAO8CACGYAgEA7AIAIZkCAQDsAgAhAQAAAAEAIAwDAACFAwAg2gEAAKoDADDbAQAAAwAQ3AEAAKoDADDdAQEA1QIAIeEBAQDVAgAh4gFAANYCACHjAUAA1gIAIfEBQADWAgAh-wEBANUCACH8AQEA7AIAIf0BAQDsAgAhAwMAAIIFACD8AQAAuAMAIP0BAAC4AwAgDAMAAIUDACDaAQAAqgMAMNsBAAADABDcAQAAqgMAMN0BAQAAAAHhAQEA1QIAIeIBQADWAgAh4wFAANYCACHxAUAA1gIAIfsBAQAAAAH8AQEA7AIAIf0BAQDsAgAhAwAAAAMAIAEAAAQAMAIAAAUAIBEDAACFAwAg2gEAAKkDADDbAQAABwAQ3AEAAKkDADDdAQEA1QIAIeEBAQDVAgAh4gFAANYCACHjAUAA1gIAIfIBAQDVAgAh8wEBANUCACH0AQEA7AIAIfUBAQDsAgAh9gEBAOwCACH3AUAA7wIAIfgBQADvAgAh-QEBAOwCACH6AQEA7AIAIQgDAACCBQAg9AEAALgDACD1AQAAuAMAIPYBAAC4AwAg9wEAALgDACD4AQAAuAMAIPkBAAC4AwAg-gEAALgDACARAwAAhQMAINoBAACpAwAw2wEAAAcAENwBAACpAwAw3QEBAAAAAeEBAQDVAgAh4gFAANYCACHjAUAA1gIAIfIBAQDVAgAh8wEBANUCACH0AQEA7AIAIfUBAQDsAgAh9gEBAOwCACH3AUAA7wIAIfgBQADvAgAh-QEBAOwCACH6AQEA7AIAIQMAAAAHACABAAAIADACAAAJACAOAwAAhQMAINoBAACEAwAw2wEAAAsAENwBAACEAwAw3QEBANUCACHhAQEA1QIAIeIBQADWAgAh4wFAANYCACH-AQEA1QIAIf8BAQDVAgAhhwIgAOsCACGIAkAA7wIAIZgCAQDsAgAhmQIBAOwCACEBAAAACwAgDgMAAIUDACDaAQAAqAMAMNsBAAANABDcAQAAqAMAMN0BAQDVAgAh4QEBANUCACHiAUAA1gIAIeMBQADWAgAh_gEBANUCACH_AQEA1QIAIYcCIADrAgAhiAJAAO8CACGYAgEA7AIAIZkCAQDsAgAhAQAAAA0AIBsIAACFAwAgCwAApwMAIA0AAPUCACAQAAD2AgAgEQAA9wIAINoBAACiAwAw2wEAAA8AENwBAACiAwAw3QEBANUCACHfAQAApAOhAiLiAUAA1gIAIeMBQADWAgAhhQIAAKMDoAIihwIgAOsCACGIAkAA7wIAIZoCAQDVAgAhmwIBANUCACGcAgEA1QIAIZ0CAQDVAgAhngIAAIcDACChAggApQMAIaICAQDsAgAhowIgAOsCACGkAgIApgMAIaUCIADrAgAhpgIBANUCACGnAgEA1QIAIQgIAACCBQAgCwAAogUAIA0AAPIEACAQAADzBAAgEQAA9AQAIIgCAAC4AwAgoQIAALgDACCiAgAAuAMAIBsIAACFAwAgCwAApwMAIA0AAPUCACAQAAD2AgAgEQAA9wIAINoBAACiAwAw2wEAAA8AENwBAACiAwAw3QEBAAAAAd8BAACkA6ECIuIBQADWAgAh4wFAANYCACGFAgAAowOgAiKHAiAA6wIAIYgCQADvAgAhmgIBANUCACGbAgEA1QIAIZwCAQDVAgAhnQIBANUCACGeAgAAhwMAIKECCAClAwAhogIBAOwCACGjAiAA6wIAIaQCAgCmAwAhpQIgAOsCACGmAgEA1QIAIacCAQDVAgAhAwAAAA8AIAEAABAAMAIAABEAIAMAAAAPACABAAAQADACAAARACABAAAADwAgCwMAAIUDACAMAACcAwAg2gEAAKADADDbAQAAFQAQ3AEAAKADADDdAQEA1QIAId8BAAChA98BIuABAQDVAgAh4QEBANUCACHiAUAA1gIAIeMBQADWAgAhAgMAAIIFACAMAACgBQAgDAMAAIUDACAMAACcAwAg2gEAAKADADDbAQAAFQAQ3AEAAKADADDdAQEAAAAB3wEAAKED3wEi4AEBANUCACHhAQEA1QIAIeIBQADWAgAh4wFAANYCACGtAgAAnwMAIAMAAAAVACABAAAWADACAAAXACAQCAAAhQMAIAwAAJwDACAOAACeAwAgDwAA9gIAINoBAACdAwAw2wEAABkAENwBAACdAwAw3QEBANUCACHgAQEA1QIAIeIBQADWAgAh4wFAANYCACGHAiAA6wIAIYgCQADvAgAhpgIBANUCACGrAgEA1QIAIawCAQDsAgAhBggAAIIFACAMAACgBQAgDgAAoQUAIA8AAPMEACCIAgAAuAMAIKwCAAC4AwAgEAgAAIUDACAMAACcAwAgDgAAngMAIA8AAPYCACDaAQAAnQMAMNsBAAAZABDcAQAAnQMAMN0BAQAAAAHgAQEA1QIAIeIBQADWAgAh4wFAANYCACGHAiAA6wIAIYgCQADvAgAhpgIBANUCACGrAgEA1QIAIawCAQDsAgAhAwAAABkAIAEAABoAMAIAABsAIAEAAAAZACADAAAAGQAgAQAAGgAwAgAAGwAgAQAAABkAIBADAACFAwAgDAAAnAMAINoBAACYAwAw2wEAACAAENwBAACYAwAw3QEBANUCACHgAQEA1QIAIeEBAQDVAgAh4gFAANYCACHjAUAA1gIAIYUCAACaA44CIowCCACZAwAhjgIBAOwCACGPAgEA7AIAIZACAQDsAgAhkQIAAJsDACAGAwAAggUAIAwAAKAFACCOAgAAuAMAII8CAAC4AwAgkAIAALgDACCRAgAAuAMAIBEDAACFAwAgDAAAnAMAINoBAACYAwAw2wEAACAAENwBAACYAwAw3QEBAAAAAeABAQDVAgAh4QEBANUCACHiAUAA1gIAIeMBQADWAgAhhQIAAJoDjgIijAIIAJkDACGOAgEAAAABjwIBAAAAAZACAQDsAgAhkQIAAJsDACCtAgAAlwMAIAMAAAAgACABAAAhADACAAAiACABAAAAFQAgAQAAABkAIAEAAAAgACADAAAAFQAgAQAAFgAwAgAAFwAgAwAAABkAIAEAABoAMAIAABsAIAMAAAAgACABAAAhADACAAAiACABAAAAAwAgAQAAAAcAIAEAAAAPACABAAAAFQAgAQAAABkAIAEAAAAgACABAAAAAQAgBAMAAIIFACCIAgAAuAMAIJgCAAC4AwAgmQIAALgDACADAAAADQAgAQAAMQAwAgAAAQAgAwAAAA0AIAEAADEAMAIAAAEAIAMAAAANACABAAAxADACAAABACALAwAAnwUAIN0BAQAAAAHhAQEAAAAB4gFAAAAAAeMBQAAAAAH-AQEAAAAB_wEBAAAAAYcCIAAAAAGIAkAAAAABmAIBAAAAAZkCAQAAAAEBFwAANQAgCt0BAQAAAAHhAQEAAAAB4gFAAAAAAeMBQAAAAAH-AQEAAAAB_wEBAAAAAYcCIAAAAAGIAkAAAAABmAIBAAAAAZkCAQAAAAEBFwAANwAwARcAADcAMAsDAACeBQAg3QEBAK4DACHhAQEArgMAIeIBQACwAwAh4wFAALADACH-AQEArgMAIf8BAQCuAwAhhwIgAMgDACGIAkAAvQMAIZgCAQC8AwAhmQIBALwDACECAAAAAQAgFwAAOgAgCt0BAQCuAwAh4QEBAK4DACHiAUAAsAMAIeMBQACwAwAh_gEBAK4DACH_AQEArgMAIYcCIADIAwAhiAJAAL0DACGYAgEAvAMAIZkCAQC8AwAhAgAAAA0AIBcAADwAIAIAAAANACAXAAA8ACADAAAAAQAgHgAANQAgHwAAOgAgAQAAAAEAIAEAAAANACAGCgAAmwUAICQAAJ0FACAlAACcBQAgiAIAALgDACCYAgAAuAMAIJkCAAC4AwAgDdoBAACWAwAw2wEAAEMAENwBAACWAwAw3QEBAMkCACHhAQEAyQIAIeIBQADLAgAh4wFAAMsCACH-AQEAyQIAIf8BAQDJAgAhhwIgAOECACGIAkAA2QIAIZgCAQDYAgAhmQIBANgCACEDAAAADQAgAQAAQgAwIwAAQwAgAwAAAA0AIAEAADEAMAIAAAEAIAsJAAD0AgAg2gEAAJUDADDbAQAASQAQ3AEAAJUDADDdAQEAAAAB4gFAANYCACHjAUAA1gIAIf4BAQAAAAGHAiAA6wIAIYgCQADvAgAhnQIBAOwCACEBAAAARgAgAQAAAEYAIAsJAAD0AgAg2gEAAJUDADDbAQAASQAQ3AEAAJUDADDdAQEA1QIAIeIBQADWAgAh4wFAANYCACH-AQEA1QIAIYcCIADrAgAhiAJAAO8CACGdAgEA7AIAIQMJAADxBAAgiAIAALgDACCdAgAAuAMAIAMAAABJACABAABKADACAABGACADAAAASQAgAQAASgAwAgAARgAgAwAAAEkAIAEAAEoAMAIAAEYAIAgJAACaBQAg3QEBAAAAAeIBQAAAAAHjAUAAAAAB_gEBAAAAAYcCIAAAAAGIAkAAAAABnQIBAAAAAQEXAABOACAH3QEBAAAAAeIBQAAAAAHjAUAAAAAB_gEBAAAAAYcCIAAAAAGIAkAAAAABnQIBAAAAAQEXAABQADABFwAAUAAwCAkAAJAFACDdAQEArgMAIeIBQACwAwAh4wFAALADACH-AQEArgMAIYcCIADIAwAhiAJAAL0DACGdAgEAvAMAIQIAAABGACAXAABTACAH3QEBAK4DACHiAUAAsAMAIeMBQACwAwAh_gEBAK4DACGHAiAAyAMAIYgCQAC9AwAhnQIBALwDACECAAAASQAgFwAAVQAgAgAAAEkAIBcAAFUAIAMAAABGACAeAABOACAfAABTACABAAAARgAgAQAAAEkAIAUKAACNBQAgJAAAjwUAICUAAI4FACCIAgAAuAMAIJ0CAAC4AwAgCtoBAACUAwAw2wEAAFwAENwBAACUAwAw3QEBAMkCACHiAUAAywIAIeMBQADLAgAh_gEBAMkCACGHAiAA4QIAIYgCQADZAgAhnQIBANgCACEDAAAASQAgAQAAWwAwIwAAXAAgAwAAAEkAIAEAAEoAMAIAAEYAIAEAAAAbACABAAAAGwAgAwAAABkAIAEAABoAMAIAABsAIAMAAAAZACABAAAaADACAAAbACADAAAAGQAgAQAAGgAwAgAAGwAgDQgAAPwDACAMAAD7AwAgDgAA_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_wEBANUCACGHAiAA6wIAIYgCQADvAgAhmAIBAOwCACGZAgEA7AIAIQEAAACNAQAgAQAAAI0BACAEAwAAggUAIIgCAAC4AwAgmAIAALgDACCZAgAAuAMAIAMAAAALACABAACQAQAwAgAAjQEAIAMAAAALACABAACQAQAwAgAAjQEAIAMAAAALACABAACQAQAwAgAAjQEAIAsDAACBBQAg3QEBAAAAAeEBAQAAAAHiAUAAAAAB4wFAAAAAAf4BAQAAAAH_AQEAAAABhwIgAAAAAYgCQAAAAAGYAgEAAAABmQIBAAAAAQEXAACUAQAgCt0BAQAAAAHhAQEAAAAB4gFAAAAAAeMBQAAAAAH-AQEAAAAB_wEBAAAAAYcCIAAAAAGIAkAAAAABmAIBAAAAAZkCAQAAAAEBFwAAlgEAMAEXAACWAQAwCwMAAIAFACDdAQEArgMAIeEBAQCuAwAh4gFAALADACHjAUAAsAMAIf4BAQCuAwAh_wEBAK4DACGHAiAAyAMAIYgCQAC9AwAhmAIBALwDACGZAgEAvAMAIQIAAACNAQAgFwAAmQEAIArdAQEArgMAIeEBAQCuAwAh4gFAALADACHjAUAAsAMAIf4BAQCuAwAh_wEBAK4DACGHAiAAyAMAIYgCQAC9AwAhmAIBALwDACGZAgEAvAMAIQIAAAALACAXAACbAQAgAgAAAAsAIBcAAJsBACADAAAAjQEAIB4AAJQBACAfAACZAQAgAQAAAI0BACABAAAACwAgBgoAAP0EACAkAAD_BAAgJQAA_gQAIIgCAAC4AwAgmAIAALgDACCZAgAAuAMAIA3aAQAAgwMAMNsBAACiAQAQ3AEAAIMDADDdAQEAyQIAIeEBAQDJAgAh4gFAAMsCACHjAUAAywIAIf4BAQDJAgAh_wEBAMkCACGHAiAA4QIAIYgCQADZAgAhmAIBANgCACGZAgEA2AIAIQMAAAALACABAAChAQAwIwAAogEAIAMAAAALACABAACQAQAwAgAAjQEAIAbaAQAAggMAMNsBAACoAQAQ3AEAAIIDADDdAQEAAAAB4gFAANYCACH_AQEA1QIAIQEAAAClAQAgAQAAAKUBACAG2gEAAIIDADDbAQAAqAEAENwBAACCAwAw3QEBANUCACHiAUAA1gIAIf8BAQDVAgAhAAMAAACoAQAgAQAAqQEAMAIAAKUBACADAAAAqAEAIAEAAKkBADACAAClAQAgAwAAAKgBACABAACpAQAwAgAApQEAIAPdAQEAAAAB4gFAAAAAAf8BAQAAAAEBFwAArQEAIAPdAQEAAAAB4gFAAAAAAf8BAQAAAAEBFwAArwEAMAEXAACvAQAwA90BAQCuAwAh4gFAALADACH_AQEArgMAIQIAAAClAQAgFwAAsgEAIAPdAQEArgMAIeIBQACwAwAh_wEBAK4DACECAAAAqAEAIBcAALQBACACAAAAqAEAIBcAALQBACADAAAApQEAIB4AAK0BACAfAACyAQAgAQAAAKUBACABAAAAqAEAIAMKAAD6BAAgJAAA_AQAICUAAPsEACAG2gEAAIEDADDbAQAAuwEAENwBAACBAwAw3QEBAMkCACHiAUAAywIAIf8BAQDJAgAhAwAAAKgBACABAAC6AQAwIwAAuwEAIAMAAACoAQAgAQAAqQEAMAIAAKUBACABAAAAIgAgAQAAACIAIAMAAAAgACABAAAhADACAAAiACADAAAAIAAgAQAAIQAwAgAAIgAgAwAAACAAIAEAACEAMAIAACIAIA0DAACqBAAgDAAA4gMAIN0BAQAAAAHgAQEAAAAB4QEBAAAAAeIBQAAAAAHjAUAAAAABhQIAAACOAgKMAggAAAABjgIBAAAAAY8CAQAAAAGQAgEAAAABkQKAAAAAAQEXAADDAQAgC90BAQAAAAHgAQEAAAAB4QEBAAAAAeIBQAAAAAHjAUAAAAABhQIAAACOAgKMAggAAAABjgIBAAAAAY8CAQAAAAGQAgEAAAABkQKAAAAAAQEXAADFAQAwARcAAMUBADANAwAAqAQAIAwAAOADACDdAQEArgMAIeABAQCuAwAh4QEBAK4DACHiAUAAsAMAIeMBQACwAwAhhQIAAN4DjgIijAIIAN0DACGOAgEAvAMAIY8CAQC8AwAhkAIBALwDACGRAoAAAAABAgAAACIAIBcAAMgBACAL3QEBAK4DACHgAQEArgMAIeEBAQCuAwAh4gFAALADACHjAUAAsAMAIYUCAADeA44CIowCCADdAwAhjgIBALwDACGPAgEAvAMAIZACAQC8AwAhkQKAAAAAAQIAAAAgACAXAADKAQAgAgAAACAAIBcAAMoBACADAAAAIgAgHgAAwwEAIB8AAMgBACABAAAAIgAgAQAAACAAIAkKAAD1BAAgJAAA-AQAICUAAPcEACBWAAD2BAAgVwAA-QQAII4CAAC4AwAgjwIAALgDACCQAgAAuAMAIJECAAC4AwAgDtoBAAD4AgAw2wEAANEBABDcAQAA-AIAMN0BAQDJAgAh4AEBAMkCACHhAQEAyQIAIeIBQADLAgAh4wFAAMsCACGFAgAA-gKOAiKMAggA-QIAIY4CAQDYAgAhjwIBANgCACGQAgEA2AIAIZECAAD7AgAgAwAAACAAIAEAANABADAjAADRAQAgAwAAACAAIAEAACEAMAIAACIAIBcEAADwAgAgBQAA8QIAIAYAAPICACAHAADzAgAgCQAA9AIAIA0AAPUCACAQAAD2AgAgEQAA9wIAINoBAADqAgAw2wEAANcBABDcAQAA6gIAMN0BAQAAAAHiAUAA1gIAIeMBQADWAgAh_gEBANUCACH_AQEAAAABgAIgAOsCACGBAgEA7AIAIYMCAADtAoMCIoUCAADuAoUCIoYCIADrAgAhhwIgAOsCACGIAkAA7wIAIQEAAADUAQAgAQAAANQBACAXBAAA8AIAIAUAAPECACAGAADyAgAgBwAA8wIAIAkAAPQCACANAAD1AgAgEAAA9gIAIBEAAPcCACDaAQAA6gIAMNsBAADXAQAQ3AEAAOoCADDdAQEA1QIAIeIBQADWAgAh4wFAANYCACH-AQEA1QIAIf8BAQDVAgAhgAIgAOsCACGBAgEA7AIAIYMCAADtAoMCIoUCAADuAoUCIoYCIADrAgAhhwIgAOsCACGIAkAA7wIAIQoEAADtBAAgBQAA7gQAIAYAAO8EACAHAADwBAAgCQAA8QQAIA0AAPIEACAQAADzBAAgEQAA9AQAIIECAAC4AwAgiAIAALgDACADAAAA1wEAIAEAANgBADACAADUAQAgAwAAANcBACABAADYAQAwAgAA1AEAIAMAAADXAQAgAQAA2AEAMAIAANQBACAUBAAA5QQAIAUAAOYEACAGAADnBAAgBwAA6AQAIAkAAOkEACANAADqBAAgEAAA6wQAIBEAAOwEACDdAQEAAAAB4gFAAAAAAeMBQAAAAAH-AQEAAAAB_wEBAAAAAYACIAAAAAGBAgEAAAABgwIAAACDAgKFAgAAAIUCAoYCIAAAAAGHAiAAAAABiAJAAAAAAQEXAADcAQAgDN0BAQAAAAHiAUAAAAAB4wFAAAAAAf4BAQAAAAH_AQEAAAABgAIgAAAAAYECAQAAAAGDAgAAAIMCAoUCAAAAhQIChgIgAAAAAYcCIAAAAAGIAkAAAAABARcAAN4BADABFwAA3gEAMBQEAADLAwAgBQAAzAMAIAYAAM0DACAHAADOAwAgCQAAzwMAIA0AANADACAQAADRAwAgEQAA0gMAIN0BAQCuAwAh4gFAALADACHjAUAAsAMAIf4BAQCuAwAh_wEBAK4DACGAAiAAyAMAIYECAQC8AwAhgwIAAMkDgwIihQIAAMoDhQIihgIgAMgDACGHAiAAyAMAIYgCQAC9AwAhAgAAANQBACAXAADhAQAgDN0BAQCuAwAh4gFAALADACHjAUAAsAMAIf4BAQCuAwAh_wEBAK4DACGAAiAAyAMAIYECAQC8AwAhgwIAAMkDgwIihQIAAMoDhQIihgIgAMgDACGHAiAAyAMAIYgCQAC9AwAhAgAAANcBACAXAADjAQAgAgAAANcBACAXAADjAQAgAwAAANQBACAeAADcAQAgHwAA4QEAIAEAAADUAQAgAQAAANcBACAFCgAAxQMAICQAAMcDACAlAADGAwAggQIAALgDACCIAgAAuAMAIA_aAQAA4AIAMNsBAADqAQAQ3AEAAOACADDdAQEAyQIAIeIBQADLAgAh4wFAAMsCACH-AQEAyQIAIf8BAQDJAgAhgAIgAOECACGBAgEA2AIAIYMCAADiAoMCIoUCAADjAoUCIoYCIADhAgAhhwIgAOECACGIAkAA2QIAIQMAAADXAQAgAQAA6QEAMCMAAOoBACADAAAA1wEAIAEAANgBADACAADUAQAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAJAwAAxAMAIN0BAQAAAAHhAQEAAAAB4gFAAAAAAeMBQAAAAAHxAUAAAAAB-wEBAAAAAfwBAQAAAAH9AQEAAAABARcAAPIBACAI3QEBAAAAAeEBAQAAAAHiAUAAAAAB4wFAAAAAAfEBQAAAAAH7AQEAAAAB_AEBAAAAAf0BAQAAAAEBFwAA9AEAMAEXAAD0AQAwCQMAAMMDACDdAQEArgMAIeEBAQCuAwAh4gFAALADACHjAUAAsAMAIfEBQACwAwAh-wEBAK4DACH8AQEAvAMAIf0BAQC8AwAhAgAAAAUAIBcAAPcBACAI3QEBAK4DACHhAQEArgMAIeIBQACwAwAh4wFAALADACHxAUAAsAMAIfsBAQCuAwAh_AEBALwDACH9AQEAvAMAIQIAAAADACAXAAD5AQAgAgAAAAMAIBcAAPkBACADAAAABQAgHgAA8gEAIB8AAPcBACABAAAABQAgAQAAAAMAIAUKAADAAwAgJAAAwgMAICUAAMEDACD8AQAAuAMAIP0BAAC4AwAgC9oBAADfAgAw2wEAAIACABDcAQAA3wIAMN0BAQDJAgAh4QEBAMkCACHiAUAAywIAIeMBQADLAgAh8QFAAMsCACH7AQEAyQIAIfwBAQDYAgAh_QEBANgCACEDAAAAAwAgAQAA_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_wEBAMkCACGAAiAA4QIAIYECAQDYAgAhgwIAAOICgwIihQIAAOMChQIihgIgAOECACGHAiAA4QIAIYgCQADZAgAhBQoAAM0CACAkAADpAgAgJQAA6QIAIOQBIAAAAAHrASAA6AIAIQcKAADNAgAgJAAA5wIAICUAAOcCACDkAQAAAIMCAuUBAAAAgwII5gEAAACDAgjrAQAA5gKDAiIHCgAAzQIAICQAAOUCACAlAADlAgAg5AEAAACFAgLlAQAAAIUCCOYBAAAAhQII6wEAAOQChQIiBwoAAM0CACAkAADlAgAgJQAA5QIAIOQBAAAAhQIC5QEAAACFAgjmAQAAAIUCCOsBAADkAoUCIgTkAQAAAIUCAuUBAAAAhQII5gEAAACFAgjrAQAA5QKFAiIHCgAAzQIAICQAAOcCACAlAADnAgAg5AEAAACDAgLlAQAAAIMCCOYBAAAAgwII6wEAAOYCgwIiBOQBAAAAgwIC5QEAAACDAgjmAQAAAIMCCOsBAADnAoMCIgUKAADNAgAgJAAA6QIAICUAAOkCACDkASAAAAAB6wEgAOgCACEC5AEgAAAAAesBIADpAgAhFwQAAPACACAFAADxAgAgBgAA8gIAIAcAAPMCACAJAAD0AgAgDQAA9QIAIBAAAPYCACARAAD3AgAg2gEAAOoCADDbAQAA1wEAENwBAADqAgAw3QEBANUCACHiAUAA1gIAIeMBQADWAgAh_gEBANUCACH_AQEA1QIAIYACIADrAgAhgQIBAOwCACGDAgAA7QKDAiKFAgAA7gKFAiKGAiAA6wIAIYcCIADrAgAhiAJAAO8CACEC5AEgAAAAAesBIADpAgAhC-QBAQAAAAHlAQEAAAAF5gEBAAAABecBAQAAAAHoAQEAAAAB6QEBAAAAAeoBAQAAAAHrAQEA3gIAIewBAQAAAAHtAQEAAAAB7gEBAAAAAQTkAQAAAIMCAuUBAAAAgwII5gEAAACDAgjrAQAA5wKDAiIE5AEAAACFAgLlAQAAAIUCCOYBAAAAhQII6wEAAOUChQIiCOQBQAAAAAHlAUAAAAAF5gFAAAAABecBQAAAAAHoAUAAAAAB6QFAAAAAAeoBQAAAAAHrAUAA3AIAIQOJAgAAAwAgigIAAAMAIIsCAAADACADiQIAAAcAIIoCAAAHACCLAgAABwAgEAMAAIUDACDaAQAAhAMAMNsBAAALABDcAQAAhAMAMN0BAQDVAgAh4QEBANUCACHiAUAA1gIAIeMBQADWAgAh_gEBANUCACH_AQEA1QIAIYcCIADrAgAhiAJAAO8CACGYAgEA7AIAIZkCAQDsAgAhrgIAAAsAIK8CAAALACAQAwAAhQMAINoBAACoAwAw2wEAAA0AENwBAACoAwAw3QEBANUCACHhAQEA1QIAIeIBQADWAgAh4wFAANYCACH-AQEA1QIAIf8BAQDVAgAhhwIgAOsCACGIAkAA7wIAIZgCAQDsAgAhmQIBAOwCACGuAgAADQAgrwIAAA0AIAOJAgAADwAgigIAAA8AIIsCAAAPACADiQIAABUAIIoCAAAVACCLAgAAFQAgA4kCAAAZACCKAgAAGQAgiwIAABkAIAOJAgAAIAAgigIAACAAIIsCAAAgACAO2gEAAPgCADDbAQAA0QEAENwBAAD4AgAw3QEBAMkCACHgAQEAyQIAIeEBAQDJAgAh4gFAAMsCACHjAUAAywIAIYUCAAD6Ao4CIowCCAD5AgAhjgIBANgCACGPAgEA2AIAIZACAQDYAgAhkQIAAPsCACANCgAAzQIAICQAAIADACAlAACAAwAgVgAAgAMAIFcAAIADACDkAQgAAAAB5QEIAAAABOYBCAAAAATnAQgAAAAB6AEIAAAAAekBCAAAAAHqAQgAAAAB6wEIAP8CACEHCgAAzQIAICQAAP4CACAlAAD-AgAg5AEAAACOAgLlAQAAAI4CCOYBAAAAjgII6wEAAP0CjgIiDwoAANsCACAkAAD8AgAgJQAA_AIAIOQBgAAAAAHnAYAAAAAB6AGAAAAAAekBgAAAAAHqAYAAAAAB6wGAAAAAAZICAQAAAAGTAgEAAAABlAIBAAAAAZUCgAAAAAGWAoAAAAABlwKAAAAAAQzkAYAAAAAB5wGAAAAAAegBgAAAAAHpAYAAAAAB6gGAAAAAAesBgAAAAAGSAgEAAAABkwIBAAAAAZQCAQAAAAGVAoAAAAABlgKAAAAAAZcCgAAAAAEHCgAAzQIAICQAAP4CACAlAAD-AgAg5AEAAACOAgLlAQAAAI4CCOYBAAAAjgII6wEAAP0CjgIiBOQBAAAAjgIC5QEAAACOAgjmAQAAAI4CCOsBAAD-Ao4CIg0KAADNAgAgJAAAgAMAICUAAIADACBWAACAAwAgVwAAgAMAIOQBCAAAAAHlAQgAAAAE5gEIAAAABOcBCAAAAAHoAQgAAAAB6QEIAAAAAeoBCAAAAAHrAQgA_wIAIQjkAQgAAAAB5QEIAAAABOYBCAAAAATnAQgAAAAB6AEIAAAAAekBCAAAAAHqAQgAAAAB6wEIAIADACEG2gEAAIEDADDbAQAAuwEAENwBAACBAwAw3QEBAMkCACHiAUAAywIAIf8BAQDJAgAhBtoBAACCAwAw2wEAAKgBABDcAQAAggMAMN0BAQDVAgAh4gFAANYCACH_AQEA1QIAIQ3aAQAAgwMAMNsBAACiAQAQ3AEAAIMDADDdAQEAyQIAIeEBAQDJAgAh4gFAAMsCACHjAUAAywIAIf4BAQDJAgAh_wEBAMkCACGHAiAA4QIAIYgCQADZAgAhmAIBANgCACGZAgEA2AIAIQ4DAACFAwAg2gEAAIQDADDbAQAACwAQ3AEAAIQDADDdAQEA1QIAIeEBAQDVAgAh4gFAANYCACHjAUAA1gIAIf4BAQDVAgAh_wEBANUCACGHAiAA6wIAIYgCQADvAgAhmAIBAOwCACGZAgEA7AIAIRkEAADwAgAgBQAA8QIAIAYAAPICACAHAADzAgAgCQAA9AIAIA0AAPUCACAQAAD2AgAgEQAA9wIAINoBAADqAgAw2wEAANcBABDcAQAA6gIAMN0BAQDVAgAh4gFAANYCACHjAUAA1gIAIf4BAQDVAgAh_wEBANUCACGAAiAA6wIAIYECAQDsAgAhgwIAAO0CgwIihQIAAO4ChQIihgIgAOsCACGHAiAA6wIAIYgCQADvAgAhrgIAANcBACCvAgAA1wEAIBbaAQAAhgMAMNsBAACKAQAQ3AEAAIYDADDdAQEAyQIAId8BAACJA6ECIuIBQADLAgAh4wFAAMsCACGFAgAAiAOgAiKHAiAA4QIAIYgCQADZAgAhmgIBAMkCACGbAgEAyQIAIZwCAQDJAgAhnQIBAMkCACGeAgAAhwMAIKECCACKAwAhogIBANgCACGjAiAA4QIAIaQCAgCLAwAhpQIgAOECACGmAgEAyQIAIacCAQDJAgAhBOQBAQAAAAWoAgEAAAABqQIBAAAABKoCAQAAAAQHCgAAzQIAICQAAJIDACAlAACSAwAg5AEAAACgAgLlAQAAAKACCOYBAAAAoAII6wEAAJEDoAIiBwoAAM0CACAkAACQAwAgJQAAkAMAIOQBAAAAoQIC5QEAAAChAgjmAQAAAKECCOsBAACPA6ECIg0KAADbAgAgJAAAjgMAICUAAI4DACBWAACOAwAgVwAAjgMAIOQBCAAAAAHlAQgAAAAF5gEIAAAABecBCAAAAAHoAQgAAAAB6QEIAAAAAeoBCAAAAAHrAQgAjQMAIQ0KAADNAgAgJAAAzQIAICUAAM0CACBWAACAAwAgVwAAzQIAIOQBAgAAAAHlAQIAAAAE5gECAAAABOcBAgAAAAHoAQIAAAAB6QECAAAAAeoBAgAAAAHrAQIAjAMAIQ0KAADNAgAgJAAAzQIAICUAAM0CACBWAACAAwAgVwAAzQIAIOQBAgAAAAHlAQIAAAAE5gECAAAABOcBAgAAAAHoAQIAAAAB6QECAAAAAeoBAgAAAAHrAQIAjAMAIQ0KAADbAgAgJAAAjgMAICUAAI4DACBWAACOAwAgVwAAjgMAIOQBCAAAAAHlAQgAAAAF5gEIAAAABecBCAAAAAHoAQgAAAAB6QEIAAAAAeoBCAAAAAHrAQgAjQMAIQjkAQgAAAAB5QEIAAAABeYBCAAAAAXnAQgAAAAB6AEIAAAAAekBCAAAAAHqAQgAAAAB6wEIAI4DACEHCgAAzQIAICQAAJADACAlAACQAwAg5AEAAAChAgLlAQAAAKECCOYBAAAAoQII6wEAAI8DoQIiBOQBAAAAoQIC5QEAAAChAgjmAQAAAKECCOsBAACQA6ECIgcKAADNAgAgJAAAkgMAICUAAJIDACDkAQAAAKACAuUBAAAAoAII5gEAAACgAgjrAQAAkQOgAiIE5AEAAACgAgLlAQAAAKACCOYBAAAAoAII6wEAAJIDoAIiDNoBAACTAwAw2wEAAHQAENwBAACTAwAw3QEBAMkCACHgAQEAyQIAIeIBQADLAgAh4wFAAMsCACGHAiAA4QIAIYgCQADZAgAhpgIBAMkCACGrAgEAyQIAIawCAQDYAgAhCtoBAACUAwAw2wEAAFwAENwBAACUAwAw3QEBAMkCACHiAUAAywIAIeMBQADLAgAh_gEBAMkCACGHAiAA4QIAIYgCQADZAgAhnQIBANgCACELCQAA9AIAINoBAACVAwAw2wEAAEkAENwBAACVAwAw3QEBANUCACHiAUAA1gIAIeMBQADWAgAh_gEBANUCACGHAiAA6wIAIYgCQADvAgAhnQIBAOwCACEN2gEAAJYDADDbAQAAQwAQ3AEAAJYDADDdAQEAyQIAIeEBAQDJAgAh4gFAAMsCACHjAUAAywIAIf4BAQDJAgAh_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_gEBANUCACH_AQEA1QIAIYcCIADrAgAhiAJAAO8CACGYAgEA7AIAIZkCAQDsAgAhEQMAAIUDACDaAQAAqQMAMNsBAAAHABDcAQAAqQMAMN0BAQDVAgAh4QEBANUCACHiAUAA1gIAIeMBQADWAgAh8gEBANUCACHzAQEA1QIAIfQBAQDsAgAh9QEBAOwCACH2AQEA7AIAIfcBQADvAgAh-AFAAO8CACH5AQEA7AIAIfoBAQDsAgAhDAMAAIUDACDaAQAAqgMAMNsBAAADABDcAQAAqgMAMN0BAQDVAgAh4QEBANUCACHiAUAA1gIAIeMBQADWAgAh8QFAANYCACH7AQEA1QIAIfwBAQDsAgAh_QEBAOwCACEAAAABswIBAAAAAQGzAgAAAN8BAgGzAkAAAAABBR4AAOcFACAfAADtBQAgsAIAAOgFACCxAgAA7AUAILYCAAARACAFHgAA5QUAIB8AAOoFACCwAgAA5gUAILECAADpBQAgtgIAANQBACADHgAA5wUAILACAADoBQAgtgIAABEAIAMeAADlBQAgsAIAAOYFACC2AgAA1AEAIAAAAAAAAAABswIBAAAAAQGzAkAAAAABBR4AAOAFACAfAADjBQAgsAIAAOEFACCxAgAA4gUAILYCAADUAQAgAx4AAOAFACCwAgAA4QUAILYCAADUAQAgAAAABR4AANsFACAfAADeBQAgsAIAANwFACCxAgAA3QUAILYCAADUAQAgAx4AANsFACCwAgAA3AUAILYCAADUAQAgAAAAAbMCIAAAAAEBswIAAACDAgIBswIAAACFAgILHgAA2QQAMB8AAN4EADCwAgAA2gQAMLECAADbBAAwsgIAANwEACCzAgAA3QQAMLQCAADdBAAwtQIAAN0EADC2AgAA3QQAMLcCAADfBAAwuAIAAOAEADALHgAAzQQAMB8AANIEADCwAgAAzgQAMLECAADPBAAwsgIAANAEACCzAgAA0QQAMLQCAADRBAAwtQIAANEEADC2AgAA0QQAMLcCAADTBAAwuAIAANQEADAHHgAAyAQAIB8AAMsEACCwAgAAyQQAILECAADKBAAgtAIAAAsAILUCAAALACC2AgAAjQEAIAceAADDBAAgHwAAxgQAILACAADEBAAgsQIAAMUEACC0AgAADQAgtQIAAA0AILYCAAABACALHgAAjAQAMB8AAJEEADCwAgAAjQQAMLECAACOBAAwsgIAAI8EACCzAgAAkAQAMLQCAACQBAAwtQIAAJAEADC2AgAAkAQAMLcCAACSBAAwuAIAAJMEADALHgAAgAQAMB8AAIUEADCwAgAAgQQAMLECAACCBAAwsgIAAIMEACCzAgAAhAQAMLQCAACEBAAwtQIAAIQEADC2AgAAhAQAMLcCAACGBAAwuAIAAIcEADALHgAA4wMAMB8AAOgDADCwAgAA5AMAMLECAADlAwAwsgIAAOYDACCzAgAA5wMAMLQCAADnAwAwtQIAAOcDADC2AgAA5wMAMLcCAADpAwAwuAIAAOoDADALHgAA0wMAMB8AANgDADCwAgAA1AMAMLECAADVAwAwsgIAANYDACCzAgAA1wMAMLQCAADXAwAwtQIAANcDADC2AgAA1wMAMLcCAADZAwAwuAIAANoDADALDAAA4gMAIN0BAQAAAAHgAQEAAAAB4gFAAAAAAeMBQAAAAAGFAgAAAI4CAowCCAAAAAGOAgEAAAABjwIBAAAAAZACAQAAAAGRAoAAAAABAgAAACIAIB4AAOEDACADAAAAIgAgHgAA4QMAIB8AAN8DACABFwAA2gUAMBEDAACFAwAgDAAAnAMAINoBAACYAwAw2wEAACAAENwBAACYAwAw3QEBAAAAAeABAQDVAgAh4QEBANUCACHiAUAA1gIAIeMBQADWAgAhhQIAAJoDjgIijAIIAJkDACGOAgEAAAABjwIBAAAAAZACAQDsAgAhkQIAAJsDACCtAgAAlwMAIAIAAAAiACAXAADfAwAgAgAAANsDACAXAADcAwAgDtoBAADaAwAw2wEAANsDABDcAQAA2gMAMN0BAQDVAgAh4AEBANUCACHhAQEA1QIAIeIBQADWAgAh4wFAANYCACGFAgAAmgOOAiKMAggAmQMAIY4CAQDsAgAhjwIBAOwCACGQAgEA7AIAIZECAACbAwAgDtoBAADaAwAw2wEAANsDABDcAQAA2gMAMN0BAQDVAgAh4AEBANUCACHhAQEA1QIAIeIBQADWAgAh4wFAANYCACGFAgAAmgOOAiKMAggAmQMAIY4CAQDsAgAhjwIBAOwCACGQAgEA7AIAIZECAACbAwAgCt0BAQCuAwAh4AEBAK4DACHiAUAAsAMAIeMBQACwAwAhhQIAAN4DjgIijAIIAN0DACGOAgEAvAMAIY8CAQC8AwAhkAIBALwDACGRAoAAAAABBbMCCAAAAAG5AggAAAABugIIAAAAAbsCCAAAAAG8AggAAAABAbMCAAAAjgICCwwAAOADACDdAQEArgMAIeABAQCuAwAh4gFAALADACHjAUAAsAMAIYUCAADeA44CIowCCADdAwAhjgIBALwDACGPAgEAvAMAIZACAQC8AwAhkQKAAAAAAQUeAADVBQAgHwAA2AUAILACAADWBQAgsQIAANcFACC2AgAAEQAgCwwAAOIDACDdAQEAAAAB4AEBAAAAAeIBQAAAAAHjAUAAAAABhQIAAACOAgKMAggAAAABjgIBAAAAAY8CAQAAAAGQAgEAAAABkQKAAAAAAQMeAADVBQAgsAIAANYFACC2AgAAEQAgCwwAAPsDACAOAAD_AwAgDwAA_QMAIN0BAQAAAAHgAQEAAAAB4gFAAAAAAeMBQAAAAAGHAiAAAAABiAJAAAAAAasCAQAAAAGsAgEAAAABAgAAABsAIB4AAP4DACADAAAAGwAgHgAA_gMAIB8AAO0DACABFwAA1AUAMBAIAACFAwAgDAAAnAMAIA4AAJ4DACAPAAD2AgAg2gEAAJ0DADDbAQAAGQAQ3AEAAJ0DADDdAQEAAAAB4AEBANUCACHiAUAA1gIAIeMBQADWAgAhhwIgAOsCACGIAkAA7wIAIaYCAQDVAgAhqwIBANUCACGsAgEA7AIAIQIAAAAbACAXAADtAwAgAgAAAOsDACAXAADsAwAgDNoBAADqAwAw2wEAAOsDABDcAQAA6gMAMN0BAQDVAgAh4AEBANUCACHiAUAA1gIAIeMBQADWAgAhhwIgAOsCACGIAkAA7wIAIaYCAQDVAgAhqwIBANUCACGsAgEA7AIAIQzaAQAA6gMAMNsBAADrAwAQ3AEAAOoDADDdAQEA1QIAIeABAQDVAgAh4gFAANYCACHjAUAA1gIAIYcCIADrAgAhiAJAAO8CACGmAgEA1QIAIasCAQDVAgAhrAIBAOwCACEI3QEBAK4DACHgAQEArgMAIeIBQACwAwAh4wFAALADACGHAiAAyAMAIYgCQAC9AwAhqwIBAK4DACGsAgEAvAMAIQsMAADuAwAgDgAA7wMAIA8AAPADACDdAQEArgMAIeABAQCuAwAh4gFAALADACHjAUAAsAMAIYcCIADIAwAhiAJAAL0DACGrAgEArgMAIawCAQC8AwAhBR4AAMgFACAfAADSBQAgsAIAAMkFACCxAgAA0QUAILYCAAARACAHHgAAxAUAIB8AAM8FACCwAgAAxQUAILECAADOBQAgtAIAABkAILUCAAAZACC2AgAAGwAgCx4AAPEDADAfAAD1AwAwsAIAAPIDADCxAgAA8wMAMLICAAD0AwAgswIAAOcDADC0AgAA5wMAMLUCAADnAwAwtgIAAOcDADC3AgAA9gMAMLgCAADqAwAwCwgAAPwDACAMAAD7AwAgDwAA_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_BQAgtgIAAEYAIAseAAC0BAAwHwAAuAQAMLACAAC1BAAwsQIAALYEADCyAgAAtwQAILMCAACEBAAwtAIAAIQEADC1AgAAhAQAMLYCAACEBAAwtwIAALkEADC4AgAAhwQAMAseAACrBAAwHwAArwQAMLACAACsBAAwsQIAAK0EADCyAgAArgQAILMCAADnAwAwtAIAAOcDADC1AgAA5wMAMLYCAADnAwAwtwIAALAEADC4AgAA6gMAMAseAACgBAAwHwAApAQAMLACAAChBAAwsQIAAKIEADCyAgAAowQAILMCAADXAwAwtAIAANcDADC1AgAA1wMAMLYCAADXAwAwtwIAAKUEADC4AgAA2gMAMAsDAACqBAAg3QEBAAAAAeEBAQAAAAHiAUAAAAAB4wFAAAAAAYUCAAAAjgICjAIIAAAAAY4CAQAAAAGPAgEAAAABkAIBAAAAAZECgAAAAAECAAAAIgAgHgAAqQQAIAMAAAAiACAeAACpBAAgHwAApwQAIAEXAAC-BQAwAgAAACIAIBcAAKcEACACAAAA2wMAIBcAAKYEACAK3QEBAK4DACHhAQEArgMAIeIBQACwAwAh4wFAALADACGFAgAA3gOOAiKMAggA3QMAIY4CAQC8AwAhjwIBALwDACGQAgEAvAMAIZECgAAAAAELAwAAqAQAIN0BAQCuAwAh4QEBAK4DACHiAUAAsAMAIeMBQACwAwAhhQIAAN4DjgIijAIIAN0DACGOAgEAvAMAIY8CAQC8AwAhkAIBALwDACGRAoAAAAABBR4AALkFACAfAAC8BQAgsAIAALoFACCxAgAAuwUAILYCAADUAQAgCwMAAKoEACDdAQEAAAAB4QEBAAAAAeIBQAAAAAHjAUAAAAABhQIAAACOAgKMAggAAAABjgIBAAAAAY8CAQAAAAGQAgEAAAABkQKAAAAAAQMeAAC5BQAgsAIAALoFACC2AgAA1AEAIAsIAAD8AwAgDgAA_wMAIA8AAP0DACDdAQEAAAAB4gFAAAAAAeMBQAAAAAGHAiAAAAABiAJAAAAAAaYCAQAAAAGrAgEAAAABrAIBAAAAAQIAAAAbACAeAACzBAAgAwAAABsAIB4AALMEACAfAACyBAAgARcAALgFADACAAAAGwAgFwAAsgQAIAIAAADrAwAgFwAAsQQAIAjdAQEArgMAIeIBQACwAwAh4wFAALADACGHAiAAyAMAIYgCQAC9AwAhpgIBAK4DACGrAgEArgMAIawCAQC8AwAhCwgAAPkDACAOAADvAwAgDwAA8AMAIN0BAQCuAwAh4gFAALADACHjAUAAsAMAIYcCIADIAwAhiAJAAL0DACGmAgEArgMAIasCAQCuAwAhrAIBALwDACELCAAA_AMAIA4AAP8DACAPAAD9AwAg3QEBAAAAAeIBQAAAAAHjAUAAAAABhwIgAAAAAYgCQAAAAAGmAgEAAAABqwIBAAAAAawCAQAAAAEGAwAAtAMAIN0BAQAAAAHfAQAAAN8BAuEBAQAAAAHiAUAAAAAB4wFAAAAAAQIAAAAXACAeAAC8BAAgAwAAABcAIB4AALwEACAfAAC7BAAgARcAALcFADACAAAAFwAgFwAAuwQAIAIAAACIBAAgFwAAugQAIAXdAQEArgMAId8BAACvA98BIuEBAQCuAwAh4gFAALADACHjAUAAsAMAIQYDAACyAwAg3QEBAK4DACHfAQAArwPfASLhAQEArgMAIeIBQACwAwAh4wFAALADACEGAwAAtAMAIN0BAQAAAAHfAQAAAN8BAuEBAQAAAAHiAUAAAAAB4wFAAAAAARYLAAC_BAAgDQAAwAQAIBAAAMEEACARAADCBAAg3QEBAAAAAd8BAAAAoQIC4gFAAAAAAeMBQAAAAAGFAgAAAKACAocCIAAAAAGIAkAAAAABmgIBAAAAAZsCAQAAAAGcAgEAAAABnQIBAAAAAZ4CAAC-BAAgoQIIAAAAAaICAQAAAAGjAiAAAAABpAICAAAAAaUCIAAAAAGnAgEAAAABAbMCAQAAAAQDHgAAtQUAILACAAC2BQAgtgIAAEYAIAQeAAC0BAAwsAIAALUEADCyAgAAtwQAILYCAACEBAAwBB4AAKsEADCwAgAArAQAMLICAACuBAAgtgIAAOcDADAEHgAAoAQAMLACAAChBAAwsgIAAKMEACC2AgAA1wMAMAndAQEAAAAB4gFAAAAAAeMBQAAAAAH-AQEAAAAB_wEBAAAAAYcCIAAAAAGIAkAAAAABmAIBAAAAAZkCAQAAAAECAAAAAQAgHgAAwwQAIAMAAAANACAeAADDBAAgHwAAxwQAIAsAAAANACAXAADHBAAg3QEBAK4DACHiAUAAsAMAIeMBQACwAwAh_gEBAK4DACH_AQEArgMAIYcCIADIAwAhiAJAAL0DACGYAgEAvAMAIZkCAQC8AwAhCd0BAQCuAwAh4gFAALADACHjAUAAsAMAIf4BAQCuAwAh_wEBAK4DACGHAiAAyAMAIYgCQAC9AwAhmAIBALwDACGZAgEAvAMAIQndAQEAAAAB4gFAAAAAAeMBQAAAAAH-AQEAAAAB_wEBAAAAAYcCIAAAAAGIAkAAAAABmAIBAAAAAZkCAQAAAAECAAAAjQEAIB4AAMgEACADAAAACwAgHgAAyAQAIB8AAMwEACALAAAACwAgFwAAzAQAIN0BAQCuAwAh4gFAALADACHjAUAAsAMAIf4BAQCuAwAh_wEBAK4DACGHAiAAyAMAIYgCQAC9AwAhmAIBALwDACGZAgEAvAMAIQndAQEArgMAIeIBQACwAwAh4wFAALADACH-AQEArgMAIf8BAQCuAwAhhwIgAMgDACGIAkAAvQMAIZgCAQC8AwAhmQIBALwDACEM3QEBAAAAAeIBQAAAAAHjAUAAAAAB8gEBAAAAAfMBAQAAAAH0AQEAAAAB9QEBAAAAAfYBAQAAAAH3AUAAAAAB-AFAAAAAAfkBAQAAAAH6AQEAAAABAgAAAAkAIB4AANgEACADAAAACQAgHgAA2AQAIB8AANcEACABFwAAtAUAMBEDAACFAwAg2gEAAKkDADDbAQAABwAQ3AEAAKkDADDdAQEAAAAB4QEBANUCACHiAUAA1gIAIeMBQADWAgAh8gEBANUCACHzAQEA1QIAIfQBAQDsAgAh9QEBAOwCACH2AQEA7AIAIfcBQADvAgAh-AFAAO8CACH5AQEA7AIAIfoBAQDsAgAhAgAAAAkAIBcAANcEACACAAAA1QQAIBcAANYEACAQ2gEAANQEADDbAQAA1QQAENwBAADUBAAw3QEBANUCACHhAQEA1QIAIeIBQADWAgAh4wFAANYCACHyAQEA1QIAIfMBAQDVAgAh9AEBAOwCACH1AQEA7AIAIfYBAQDsAgAh9wFAAO8CACH4AUAA7wIAIfkBAQDsAgAh-gEBAOwCACEQ2gEAANQEADDbAQAA1QQAENwBAADUBAAw3QEBANUCACHhAQEA1QIAIeIBQADWAgAh4wFAANYCACHyAQEA1QIAIfMBAQDVAgAh9AEBAOwCACH1AQEA7AIAIfYBAQDsAgAh9wFAAO8CACH4AUAA7wIAIfkBAQDsAgAh-gEBAOwCACEM3QEBAK4DACHiAUAAsAMAIeMBQACwAwAh8gEBAK4DACHzAQEArgMAIfQBAQC8AwAh9QEBALwDACH2AQEAvAMAIfcBQAC9AwAh-AFAAL0DACH5AQEAvAMAIfoBAQC8AwAhDN0BAQCuAwAh4gFAALADACHjAUAAsAMAIfIBAQCuAwAh8wEBAK4DACH0AQEAvAMAIfUBAQC8AwAh9gEBALwDACH3AUAAvQMAIfgBQAC9AwAh-QEBALwDACH6AQEAvAMAIQzdAQEAAAAB4gFAAAAAAeMBQAAAAAHyAQEAAAAB8wEBAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBQAAAAAH4AUAAAAAB-QEBAAAAAfoBAQAAAAEH3QEBAAAAAeIBQAAAAAHjAUAAAAAB8QFAAAAAAfsBAQAAAAH8AQEAAAAB_QEBAAAAAQIAAAAFACAeAADkBAAgAwAAAAUAIB4AAOQEACAfAADjBAAgARcAALMFADAMAwAAhQMAINoBAACqAwAw2wEAAAMAENwBAACqAwAw3QEBAAAAAeEBAQDVAgAh4gFAANYCACHjAUAA1gIAIfEBQADWAgAh-wEBAAAAAfwBAQDsAgAh_QEBAOwCACECAAAABQAgFwAA4wQAIAIAAADhBAAgFwAA4gQAIAvaAQAA4AQAMNsBAADhBAAQ3AEAAOAEADDdAQEA1QIAIeEBAQDVAgAh4gFAANYCACHjAUAA1gIAIfEBQADWAgAh-wEBANUCACH8AQEA7AIAIf0BAQDsAgAhC9oBAADgBAAw2wEAAOEEABDcAQAA4AQAMN0BAQDVAgAh4QEBANUCACHiAUAA1gIAIeMBQADWAgAh8QFAANYCACH7AQEA1QIAIfwBAQDsAgAh_QEBAOwCACEH3QEBAK4DACHiAUAAsAMAIeMBQACwAwAh8QFAALADACH7AQEArgMAIfwBAQC8AwAh_QEBALwDACEH3QEBAK4DACHiAUAAsAMAIeMBQACwAwAh8QFAALADACH7AQEArgMAIfwBAQC8AwAh_QEBALwDACEH3QEBAAAAAeIBQAAAAAHjAUAAAAAB8QFAAAAAAfsBAQAAAAH8AQEAAAAB_QEBAAAAAQQeAADZBAAwsAIAANoEADCyAgAA3AQAILYCAADdBAAwBB4AAM0EADCwAgAAzgQAMLICAADQBAAgtgIAANEEADADHgAAyAQAILACAADJBAAgtgIAAI0BACADHgAAwwQAILACAADEBAAgtgIAAAEAIAQeAACMBAAwsAIAAI0EADCyAgAAjwQAILYCAACQBAAwBB4AAIAEADCwAgAAgQQAMLICAACDBAAgtgIAAIQEADAEHgAA4wMAMLACAADkAwAwsgIAAOYDACC2AgAA5wMAMAQeAADTAwAwsAIAANQDADCyAgAA1gMAILYCAADXAwAwAAAEAwAAggUAIIgCAAC4AwAgmAIAALgDACCZAgAAuAMAIAQDAACCBQAgiAIAALgDACCYAgAAuAMAIJkCAAC4AwAgAAAAAAAAAAAAAAAAAAAABR4AAK4FACAfAACxBQAgsAIAAK8FACCxAgAAsAUAILYCAADUAQAgAx4AAK4FACCwAgAArwUAILYCAADUAQAgCgQAAO0EACAFAADuBAAgBgAA7wQAIAcAAPAEACAJAADxBAAgDQAA8gQAIBAAAPMEACARAAD0BAAggQIAALgDACCIAgAAuAMAIAAAAAAABR4AAKkFACAfAACsBQAgsAIAAKoFACCxAgAAqwUAILYCAADUAQAgAx4AAKkFACCwAgAAqgUAILYCAADUAQAgAAAAAAAACx4AAJEFADAfAACVBQAwsAIAAJIFADCxAgAAkwUAMLICAACUBQAgswIAAJAEADC0AgAAkAQAMLUCAACQBAAwtgIAAJAEADC3AgAAlgUAMLgCAACTBAAwFggAAIkFACANAADABAAgEAAAwQQAIBEAAMIEACDdAQEAAAAB3wEAAAChAgLiAUAAAAAB4wFAAAAAAYUCAAAAoAIChwIgAAAAAYgCQAAAAAGaAgEAAAABmwIBAAAAAZwCAQAAAAGdAgEAAAABngIAAL4EACChAggAAAABogIBAAAAAaMCIAAAAAGkAgIAAAABpQIgAAAAAaYCAQAAAAECAAAAEQAgHgAAmQUAIAMAAAARACAeAACZBQAgHwAAmAUAIAEXAACoBQAwAgAAABEAIBcAAJgFACACAAAAlAQAIBcAAJcFACAS3QEBAK4DACHfAQAAmAShAiLiAUAAsAMAIeMBQACwAwAhhQIAAJcEoAIihwIgAMgDACGIAkAAvQMAIZoCAQCuAwAhmwIBAK4DACGcAgEArgMAIZ0CAQCuAwAhngIAAJYEACChAggAmQQAIaICAQC8AwAhowIgAMgDACGkAgIAmgQAIaUCIADIAwAhpgIBAK4DACEWCAAAiAUAIA0AAJ0EACAQAACeBAAgEQAAnwQAIN0BAQCuAwAh3wEAAJgEoQIi4gFAALADACHjAUAAsAMAIYUCAACXBKACIocCIADIAwAhiAJAAL0DACGaAgEArgMAIZsCAQCuAwAhnAIBAK4DACGdAgEArgMAIZ4CAACWBAAgoQIIAJkEACGiAgEAvAMAIaMCIADIAwAhpAICAJoEACGlAiAAyAMAIaYCAQCuAwAhFggAAIkFACANAADABAAgEAAAwQQAIBEAAMIEACDdAQEAAAAB3wEAAAChAgLiAUAAAAAB4wFAAAAAAYUCAAAAoAIChwIgAAAAAYgCQAAAAAGaAgEAAAABmwIBAAAAAZwCAQAAAAGdAgEAAAABngIAAL4EACChAggAAAABogIBAAAAAaMCIAAAAAGkAgIAAAABpQIgAAAAAaYCAQAAAAEEHgAAkQUAMLACAACSBQAwsgIAAJQFACC2AgAAkAQAMAAAAAUeAACjBQAgHwAApgUAILACAACkBQAgsQIAAKUFACC2AgAA1AEAIAMeAACjBQAgsAIAAKQFACC2AgAA1AEAIAgIAACCBQAgCwAAogUAIA0AAPIEACAQAADzBAAgEQAA9AQAIIgCAAC4AwAgoQIAALgDACCiAgAAuAMAIAYIAACCBQAgDAAAoAUAIA4AAKEFACAPAADzBAAgiAIAALgDACCsAgAAuAMAIAMJAADxBAAgiAIAALgDACCdAgAAuAMAIBMEAADlBAAgBQAA5gQAIAYAAOcEACAJAADpBAAgDQAA6gQAIBAAAOsEACARAADsBAAg3QEBAAAAAeIBQAAAAAHjAUAAAAAB_gEBAAAAAf8BAQAAAAGAAiAAAAABgQIBAAAAAYMCAAAAgwIChQIAAACFAgKGAiAAAAABhwIgAAAAAYgCQAAAAAECAAAA1AEAIB4AAKMFACADAAAA1wEAIB4AAKMFACAfAACnBQAgFQAAANcBACAEAADLAwAgBQAAzAMAIAYAAM0DACAJAADPAwAgDQAA0AMAIBAAANEDACARAADSAwAgFwAApwUAIN0BAQCuAwAh4gFAALADACHjAUAAsAMAIf4BAQCuAwAh_wEBAK4DACGAAiAAyAMAIYECAQC8AwAhgwIAAMkDgwIihQIAAMoDhQIihgIgAMgDACGHAiAAyAMAIYgCQAC9AwAhEwQAAMsDACAFAADMAwAgBgAAzQMAIAkAAM8DACANAADQAwAgEAAA0QMAIBEAANIDACDdAQEArgMAIeIBQACwAwAh4wFAALADACH-AQEArgMAIf8BAQCuAwAhgAIgAMgDACGBAgEAvAMAIYMCAADJA4MCIoUCAADKA4UCIoYCIADIAwAhhwIgAMgDACGIAkAAvQMAIRLdAQEAAAAB3wEAAAChAgLiAUAAAAAB4wFAAAAAAYUCAAAAoAIChwIgAAAAAYgCQAAAAAGaAgEAAAABmwIBAAAAAZwCAQAAAAGdAgEAAAABngIAAL4EACChAggAAAABogIBAAAAAaMCIAAAAAGkAgIAAAABpQIgAAAAAaYCAQAAAAETBAAA5QQAIAUAAOYEACAGAADnBAAgBwAA6AQAIA0AAOoEACAQAADrBAAgEQAA7AQAIN0BAQAAAAHiAUAAAAAB4wFAAAAAAf4BAQAAAAH_AQEAAAABgAIgAAAAAYECAQAAAAGDAgAAAIMCAoUCAAAAhQIChgIgAAAAAYcCIAAAAAGIAkAAAAABAgAAANQBACAeAACpBQAgAwAAANcBACAeAACpBQAgHwAArQUAIBUAAADXAQAgBAAAywMAIAUAAMwDACAGAADNAwAgBwAAzgMAIA0AANADACAQAADRAwAgEQAA0gMAIBcAAK0FACDdAQEArgMAIeIBQACwAwAh4wFAALADACH-AQEArgMAIf8BAQCuAwAhgAIgAMgDACGBAgEAvAMAIYMCAADJA4MCIoUCAADKA4UCIoYCIADIAwAhhwIgAMgDACGIAkAAvQMAIRMEAADLAwAgBQAAzAMAIAYAAM0DACAHAADOAwAgDQAA0AMAIBAAANEDACARAADSAwAg3QEBAK4DACHiAUAAsAMAIeMBQACwAwAh_gEBAK4DACH_AQEArgMAIYACIADIAwAhgQIBALwDACGDAgAAyQODAiKFAgAAygOFAiKGAiAAyAMAIYcCIADIAwAhiAJAAL0DACETBAAA5QQAIAUAAOYEACAHAADoBAAgCQAA6QQAIA0AAOoEACAQAADrBAAgEQAA7AQAIN0BAQAAAAHiAUAAAAAB4wFAAAAAAf4BAQAAAAH_AQEAAAABgAIgAAAAAYECAQAAAAGDAgAAAIMCAoUCAAAAhQIChgIgAAAAAYcCIAAAAAGIAkAAAAABAgAAANQBACAeAACuBQAgAwAAANcBACAeAACuBQAgHwAAsgUAIBUAAADXAQAgBAAAywMAIAUAAMwDACAHAADOAwAgCQAAzwMAIA0AANADACAQAADRAwAgEQAA0gMAIBcAALIFACDdAQEArgMAIeIBQACwAwAh4wFAALADACH-AQEArgMAIf8BAQCuAwAhgAIgAMgDACGBAgEAvAMAIYMCAADJA4MCIoUCAADKA4UCIoYCIADIAwAhhwIgAMgDACGIAkAAvQMAIRMEAADLAwAgBQAAzAMAIAcAAM4DACAJAADPAwAgDQAA0AMAIBAAANEDACARAADSAwAg3QEBAK4DACHiAUAAsAMAIeMBQACwAwAh_gEBAK4DACH_AQEArgMAIYACIADIAwAhgQIBALwDACGDAgAAyQODAiKFAgAAygOFAiKGAiAAyAMAIYcCIADIAwAhiAJAAL0DACEH3QEBAAAAAeIBQAAAAAHjAUAAAAAB8QFAAAAAAfsBAQAAAAH8AQEAAAAB_QEBAAAAAQzdAQEAAAAB4gFAAAAAAeMBQAAAAAHyAQEAAAAB8wEBAAAAAfQBAQAAAAH1AQEAAAAB9gEBAAAAAfcBQAAAAAH4AUAAAAAB-QEBAAAAAfoBAQAAAAEH3QEBAAAAAeIBQAAAAAHjAUAAAAAB_gEBAAAAAYcCIAAAAAGIAkAAAAABnQIBAAAAAQIAAABGACAeAAC1BQAgBd0BAQAAAAHfAQAAAN8BAuEBAQAAAAHiAUAAAAAB4wFAAAAAAQjdAQEAAAAB4gFAAAAAAeMBQAAAAAGHAiAAAAABiAJAAAAAAaYCAQAAAAGrAgEAAAABrAIBAAAAARMEAADlBAAgBQAA5gQAIAYAAOcEACAHAADoBAAgCQAA6QQAIA0AAOoEACAQAADrBAAg3QEBAAAAAeIBQAAAAAHjAUAAAAAB_gEBAAAAAf8BAQAAAAGAAiAAAAABgQIBAAAAAYMCAAAAgwIChQIAAACFAgKGAiAAAAABhwIgAAAAAYgCQAAAAAECAAAA1AEAIB4AALkFACADAAAA1wEAIB4AALkFACAfAAC9BQAgFQAAANcBACAEAADLAwAgBQAAzAMAIAYAAM0DACAHAADOAwAgCQAAzwMAIA0AANADACAQAADRAwAgFwAAvQUAIN0BAQCuAwAh4gFAALADACHjAUAAsAMAIf4BAQCuAwAh_wEBAK4DACGAAiAAyAMAIYECAQC8AwAhgwIAAMkDgwIihQIAAMoDhQIihgIgAMgDACGHAiAAyAMAIYgCQAC9AwAhEwQAAMsDACAFAADMAwAgBgAAzQMAIAcAAM4DACAJAADPAwAgDQAA0AMAIBAAANEDACDdAQEArgMAIeIBQACwAwAh4wFAALADACH-AQEArgMAIf8BAQCuAwAhgAIgAMgDACGBAgEAvAMAIYMCAADJA4MCIoUCAADKA4UCIoYCIADIAwAhhwIgAMgDACGIAkAAvQMAIQrdAQEAAAAB4QEBAAAAAeIBQAAAAAHjAUAAAAABhQIAAACOAgKMAggAAAABjgIBAAAAAY8CAQAAAAGQAgEAAAABkQKAAAAAAQMAAABJACAeAAC1BQAgHwAAwQUAIAkAAABJACAXAADBBQAg3QEBAK4DACHiAUAAsAMAIeMBQACwAwAh_gEBAK4DACGHAiAAyAMAIYgCQAC9AwAhnQIBALwDACEH3QEBAK4DACHiAUAAsAMAIeMBQACwAwAh_gEBAK4DACGHAiAAyAMAIYgCQAC9AwAhnQIBALwDACES3QEBAAAAAd8BAAAAoQIC4gFAAAAAAeMBQAAAAAGFAgAAAKACAocCIAAAAAGIAkAAAAABmgIBAAAAAZsCAQAAAAGcAgEAAAABnQIBAAAAAZ4CAAC-BAAgoQIIAAAAAaICAQAAAAGjAiAAAAABpAICAAAAAaUCIAAAAAGnAgEAAAABBd0BAQAAAAHfAQAAAN8BAuABAQAAAAHiAUAAAAAB4wFAAAAAAQwIAAD8AwAgDAAA-wMAIA4AAP8DACDdAQEAAAAB4AEBAAAAAeIBQAAAAAHjAUAAAAABhwIgAAAAAYgCQAAAAAGmAgEAAAABqwIBAAAAAawCAQAAAAECAAAAGwAgHgAAxAUAIBMEAADlBAAgBQAA5gQAIAYAAOcEACAHAADoBAAgCQAA6QQAIA0AAOoEACARAADsBAAg3QEBAAAAAeIBQAAAAAHjAUAAAAAB_gEBAAAAAf8BAQAAAAGAAiAAAAABgQIBAAAAAYMCAAAAgwIChQIAAACFAgKGAiAAAAABhwIgAAAAAYgCQAAAAAECAAAA1AEAIB4AAMYFACAXCAAAiQUAIAsAAL8EACANAADABAAgEQAAwgQAIN0BAQAAAAHfAQAAAKECAuIBQAAAAAHjAUAAAAABhQIAAACgAgKHAiAAAAABiAJAAAAAAZoCAQAAAAGbAgEAAAABnAIBAAAAAZ0CAQAAAAGeAgAAvgQAIKECCAAAAAGiAgEAAAABowIgAAAAAaQCAgAAAAGlAiAAAAABpgIBAAAAAacCAQAAAAECAAAAEQAgHgAAyAUAIAMAAADXAQAgHgAAxgUAIB8AAMwFACAVAAAA1wEAIAQAAMsDACAFAADMAwAgBgAAzQMAIAcAAM4DACAJAADPAwAgDQAA0AMAIBEAANIDACAXAADMBQAg3QEBAK4DACHiAUAAsAMAIeMBQACwAwAh_gEBAK4DACH_AQEArgMAIYACIADIAwAhgQIBALwDACGDAgAAyQODAiKFAgAAygOFAiKGAiAAyAMAIYcCIADIAwAhiAJAAL0DACETBAAAywMAIAUAAMwDACAGAADNAwAgBwAAzgMAIAkAAM8DACANAADQAwAgEQAA0gMAIN0BAQCuAwAh4gFAALADACHjAUAAsAMAIf4BAQCuAwAh_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_gEBAAAAAf8BAQAAAAGAAiAAAAABgQIBAAAAAYMCAAAAgwIChQIAAACFAgKGAiAAAAABhwIgAAAAAYgCQAAAAAECAAAA1AEAIB4AANsFACADAAAA1wEAIB4AANsFACAfAADfBQAgFQAAANcBACAFAADMAwAgBgAAzQMAIAcAAM4DACAJAADPAwAgDQAA0AMAIBAAANEDACARAADSAwAgFwAA3wUAIN0BAQCuAwAh4gFAALADACHjAUAAsAMAIf4BAQCuAwAh_wEBAK4DACGAAiAAyAMAIYECAQC8AwAhgwIAAMkDgwIihQIAAMoDhQIihgIgAMgDACGHAiAAyAMAIYgCQAC9AwAhEwUAAMwDACAGAADNAwAgBwAAzgMAIAkAAM8DACANAADQAwAgEAAA0QMAIBEAANIDACDdAQEArgMAIeIBQACwAwAh4wFAALADACH-AQEArgMAIf8BAQCuAwAhgAIgAMgDACGBAgEAvAMAIYMCAADJA4MCIoUCAADKA4UCIoYCIADIAwAhhwIgAMgDACGIAkAAvQMAIRMEAADlBAAgBgAA5wQAIAcAAOgEACAJAADpBAAgDQAA6gQAIBAAAOsEACARAADsBAAg3QEBAAAAAeIBQAAAAAHjAUAAAAAB_gEBAAAAAf8BAQAAAAGAAiAAAAABgQIBAAAAAYMCAAAAgwIChQIAAACFAgKGAiAAAAABhwIgAAAAAYgCQAAAAAECAAAA1AEAIB4AAOAFACADAAAA1wEAIB4AAOAFACAfAADkBQAgFQAAANcBACAEAADLAwAgBgAAzQMAIAcAAM4DACAJAADPAwAgDQAA0AMAIBAAANEDACARAADSAwAgFwAA5AUAIN0BAQCuAwAh4gFAALADACHjAUAAsAMAIf4BAQCuAwAh_wEBAK4DACGAAiAAyAMAIYECAQC8AwAhgwIAAMkDgwIihQIAAMoDhQIihgIgAMgDACGHAiAAyAMAIYgCQAC9AwAhEwQAAMsDACAGAADNAwAgBwAAzgMAIAkAAM8DACANAADQAwAgEAAA0QMAIBEAANIDACDdAQEArgMAIeIBQACwAwAh4wFAALADACH-AQEArgMAIf8BAQCuAwAhgAIgAMgDACGBAgEAvAMAIYMCAADJA4MCIoUCAADKA4UCIoYCIADIAwAhhwIgAMgDACGIAkAAvQMAIRMEAADlBAAgBQAA5gQAIAYAAOcEACAHAADoBAAgCQAA6QQAIBAAAOsEACARAADsBAAg3QEBAAAAAeIBQAAAAAHjAUAAAAAB_gEBAAAAAf8BAQAAAAGAAiAAAAABgQIBAAAAAYMCAAAAgwIChQIAAACFAgKGAiAAAAABhwIgAAAAAYgCQAAAAAECAAAA1AEAIB4AAOUFACAXCAAAiQUAIAsAAL8EACAQAADBBAAgEQAAwgQAIN0BAQAAAAHfAQAAAKECAuIBQAAAAAHjAUAAAAABhQIAAACgAgKHAiAAAAABiAJAAAAAAZoCAQAAAAGbAgEAAAABnAIBAAAAAZ0CAQAAAAGeAgAAvgQAIKECCAAAAAGiAgEAAAABowIgAAAAAaQCAgAAAAGlAiAAAAABpgIBAAAAAacCAQAAAAECAAAAEQAgHgAA5wUAIAMAAADXAQAgHgAA5QUAIB8AAOsFACAVAAAA1wEAIAQAAMsDACAFAADMAwAgBgAAzQMAIAcAAM4DACAJAADPAwAgEAAA0QMAIBEAANIDACAXAADrBQAg3QEBAK4DACHiAUAAsAMAIeMBQACwAwAh_gEBAK4DACH_AQEArgMAIYACIADIAwAhgQIBALwDACGDAgAAyQODAiKFAgAAygOFAiKGAiAAyAMAIYcCIADIAwAhiAJAAL0DACETBAAAywMAIAUAAMwDACAGAADNAwAgBwAAzgMAIAkAAM8DACAQAADRAwAgEQAA0gMAIN0BAQCuAwAh4gFAALADACHjAUAAsAMAIf4BAQCuAwAh_wEBAK4DACGAAiAAyAMAIYECAQC8AwAhgwIAAMkDgwIihQIAAMoDhQIihgIgAMgDACGHAiAAyAMAIYgCQAC9AwAhAwAAAA8AIB4AAOcFACAfAADuBQAgGQAAAA8AIAgAAIgFACALAACcBAAgEAAAngQAIBEAAJ8EACAXAADuBQAg3QEBAK4DACHfAQAAmAShAiLiAUAAsAMAIeMBQACwAwAhhQIAAJcEoAIihwIgAMgDACGIAkAAvQMAIZoCAQCuAwAhmwIBAK4DACGcAgEArgMAIZ0CAQCuAwAhngIAAJYEACChAggAmQQAIaICAQC8AwAhowIgAMgDACGkAgIAmgQAIaUCIADIAwAhpgIBAK4DACGnAgEArgMAIRcIAACIBQAgCwAAnAQAIBAAAJ4EACARAACfBAAg3QEBAK4DACHfAQAAmAShAiLiAUAAsAMAIeMBQACwAwAhhQIAAJcEoAIihwIgAMgDACGIAkAAvQMAIZoCAQCuAwAhmwIBAK4DACGcAgEArgMAIZ0CAQCuAwAhngIAAJYEACChAggAmQQAIaICAQC8AwAhowIgAMgDACGkAgIAmgQAIaUCIADIAwAhpgIBAK4DACGnAgEArgMAIQEDAAIJBAYDBQoEBgwFBw4BCRIGCgAODScJECgKESkMAQMAAgEDAAIBAwACBggAAgoADQsABw0YCRAcChEjDAIJEwYKAAgBCRQAAgMAAgwABgUIAAIKAAsMAAYOHQoPHgoBDx8AAgMAAgwABgMNJAAQJQARJgAGBCoABSsACSwADS0AEC4AES8AAAEDAAIBAwACAwoAEyQAFCUAFQAAAAMKABMkABQlABUAAAMKABokABslABwAAAADCgAaJAAbJQAcAwgAAgwABg5pCgMIAAIMAAYObwoDCgAhJAAiJQAjAAAAAwoAISQAIiUAIwIIAAILAAcCCAACCwAHBQoAKCQAKyUALFYAKVcAKgAAAAAABQoAKCQAKyUALFYAKVcAKgEDAAIBAwACAwoAMSQAMiUAMwAAAAMKADEkADIlADMAAAADCgA5JAA6JQA7AAAAAwoAOSQAOiUAOwIDAAIMAAYCAwACDAAGBQoAQCQAQyUARFYAQVcAQgAAAAAABQoAQCQAQyUARFYAQVcAQgAAAwoASSQASiUASwAAAAMKAEkkAEolAEsBAwACAQMAAgMKAFAkAFElAFIAAAADCgBQJABRJQBSAQMAAgEDAAIDCgBXJABYJQBZAAAAAwoAVyQAWCUAWQAAAAMKAF8kAGAlAGEAAAADCgBfJABgJQBhAgMAAgwABgIDAAIMAAYDCgBmJABnJQBoAAAAAwoAZiQAZyUAaBICARMwARQyARUzARY0ARg2ARk4Dxo5EBs7ARw9Dx0-ESA_ASFAASJBDyZEEidFFihHBylIBypLBytMByxNBy1PBy5RDy9SFzBUBzFWDzJXGDNYBzRZBzVaDzZdGTdeHThfCjlgCjphCjtiCjxjCj1lCj5nDz9oHkBrCkFtD0JuH0NwCkRxCkVyD0Z1IEd2JEh3Bkl4Bkp5Bkt6Bkx7Bk19Bk5_D0-AASVQggEGUYQBD1KFASZThgEGVIcBBlWIAQ9YiwEnWYwBLVqOAQVbjwEFXJEBBV2SAQVekwEFX5UBBWCXAQ9hmAEuYpoBBWOcAQ9knQEvZZ4BBWafAQVnoAEPaKMBMGmkATRqpgE1a6cBNWyqATVtqwE1bqwBNW-uATVwsAEPcbEBNnKzATVztQEPdLYBN3W3ATV2uAE1d7kBD3i8ATh5vQE8er4BDHu_AQx8wAEMfcEBDH7CAQx_xAEMgAHGAQ-BAccBPYIByQEMgwHLAQ-EAcwBPoUBzQEMhgHOAQyHAc8BD4gB0gE_iQHTAUWKAdUBAosB1gECjAHZAQKNAdoBAo4B2wECjwHdAQKQAd8BD5EB4AFGkgHiAQKTAeQBD5QB5QFHlQHmAQKWAecBApcB6AEPmAHrAUiZAewBTJoB7QEDmwHuAQOcAe8BA50B8AEDngHxAQOfAfMBA6AB9QEPoQH2AU2iAfgBA6MB-gEPpAH7AU6lAfwBA6YB_QEDpwH-AQ-oAYECT6kBggJTqgGDAgSrAYQCBKwBhQIErQGGAgSuAYcCBK8BiQIEsAGLAg-xAYwCVLIBjgIEswGQAg-0AZECVbUBkgIEtgGTAgS3AZQCD7gBlwJWuQGYAlq6AZoCW7sBmwJbvAGeAlu9AZ8CW74BoAJbvwGiAlvAAaQCD8EBpQJcwgGnAlvDAakCD8QBqgJdxQGrAlvGAawCW8cBrQIPyAGwAl7JAbECYsoBsgIJywGzAgnMAbQCCc0BtQIJzgG2AgnPAbgCCdABugIP0QG7AmPSAb0CCdMBvwIP1AHAAmTVAcECCdYBwgIJ1wHDAg_YAcYCZdkBxwJp"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AdminScalarFieldEnum: () => AdminScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  CommentScalarFieldEnum: () => CommentScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  IdeaScalarFieldEnum: () => IdeaScalarFieldEnum,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  MemberScalarFieldEnum: () => MemberScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  OtpLogScalarFieldEnum: () => OtpLogScalarFieldEnum,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  VoteScalarFieldEnum: () => VoteScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.6.0",
  engine: "75cbdc1eb7150937890ad5465d861175c6624711"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  admin: "admin",
  Category: "Category",
  Comment: "Comment",
  Idea: "Idea",
  member: "member",
  OtpLog: "OtpLog",
  Payment: "Payment",
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Vote: "Vote"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var AdminScalarFieldEnum = {
  id: "id",
  userId: "userId",
  name: "name",
  email: "email",
  profilePhoto: "profilePhoto",
  contactNumber: "contactNumber",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CommentScalarFieldEnum = {
  id: "id",
  content: "content",
  ideaId: "ideaId",
  authorId: "authorId",
  parentId: "parentId",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var IdeaScalarFieldEnum = {
  id: "id",
  title: "title",
  problemStatement: "problemStatement",
  proposedSolution: "proposedSolution",
  description: "description",
  images: "images",
  status: "status",
  type: "type",
  price: "price",
  rejectionFeedback: "rejectionFeedback",
  isPaid: "isPaid",
  viewCount: "viewCount",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  isPublished: "isPublished",
  authorId: "authorId",
  categoryId: "categoryId"
};
var MemberScalarFieldEnum = {
  id: "id",
  userId: "userId",
  name: "name",
  email: "email",
  profilePhoto: "profilePhoto",
  contactNumber: "contactNumber",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OtpLogScalarFieldEnum = {
  id: "id",
  email: "email",
  createdAt: "createdAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  amount: "amount",
  status: "status",
  transactionId: "transactionId",
  stripeEventId: "stripeEventId",
  invoiceUrl: "invoiceUrl",
  paymentGatewayData: "paymentGatewayData",
  ideaId: "ideaId",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  role: "role",
  status: "status",
  needPasswordChanges: "needPasswordChanges",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VoteScalarFieldEnum = {
  id: "id",
  type: "type",
  ideaId: "ideaId",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/config/env.ts
import dotenv from "dotenv";
dotenv.config();
var loadEnvironmentVariables = () => {
  [
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "PORT",
    "NODE_ENV",
    "ACCESS_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRESIN",
    "REFRESH_TOKEN_SECRET",
    "REFRESH_TOKEN_EXPIRESIN",
    "BETTER_AUTH_SESSION_TOKEN_SECRET",
    "BETTER_AUTH_SESSION_TOKEN_EXPIREIN",
    "BETTER_AUTH_SESSION_TOKEN_EXPIREIN_UPDATE",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_PASS",
    "CLIENT_ID",
    "CLIENT_SECRET",
    "CALLBACK_URL",
    "FRONTEND_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "STRIPE_PUBLISHABLE_KEY",
    "STRIPE_SECRET_KEY",
    "WEBHOOK_SIGNING_SECRET"
  ].forEach((variable) => {
    if (!process?.env?.[variable]) {
      throw new Error(
        `Environment variable ${variable} is required but not set in .env file`
      );
    }
  });
  return {
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRESIN: process.env.ACCESS_TOKEN_EXPIRESIN,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRESIN: process.env.REFRESH_TOKEN_EXPIRESIN,
    BETTER_AUTH_SESSION_TOKEN_SECRET: process.env.BETTER_AUTH_SESSION_TOKEN_SECRET,
    BETTER_AUTH_SESSION_TOKEN_EXPIREIN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIREIN,
    BETTER_AUTH_SESSION_TOKEN_EXPIREIN_UPDATE: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIREIN_UPDATE,
    EMAIL_SENDER_SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER,
    EMAIL_SENDER_SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS,
    EMAIL_SENDER_SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST,
    EMAIL_SENDER_SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CALLBACK_URL: process.env.CALLBACK_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    WEBHOOK_SIGNING_SECRET: process.env.WEBHOOK_SIGNING_SECRET
  };
};
var envVars = loadEnvironmentVariables();

// src/app/lib/auth.ts
import { bearer, emailOTP } from "better-auth/plugins";

// src/app/utils/email.ts
import nodemailer from "nodemailer";
import path2 from "path";
import ejs from "ejs";
var transporter = nodemailer.createTransport({
  host: envVars?.EMAIL_SENDER_SMTP_HOST,
  port: Number(envVars?.EMAIL_SENDER_SMTP_PORT),
  secure: true,
  auth: {
    user: envVars?.EMAIL_SENDER_SMTP_USER,
    pass: envVars?.EMAIL_SENDER_SMTP_PASS
  }
});
var sendEmail = async (emailPayload) => {
  const pathFile = await path2.join(
    process.cwd(),
    `src/app/template/${emailPayload?.templateName}.ejs`
  );
  const htmlElement = await ejs.renderFile(
    pathFile,
    emailPayload?.templateData
  );
  await transporter.sendMail({
    from: "<info@healthCare.com>",
    to: emailPayload?.to,
    subject: emailPayload?.subject,
    html: htmlElement
  });
};

// src/app/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  // baseURL: envVars.BETTER_AUTH_URL, 
  // secret:envVars.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true
    //   sendVerificationEmail: async ( { user, url, token }, request) => {
    // },
  },
  session: {
    expiresIn: 60 * 60 * 24,
    // = 86400 seconds
    updateAge: 60 * 60 * 24,
    cookieCache: {
      maxAge: 60 * 60 * 24
    }
  },
  socialProviders: {
    google: {
      clientId: envVars.CLIENT_ID,
      clientSecret: envVars.CLIENT_SECRET,
      mapProfileToUser: () => {
        return {
          emailVerified: true,
          role: Role.MEMBER,
          status: UserStatus.ACTIVE,
          needPasswordChanges: false,
          isDeleted: false
        };
      }
    }
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.MEMBER
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE
      },
      needPasswordChanges: {
        type: "boolean",
        defaultValue: false
      },
      isDeleted: {
        type: "boolean",
        defaultValue: false
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null
      }
    }
  },
  plugins: [
    bearer(),
    emailOTP({
      // overrideDefaultEmailVerification: true, 
      // async sendVerificationOTP({ email, otp, type }) {
      //   const user=await prisma.user.findUnique({where:{email:email}});
      //   if (!user) return ;
      //   if (type === "email-verification") {
      //     if(user && !user?.emailVerified){
      //       await  sendEmail({
      //         to: email,
      //         subject: "Email Verification",
      //         templateName: "emailVerification",
      //         templateData: { email:email, otp:otp },
      //       });
      //     }
      //   } else if(type === "forget-password") {
      //     if(user && (user?.status === UserStatus.ACTIVE) && !(user?.isDeleted)){
      //       await  sendEmail({
      //         to: email,
      //         subject: "Reset Password",
      //         templateName: "emailVerification",
      //         templateData: { email:email, otp:otp },
      //       });
      //     }
      //   }
      // },
      // otpLength: 6,
      // expiresIn: 60*2
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return;
        const lastSent = await prisma.otpLog.findFirst({
          where: { email },
          orderBy: { createdAt: "desc" }
        });
        const now = /* @__PURE__ */ new Date();
        if (lastSent) {
          const diff = (now.getTime() - lastSent.createdAt.getTime()) / 1e3;
          if (diff < 120) {
            throw new Error(`Please wait ${Math.ceil(120 - diff)} seconds before resending`);
          }
        }
        await prisma.otpLog.create({ data: { email } });
        if (type === "email-verification" && !user.emailVerified) {
          await sendEmail({
            to: email,
            subject: "Email Verification",
            templateName: "emailVerification",
            templateData: { email, otp }
          });
        } else if (type === "forget-password") {
          await sendEmail({
            to: email,
            subject: "Reset Password",
            templateName: "emailVerification",
            templateData: { email, otp }
          });
        }
      },
      otpLength: 6,
      expiresIn: 60 * 2
    })
  ],
  advanced: {
    useSecureCookies: false,
    cookies: {
      state: {
        attributes: {
          sameSite: "none",
          httpOnly: true,
          secure: true,
          path: "/"
        }
      },
      sessionToken: {
        attributes: {
          sameSite: "none",
          httpOnly: true,
          secure: true,
          path: "/"
        }
      }
    }
  }
});

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, jwtSecret, options) => {
  return jwt.sign(payload, jwtSecret, options);
};
var verifyToken = (token, jwtSecret) => {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return { success: true, data: decoded };
  } catch (error) {
    return {
      success: false,
      message: error?.message
    };
  }
};
var decodeToken = (token) => {
  return jwt.decode(token);
};
var jwtUtils = { createToken, verifyToken, decodeToken };

// src/app/utils/cookie.ts
var setCookie = async (res, key, value, options) => {
  return await res.cookie(key, value, options);
};
var getCookie = async (req, key) => {
  return await req.cookies[key];
};
var clearCookie = async (res, key, options) => {
  return await res.clearCookie(key, options);
};
var cookieUtils = { setCookie, getCookie, clearCookie };

// src/app/utils/token.ts
var generateAccessToken = (payload) => {
  console.log("payload", payload);
  return jwtUtils.createToken(payload, envVars.ACCESS_TOKEN_SECRET, {
    expiresIn: 60 * 60 * 24 * 1e3
  });
};
var generateRefreshToken = (payload) => {
  return jwtUtils.createToken(payload, envVars.REFRESH_TOKEN_SECRET, {
    expiresIn: 60 * 60 * 24 * 1e3 * 7
  });
};
var setGenerateAccessTokenCookie = async (res, accessToken) => {
  return await cookieUtils.setCookie(res, "accessToken", accessToken, {
    httpOnly: true,
    sameSite: "none",
    path: "/",
    secure: true,
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var setGenerateRereshTokenCookie = async (res, refreshToken) => {
  return await cookieUtils.setCookie(res, "refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    path: "/",
    secure: true,
    maxAge: 60 * 60 * 24 * 7 * 1e3
  });
};
var setBetterAuthSessionCookie = async (res, token) => {
  await cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    sameSite: "none",
    path: "/",
    secure: true,
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var tokenUtils = {
  generateAccessToken,
  generateRefreshToken,
  setGenerateAccessTokenCookie,
  setGenerateRereshTokenCookie,
  setBetterAuthSessionCookie
};

// src/config/cloude.config.ts
import { v2 as cloudinary } from "cloudinary";
import status from "http-status";
cloudinary.config({
  cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET
});
var uploadFileToCloudinary = async (buffer, fileName) => {
  console.log("fileName", fileName);
  if (!buffer || !fileName) {
    throw new AppError(status.BAD_REQUEST, "File buffer and file name are required for upload");
  }
  const extension = fileName.split(".").pop()?.toLocaleLowerCase();
  console.log("extension", extension);
  const fileNameWithoutExtension = fileName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
  const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
  const folder = extension === "pdf" ? "pdfs" : "images";
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        public_id: `ph-healthcare/${folder}/${uniqueName}`
        // folder : `ph-healthcare/${folder}`,
      },
      (error, result) => {
        if (error) {
          return reject(new AppError(status.INTERNAL_SERVER_ERROR, "Failed to upload file to Cloudinary"));
        }
        resolve(result);
      }
    ).end(buffer);
  });
};
var deleteFileFromCloudinary = async (file_url) => {
  console.log("file_url", file_url);
  const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
  const match = file_url.match(regex);
  let result;
  if (match && match[1]) {
    const publicId = match[1];
    result = await cloudinary.uploader.destroy(publicId);
  }
  if (result.result !== "ok") {
    throw new AppError(status.BAD_REQUEST, "Failed to delete file from cloudinary");
  }
  return result;
};
var cloudinaryUpload = cloudinary;

// src/app/modules/auth/auth.service.ts
var register = async (payload) => {
  const { name, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      needPasswordChanges: true,
      role: Role.MEMBER,
      status: UserStatus.ACTIVE
    }
  });
  if (!data.user) {
    throw new Error("Failed to register member");
  }
  try {
    const memberTx = await prisma.$transaction(async (tx) => {
      return await tx.member.create({
        data: { name, email, userId: data?.user?.id }
      });
    });
    return { ...data?.user, ...memberTx };
  } catch (error) {
    await prisma.user.delete({ where: { id: data?.user?.id } });
    throw error;
  }
};
var loginUser = async (payload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  });
  console.log("login data", data);
  const { token, user } = data;
  const tokenPayload = {
    email: user?.email,
    role: user?.role,
    id: user?.id,
    status: user?.status,
    isDeleted: user?.isDeleted,
    name: user?.name
  };
  const accessToken = await tokenUtils.generateAccessToken(
    tokenPayload
  );
  const refreshToken = await tokenUtils.generateRefreshToken(
    tokenPayload
  );
  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError(status2.FORBIDDEN, "User is blocked");
  }
  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError(status2.NOT_FOUND, "User is deleted");
  }
  return { data, accessToken, refreshToken, token };
};
var getProfile = async (user) => {
  const findUser = await prisma.user.findFirst({
    where: { id: user?.id, isDeleted: false },
    include: {
      admin: true,
      member: true
    }
  });
  if (!findUser) {
    throw new AppError(
      status2.UNAUTHORIZED,
      "Unauthrozied Access. You are not athorized here"
    );
  }
  return findUser;
};
var updateProfile = async (payload, user) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: user?.id, isDeleted: false },
    include: { admin: true, member: true }
  });
  if (!existingUser) {
    throw new AppError(status2.NOT_FOUND, "User not found");
  }
  console.log("authSerivce payload", payload);
  const result = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: user?.id },
      include: { admin: true, member: true },
      data: {
        ...payload.name && { name: payload.name },
        ...payload.image && { image: payload.image }
      }
    });
    const rolePayload = {
      ...payload.name && { name: payload.name },
      ...payload.image && { profilePhoto: payload.image },
      // ✅ payload.image দিয়ে profilePhoto
      ...payload.contactNumber && { contactNumber: payload.contactNumber }
    };
    if (user?.role === Role.ADMIN) {
      await tx.admin.upsert({
        where: { userId: user?.id },
        update: rolePayload,
        // ✅ শুধু দেওয়া fields update
        create: {
          userId: user?.id,
          name: payload.name ?? existingUser.name,
          // ✅ fallback
          email: existingUser.email,
          // ✅ required field
          ...payload.image && { profilePhoto: payload.image },
          ...payload.contactNumber && { contactNumber: payload.contactNumber }
        }
      });
    }
    if (user?.role === Role.MEMBER) {
      await tx.member.upsert({
        where: { userId: user?.id },
        update: rolePayload,
        // ✅ শুধু দেওয়া fields update
        create: {
          userId: user?.id,
          name: payload.name ?? existingUser.name,
          // ✅ fallback
          email: existingUser.email,
          // ✅ required field
          ...payload.image && { profilePhoto: payload.image },
          ...payload.contactNumber && { contactNumber: payload.contactNumber }
        }
      });
    }
    return updatedUser;
  });
  return result;
};
var getNewToken = async (refreshToken, sessionToken) => {
  const verifyRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET
  );
  if (!verifyRefreshToken?.success) {
    throw new AppError(
      status2.BAD_REQUEST,
      verifyRefreshToken?.message
    );
  }
  const user = verifyRefreshToken.data;
  console.log("user", user);
  const accessTokenNew = await tokenUtils.generateAccessToken({
    email: user?.email,
    role: user?.role,
    id: user?.id,
    status: user?.status,
    isDeleted: user?.isDeleted,
    name: user?.name
  });
  const refreshTokenNew = await tokenUtils.generateRefreshToken({
    email: user?.email,
    role: user?.role,
    id: user?.id,
    status: user?.status,
    isDeleted: user?.isDeleted,
    name: user?.name
  });
  const sessionExist = await prisma.session.findFirst({
    where: {
      token: sessionToken
    },
    include: {
      user: true
    }
  });
  console.log("sessionExist", sessionExist);
  if (!sessionExist) {
    throw new AppError(
      status2.UNAUTHORIZED,
      "Unauthorized Access. You are not authenticate here"
    );
  }
  const sessionTokenExpirationUpdate = await prisma.session.update({
    where: { token: sessionToken },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1e3 * 24),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  console.log("sessionTokenExpirationUpdate", sessionTokenExpirationUpdate);
  if (sessionTokenExpirationUpdate) {
    return {
      accessToken: accessTokenNew,
      refreshToken: refreshTokenNew,
      token: sessionToken
    };
  }
  return null;
};
var changePassword = async (payload, sessionToken) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!session) {
    throw new AppError(status2.UNAUTHORIZED, "Invalid session token");
  }
  const data = await auth.api.changePassword({
    body: {
      newPassword: payload?.newPassword,
      currentPassword: payload?.currentPassword,
      revokeOtherSessions: true
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (session.user.needPasswordChanges) {
    await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        needPasswordChanges: false
      }
    });
  }
  const tokenPayload = {
    email: data?.user?.email,
    role: data?.user?.role,
    id: data?.user?.id,
    status: data?.user?.status,
    isDeleted: data?.user?.isDeleted,
    name: data?.user?.name
  };
  const accessToken = await tokenUtils.generateAccessToken(
    tokenPayload
  );
  const refreshToken = await tokenUtils.generateRefreshToken(
    tokenPayload
  );
  console.log("password data", data);
  return { data, accessToken, refreshToken, token: data?.token };
};
var logOut = async (res, sessionToken) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  let accessTokenClear, refreshTokenClear, sessionTokenClear;
  if (result) {
    accessTokenClear = await cookieUtils.clearCookie(res, "accessToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true
    });
    refreshTokenClear = await cookieUtils.clearCookie(res, "refreshToken", {
      httpOnly: true,
      sameSite: "none",
      secure: true
    });
    sessionTokenClear = await cookieUtils.clearCookie(
      res,
      "better-auth.session_token",
      {
        httpOnly: true,
        sameSite: "none",
        secure: true
      }
    );
  }
  if (accessTokenClear && refreshTokenClear && sessionTokenClear) {
    return result;
  }
  return null;
};
var verifyEmail = async (payload) => {
  const isVerifiedUser = await prisma.user.findUnique({
    where: { email: payload?.email, emailVerified: true }
  });
  if (isVerifiedUser) {
    throw new Error("User is already verified");
  }
  const result = await auth.api.verifyEmailOTP({
    body: {
      email: payload?.email,
      otp: payload?.otp
    }
  });
  if (result?.status && !result?.user?.emailVerified) {
    await prisma.user.update({
      where: { email: payload?.email },
      data: { emailVerified: true }
    });
  }
  console.log("emailVerified Result", result);
  return result;
};
var requestPasswordReset = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) {
    throw new AppError(status2.UNAUTHORIZED, "User not found");
  }
  if (!user?.emailVerified) {
    throw new AppError(status2.BAD_REQUEST, "User Email not verified");
  }
  if (user.status !== UserStatus.ACTIVE || user.isDeleted) {
    throw new AppError(
      status2.NOT_FOUND,
      "User is not eligible for password reset"
    );
  }
  const data = await auth.api.requestPasswordResetEmailOTP({
    body: { email }
  });
  return data;
};
var resetPassword = async (payload) => {
  const user = await prisma.user.findUnique({
    where: { email: payload?.email }
  });
  if (!user) {
    throw new AppError(status2.UNAUTHORIZED, "User not found");
  }
  if (!user?.emailVerified) {
    throw new AppError(status2.BAD_REQUEST, "User Email not verified");
  }
  if (user.status !== UserStatus.ACTIVE || user.isDeleted) {
    throw new AppError(
      status2.NOT_FOUND,
      "User is not eligible for password reset"
    );
  }
  const data = await auth.api.resetPasswordEmailOTP({
    body: {
      email: payload?.email,
      otp: payload?.otp,
      password: payload?.password
    }
  });
  if (data) {
    await prisma.session.deleteMany({ where: { userId: user?.id } });
  }
  if (user?.needPasswordChanges) {
    await prisma.user.update({
      where: { id: user?.id },
      data: { needPasswordChanges: false }
    });
  }
  return data;
};
var googleSuccess = async (user) => {
  console.log("user", user);
  const findPatient = await prisma.member.findUnique({
    where: { userId: user?.id }
  });
  let createPatient;
  if (user?.id) {
    const accessToken = await tokenUtils.generateAccessToken(
      user
    );
    const refreshToken = await tokenUtils.generateRefreshToken(
      user
    );
    return { accessToken, refreshToken };
  }
  return null;
};
var deleteAuthFile = async (filePath, user) => {
  const result = await deleteFileFromCloudinary(filePath);
  let userUpdate, adminUpdate, memberUpdate;
  if (result) {
    userUpdate = await prisma.user.update({
      where: { id: user?.id },
      data: { image: null }
    });
    if (user?.role === "ADMIN") {
      adminUpdate = await prisma.admin.update({
        where: { userId: user?.id },
        data: { profilePhoto: null }
      });
    }
    if (user?.role === "MEMBER") {
      memberUpdate = await prisma.member.update({
        where: { userId: user?.id },
        data: { profilePhoto: null }
      });
    }
  }
  return { data: { ...result, user: userUpdate, admin: adminUpdate, member: memberUpdate } };
};
var AuthService = {
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

// src/app/shared/sendResponse.ts
var sendResponse = async (res, responseData) => {
  const { httpStatusCode, ...responses } = responseData;
  return res.status(httpStatusCode).json(
    responses
  );
};

// src/app/modules/auth/auth.controller.ts
import status3 from "http-status";
import "ejs";
import path3 from "path";
var register2 = catchAsyncHandler(
  async (req, res) => {
    const payload = req.body;
    const result = await AuthService.register(payload);
    sendResponse(res, {
      httpStatusCode: status3.CREATED,
      success: true,
      message: "Patient registered successfully",
      data: result
    });
  }
);
var loginUser2 = catchAsyncHandler(async (req, res) => {
  const payload = req.body;
  const { data, accessToken, refreshToken, token } = await AuthService.loginUser(payload);
  tokenUtils.setGenerateAccessTokenCookie(res, accessToken);
  tokenUtils.setGenerateRereshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  return await sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "User logged in successfully",
    data: { accessToken, refreshToken, token, user: data?.user }
  });
});
var getProfile2 = catchAsyncHandler(
  async (req, res, next) => {
    const user = await req.user;
    const result = await AuthService.getProfile(user);
    return await sendResponse(res, {
      httpStatusCode: status3.OK,
      success: true,
      message: "Get profile successfully",
      data: result
    });
  }
);
var getNewToken2 = catchAsyncHandler(async (req, res) => {
  const getSessionToken = await cookieUtils.getCookie(
    req,
    "better-auth.session_token"
  );
  const getRefreshToken = await cookieUtils.getCookie(req, "refreshToken");
  if (!getRefreshToken) {
    throw new AppError(status3.UNAUTHORIZED, "Refreshtoken is missing");
  }
  const result = await AuthService.getNewToken(
    getRefreshToken,
    getSessionToken
  );
  if (!result) {
    throw new Error("Failed to generate access token by refresh token");
  }
  const { accessToken, refreshToken, token } = result;
  tokenUtils.setGenerateAccessTokenCookie(res, accessToken);
  tokenUtils.setGenerateRereshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken,
      sessionToken: token
    }
  });
});
var changePassword2 = catchAsyncHandler(
  async (req, res, next) => {
    const payload = await req?.body;
    const getSessionToken = await cookieUtils.getCookie(
      req,
      "better-auth.session_token"
    );
    const { data, accessToken, refreshToken, token } = await AuthService.changePassword(payload, getSessionToken);
    tokenUtils.setGenerateAccessTokenCookie(res, accessToken);
    tokenUtils.setGenerateRereshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    if (data) {
      return sendResponse(res, {
        success: true,
        httpStatusCode: status3.OK,
        message: "password changed successfully",
        data
      });
    }
  }
);
var logOut2 = catchAsyncHandler(async (req, res) => {
  const sessionToken = await cookieUtils.getCookie(
    req,
    "better-auth.session_token"
  );
  const result = await AuthService.logOut(res, sessionToken);
  return await sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "User logged out successfully",
    data: result
  });
});
var verifyEmail2 = catchAsyncHandler(
  async (req, res, next) => {
    const payload = await req?.body;
    const result = await AuthService.verifyEmail(payload);
    return sendResponse(res, {
      httpStatusCode: status3.OK,
      success: true,
      message: "Email verified successfully",
      data: result
    });
  }
);
var requestPasswordReset2 = catchAsyncHandler(
  async (req, res, next) => {
    const { email } = await req?.body;
    const result = await AuthService.requestPasswordReset(email);
    if (result) {
      return await sendResponse(res, {
        httpStatusCode: status3.OK,
        success: true,
        message: "Please eheck your OTP into your email",
        data: result
      });
    }
  }
);
var resetPasswordReset = catchAsyncHandler(
  async (req, res, next) => {
    const payload = await req?.body;
    const result = await AuthService.resetPassword(payload);
    await sendResponse(res, {
      httpStatusCode: status3.OK,
      success: true,
      message: "password reset Successfully",
      data: null
    });
  }
);
var googleLogin = catchAsyncHandler(
  async (req, res) => {
    const redirectURLPath = req.query["redirectURLPath"] || "/dashboard";
    const filterRedirectURLPath = encodeURIComponent(redirectURLPath);
    const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirectURLPath=${filterRedirectURLPath}`;
    const pathURL = path3.join(
      process.cwd(),
      `src/app/template/googleRedirect.ejs`
    );
    res.render(pathURL, {
      betterAuthURL: envVars.BETTER_AUTH_URL,
      callbackURL
    });
  }
);
var googleSuccess2 = catchAsyncHandler(
  async (req, res, next) => {
    const redirectURLPath = req?.query["redirectURLPath"];
    const sessionToken = await cookieUtils.getCookie(req, "better-auth.session_token");
    console.log("sessionToken", sessionToken);
    if (!sessionToken) {
      res.redirect(`${envVars.FRONTEND_URL}/login?error=oAuth_failed`);
    }
    const session = await auth.api.getSession({
      headers: {
        "Cookie": `better-auth.session_token=${sessionToken}`
      }
    });
    console.log("session", session);
    if (!session) {
      return res.redirect(`${envVars.FRONTEND_URL}/login?error=session_not_found`);
    }
    if (session && !session?.user) {
      return res.redirect(`${envVars.FRONTEND_URL}/login?error=user_not_found`);
    }
    const createPatient = await AuthService.googleSuccess(session?.user);
    if (createPatient) {
      tokenUtils.setGenerateAccessTokenCookie(res, createPatient?.accessToken);
      tokenUtils.setGenerateRereshTokenCookie(res, createPatient?.refreshToken);
      tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
      return res.redirect(`${envVars.FRONTEND_URL}${redirectURLPath}`);
    }
  }
);
var handlerOauthError = catchAsyncHandler(
  async (req, res, next) => {
    const error = req?.query["error"] || "oAuth_failed";
    res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
  }
);
var resendOtp = async (req, res) => {
  try {
    const { email, type } = req.body;
    if (!email || !type) {
      return res.status(400).json({ success: false, message: "Email and type are required" });
    }
    const response = await auth.api.sendVerificationOTP({
      body: {
        email,
        type
      }
    });
    console.log("resend otp response", response);
    if (response?.success) {
      return res.status(200).json({ success: true, data: [], message: "OTP resent successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: error?.message, success: false });
  }
};
var updateProfile2 = catchAsyncHandler(async (req, res, next) => {
  const parseData = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body.data;
  const payload = { ...parseData, image: req?.file?.path };
  const response = await AuthService.updateProfile(payload, req?.user);
  return sendResponse(res, {
    success: true,
    message: "Profile Updated Successfully",
    data: response,
    httpStatusCode: 200
  });
});
var deleteAuthFile2 = catchAsyncHandler(async (req, res) => {
  const { filePath } = req.body;
  const user = await req.user;
  const result = await AuthService.deleteAuthFile(filePath, user);
  if (result) {
    sendResponse(res, {
      success: true,
      message: "File deleted successfully",
      httpStatusCode: 200,
      data: []
    });
  }
});
var AuthController = {
  register: register2,
  loginUser: loginUser2,
  getProfile: getProfile2,
  getNewToken: getNewToken2,
  changePassword: changePassword2,
  logOut: logOut2,
  verifyEmail: verifyEmail2,
  requestPasswordReset: requestPasswordReset2,
  resetPasswordReset,
  googleLogin,
  googleSuccess: googleSuccess2,
  resendOtp,
  updateProfile: updateProfile2,
  deleteAuthFile: deleteAuthFile2
};

// src/app/middleware/checkAuth.ts
import status4 from "http-status";
var checkAuth = (...AuthRole) => {
  return async (req, res, next) => {
    try {
      const sessionToken = await cookieUtils.getCookie(req, "better-auth.session_token");
      if (!sessionToken) {
        throw new Error("Unauthorized access! No session token provided.");
      }
      if (sessionToken) {
        const sessionExistUser = await prisma.session.findFirst({
          where: { token: sessionToken, expiresAt: { gt: /* @__PURE__ */ new Date() } },
          include: { user: true }
        });
        if (sessionExistUser && sessionExistUser?.user) {
          const expireTime = new Date(sessionExistUser?.expiresAt).getTime();
          const createTime = new Date(sessionExistUser?.createdAt).getTime();
          const now = (/* @__PURE__ */ new Date()).getTime();
          const sessionLifeTime = expireTime - createTime;
          const sessionRemainTime = expireTime - now;
          const percentageTime = sessionRemainTime / sessionLifeTime * 100;
          if (percentageTime < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expireTime.toString());
            res.setHeader("X-Session-Remaining-Time", sessionRemainTime.toString());
          }
          if (!sessionRemainTime) {
            throw new AppError(status4.UNAUTHORIZED, "Session time has been expired");
          }
          if (sessionExistUser?.user?.status === (UserStatus.BLOCKED || UserStatus.DELETED)) {
            throw new AppError(status4.UNAUTHORIZED, "Unauthorized Access. User is not active");
          }
          if (sessionExistUser?.user?.isDeleted) {
            throw new AppError(status4.UNAUTHORIZED, "Unauthorized Access. User is deleted");
          }
          if (AuthRole.length > 0 && !AuthRole.includes(sessionExistUser?.user?.role)) {
            throw new AppError(status4.FORBIDDEN, "Forbidden User. You do not have permission to access this resources");
          }
        }
      }
      const accessToken = await cookieUtils.getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError(status4.UNAUTHORIZED, "Unauthorized Access. No access token provided here");
      }
      const accessTokenPayload = await jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
      if (!accessTokenPayload?.success) {
        throw new AppError(status4.UNAUTHORIZED, accessTokenPayload?.message);
      }
      req.user = accessTokenPayload.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

// src/app/modules/auth/auth.validation.ts
import z from "zod";
var changePasswordSchema = z.object({
  newPassword: z.string("newPassword is required").min(8, "Minimum lenth will be 8 characters").max(20, "Maximum length can be 20 characters"),
  currentPassword: z.string("currentPassword is required").min(8, "Minimum lenth will be 8 characters").max(20, "Maximum length can be 20 characters")
});
var authValidationSchema = { changePasswordSchema };

// src/app/middleware/validationRequest.ts
var validationRequest = (zodSchema) => {
  return async (req, res, next) => {
    if (req?.body?.data) {
      req.body = JSON.parse(req?.body?.data);
    }
    const parsedSchema = await zodSchema.safeParse(req.body);
    if (!parsedSchema?.success) {
      return next(parsedSchema?.error);
    }
    req.body = parsedSchema.data;
    return next();
  };
};

// src/config/multer.config.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
var storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    console.log("filename", file.originalname);
    const originalName = file.originalname;
    const extension = originalName.split(".").pop();
    const fileNameWithoutExtension = originalName.split(".").slice(0, -1).join("-").toLowerCase().replace(/[^a-z0-9\-]/g, "");
    const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
    const folder = extension === "pdf" ? "pdfs" : "images";
    return {
      folder: `ph-healthcare/${folder}`,
      public_id: uniqueName,
      format: extension
    };
  }
});
var multerUpload = multer({ storage });

// src/app/modules/auth/auth.route.ts
var router = Router();
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
router.get("/logOut", checkAuth(Role.ADMIN, Role.MEMBER), AuthController.logOut);
router.post("/resend-otp", AuthController.resendOtp);
router.post("/verify-email", AuthController.verifyEmail);
router.post("/sendOtp", AuthController.requestPasswordReset);
router.post("/resetPassword", AuthController.resetPasswordReset);
router.get("/login/google", AuthController.googleLogin);
router.get("/google/success", AuthController.googleSuccess);
router.patch("/update-profile", checkAuth(Role.ADMIN, Role.MEMBER), multerUpload.single("file"), AuthController.updateProfile);
router.post("/delete", checkAuth(Role.ADMIN, Role.MEMBER), AuthController.deleteAuthFile);
var AuthRoutes = router;

// src/app/modules/user/user.route.ts
import { Router as Router2 } from "express";

// src/app/modules/user/user.service.ts
import "http-status";
var createAdmin = async (payload) => {
  const { password, admin } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: { email: admin?.email }
  });
  if (isUserExist) {
    throw new Error(`User already exist as a ${isUserExist?.role}`);
  }
  const createUser = await auth.api.signUpEmail({
    body: {
      name: admin?.name,
      email: admin?.email,
      password,
      needPasswordChanges: true,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE
    }
  });
  if (!createUser?.user?.id) {
    throw new Error("Failed to create admin as user into user model");
  }
  try {
    const result = await prisma.$transaction(async (tx) => {
      const createAdmin3 = await tx.admin.create({
        data: { userId: createUser?.user?.id, ...admin }
      });
      return await tx.admin.findUnique({
        where: { id: createAdmin3?.id },
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
              status: true
            }
          }
        }
      });
    });
    return result;
  } catch (error) {
    await prisma.user.delete({ where: { id: createUser?.user?.id } });
    return;
  }
};
var userService = { createAdmin };

// src/app/modules/user/user.controller.ts
import status6 from "http-status";
var createAdmin2 = catchAsyncHandler(async (req, res) => {
  const payload = await req.body;
  const data = await userService.createAdmin(payload);
  if (data) {
    return await sendResponse(res, {
      httpStatusCode: status6.CREATED,
      success: true,
      message: "Admin registred successfully",
      data
    });
  }
  throw new Error("Admin registration failed");
});
var userController = { createAdmin: createAdmin2 };

// src/app/modules/user/user.validation.ts
import z2 from "zod";
var CreateAdminSchema = z2.object({
  password: z2.string("Password is required").min(8, "Minimum lenth will be 8 characters").max(20, "Maximum length can be 20 characters"),
  admin: z2.object({
    name: z2.string().min(1, "Name is required"),
    email: z2.email("Invalid email format"),
    profilePhoto: z2.url("Invalid URL format").optional(),
    contactNumber: z2.string().min(1, "Contact number is required")
  })
});
var userValidationSchema = { CreateAdminSchema };

// src/app/modules/user/user.route.ts
var router2 = Router2();
router2.post(
  "/create-admin",
  validationRequest(userValidationSchema.CreateAdminSchema),
  userController.createAdmin
);
var userRoutes = router2;

// src/app/modules/idea/category/category.route.ts
import { Router as Router3 } from "express";

// src/app/modules/idea/category/category.controller.ts
import { status as status8 } from "http-status";

// src/app/modules/idea/category/category.service.ts
import { status as status7 } from "http-status";
var createCategory = async (payload) => {
  const existing = await prisma.category.findUnique({
    where: { name: payload.name }
  });
  if (existing) {
    throw new AppError(status7.CONFLICT, "Category already exists");
  }
  const category = await prisma.category.create({
    data: {
      name: payload.name,
      description: payload.description
    }
  });
  return category;
};
var getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" }
  });
  return categories;
};
var getCategoryById = async (id) => {
  const categories = await prisma.category.findUnique({
    where: { id, isDeleted: false }
  });
  return categories;
};
var updateCategory = async (id, payload) => {
  const existing = await prisma.category.findUnique({
    where: { id, isDeleted: false }
  });
  if (!existing) {
    throw new AppError(status7.NOT_FOUND, "Category not found");
  }
  if (payload.name && payload.name !== existing.name) {
    const duplicate = await prisma.category.findUnique({
      where: { name: payload.name }
    });
    if (duplicate) {
      throw new AppError(status7.CONFLICT, "Category name already exists");
    }
  }
  const updated = await prisma.category.update({
    where: { id },
    data: {
      ...payload.name && { name: payload.name },
      ...payload.description && { description: payload.description }
    }
  });
  return updated;
};
var deleteCategory = async (id) => {
  const existing = await prisma.category.findUnique({
    where: { id, isDeleted: false }
  });
  if (!existing) {
    throw new AppError(status7.NOT_FOUND, "Category not found");
  }
  const deleted = await prisma.category.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return deleted;
};
var categoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryById
};

// src/app/modules/idea/category/category.controller.ts
var createCategory2 = catchAsyncHandler(async (req, res) => {
  const result = await categoryService.createCategory(req.body);
  return sendResponse(res, {
    httpStatusCode: status8.CREATED,
    success: true,
    message: "Category created successfully",
    data: result
  });
});
var getAllCategories2 = catchAsyncHandler(async (req, res) => {
  const result = await categoryService.getAllCategories();
  return sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Categories fetched successfully",
    data: result
  });
});
var getCategoryById2 = catchAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await categoryService.getCategoryById(id);
  return sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Category fetched successfully",
    data: result
  });
});
var updateCategory2 = catchAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await categoryService.updateCategory(id, req.body);
  return sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Category updated successfully",
    data: result
  });
});
var deleteCategory2 = catchAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await categoryService.deleteCategory(id);
  return sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Category deleted successfully",
    data: result
  });
});
var categoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2,
  getCategoryById: getCategoryById2
};

// src/app/modules/idea/category/category.route.ts
var router3 = Router3();
router3.get("/", categoryController.getAllCategories);
router3.post("/", checkAuth(Role.ADMIN), categoryController.createCategory);
router3.patch("/:id", checkAuth(Role.ADMIN), categoryController.updateCategory);
router3.delete("/:id", checkAuth(Role.ADMIN), categoryController.deleteCategory);
router3.get("/:id", checkAuth(Role.ADMIN), categoryController.getCategoryById);
var categoryRoutes = router3;

// src/app/modules/idea/idea.route.ts
import { Router as Router4 } from "express";

// src/app/modules/idea/idea.validation.ts
import { z as z3 } from "zod";
var createIdeaSchema = z3.object({
  title: z3.string().min(5, "Title must be at least 5 characters"),
  problemStatement: z3.string().min(10, "Problem statement is required"),
  proposedSolution: z3.string().min(10, "Proposed solution is required"),
  description: z3.string().min(20, "Description is required"),
  images: z3.array(z3.string().url()).optional(),
  type: z3.nativeEnum(IdeaType).optional(),
  price: z3.number().positive().optional(),
  categoryId: z3.string().uuid("Invalid category"),
  isPublished: z3.boolean().optional()
});
var updateIdeaSchema = z3.object({
  title: z3.string().min(5).optional(),
  problemStatement: z3.string().min(10).optional(),
  proposedSolution: z3.string().min(10).optional(),
  description: z3.string().min(20).optional(),
  images: z3.array(z3.string().url()).optional(),
  existingImages: z3.array(z3.string().url()).optional(),
  type: z3.nativeEnum(IdeaType).optional(),
  price: z3.number().positive().optional(),
  categoryId: z3.string().uuid().optional(),
  isPublished: z3.boolean().optional(),
  status: z3.nativeEnum(IdeaStatus)
});
var rejectIdeaSchema = z3.object({
  rejectionFeedback: z3.string().min(10, "Feedback must be at least 10 characters")
});
var ideaValidationSchema = {
  createIdeaSchema,
  updateIdeaSchema,
  rejectIdeaSchema
};

// src/app/modules/idea/idea.middleware.ts
var ideaUploadMiddleware = (req, res, next) => {
  if (req?.body?.data) {
    req.body = JSON.parse(req.body.data);
  }
  const files = req?.files;
  const existingImages = req.body.existingImages || [];
  const hasNewImages = Array.isArray(files?.images) && files.images.length > 0;
  if (hasNewImages) {
    const newImages = (files.images ?? []).map((file) => file.path);
    req.body.images = [...existingImages, ...newImages];
  } else {
    req.body.images = existingImages.length > 0 ? existingImages : void 0;
  }
  delete req.body.existingImages;
  next();
};

// src/app/modules/idea/idea.controller.ts
import { status as status11 } from "http-status";

// src/app/modules/idea/idea.service.ts
import { status as status10 } from "http-status";

// src/app/utils/queryBuilder.ts
import status9 from "http-status";
var QueryBuilder = class {
  query;
  model;
  page;
  skip;
  take;
  sortBy;
  sortOrder;
  orderBy = {};
  searchCondition = [];
  numberSearchFields = [];
  stringSearchFields = [];
  searchItem;
  filterCondition = [];
  include = {};
  singleRelations = [];
  booleanFields = [];
  constructor(query, model, numberSearchFields, stringSearchFields, booleanFields, singleRelations) {
    this.query = query;
    this.model = model;
    this.page = Number(this.query?.page) || 1;
    this.take = Number(this.query?.limit) || 10;
    this.skip = (this.page - 1) * this.take;
    this.sortOrder = this.query?.sortOrder ?? "desc";
    this.sortBy = this.query.sortBy || "createdAt";
    this.numberSearchFields = numberSearchFields || [];
    this.stringSearchFields = stringSearchFields || [];
    this.searchItem = this.query?.searchTerm || void 0;
    this.singleRelations = singleRelations || [];
    this.booleanFields = booleanFields || [];
  }
  parseValue(value) {
    if (value === "true") return true;
    if (value === "false") return false;
    const numericValue = Number(value);
    if (!isNaN(numericValue) && value !== "") return numericValue;
    return value;
  }
  // innermost field value বানায় — bracketMatch, array, normal সব handle করে
  buildFieldValue(actualField, value, bracketMatch) {
    if (bracketMatch) {
      const [, fieldName, operator] = bracketMatch;
      return {
        [fieldName]: {
          [operator]: this.parseValue(value)
        }
      };
    }
    if (Array.isArray(value)) {
      return {
        [actualField]: { in: value.map((v) => this.parseValue(v)) }
      };
    }
    return {
      [actualField]: this.parseValue(value)
    };
  }
  sort() {
    const parts = this.sortBy.split(".");
    if (parts.length > 2) {
      throw new AppError(status9.BAD_REQUEST, "Sorting only works with two levels of nesting");
    }
    if (parts.length === 2) {
      const [relation, field] = parts;
      this.orderBy = { [relation]: { [field]: this.sortOrder } };
    } else {
      this.orderBy = { [this.sortBy]: this.sortOrder };
    }
  }
  // search() {
  //   if (this.searchItem) {
  //     const numericValue = Number(this.searchItem);
  //     if (!isNaN(numericValue)) {
  //       this.numberSearchFields?.forEach((item: string) => {
  //         if (item.includes(".")) {
  //           const exactFieldofSearch = item.split(".");
  //           if (exactFieldofSearch.length === 3) {
  //             const [relation, subRelation, field] = exactFieldofSearch;
  //             this.searchCondition.push({
  //               [relation as string]: {
  //                 some: {
  //                   [subRelation as string]: {
  //                     [field as string]: Number(this.searchItem),
  //                   },
  //                 },
  //               },
  //             });
  //           } else if (exactFieldofSearch.length === 2) {
  //             const [relation, field] = exactFieldofSearch;
  //             this.searchCondition.push({
  //               [relation as string]: { [field as string]: Number(this.searchItem) },
  //             });
  //           }
  //         }
  //         this.searchCondition.push({ [item as string]: Number(this.searchItem) });
  //       });
  //     } else {
  //       this.stringSearchFields?.forEach((item: string) => {
  //         if (item.includes(".")) {
  //           const exactFieldofSearch = item.split(".");
  //           if (exactFieldofSearch.length === 3) {
  //             const [relation, subRelation, field] = exactFieldofSearch;
  //             this.searchCondition.push({
  //               [relation as string]: {
  //                 some: {
  //                   [subRelation as string]: {
  //                     [field as string]: {
  //                       contains: this.searchItem as string,
  //                       mode: "insensitive",
  //                     },
  //                   },
  //                 },
  //               },
  //             });
  //           } else if (exactFieldofSearch.length === 2) {
  //             const [relation, field] = exactFieldofSearch;
  //             this.searchCondition.push({
  //               [relation as string]: {
  //                 [field as string]: {
  //                   contains: this.searchItem as string,
  //                   mode: "insensitive",
  //                 },
  //               },
  //             });
  //           }
  //         } else if (!item.includes(".")) {
  //           this.searchCondition.push({
  //             [item as string]: {
  //               contains: this.searchItem as string,
  //               mode: "insensitive",
  //             },
  //           });
  //         }
  //       });
  //     }
  //   }
  // }
  search() {
    if (!this.searchItem) return;
    const numericValue = Number(this.searchItem);
    const isBooleanValue = this.searchItem === "true" || this.searchItem === "false";
    if (!isNaN(numericValue) && !isBooleanValue) {
      this.numberSearchFields?.forEach((item) => {
        if (item.includes(".")) {
          const parts = item.split(".");
          if (parts.length === 3) {
            const [relation, subRelation, field] = parts;
            const relUsesSome = !this.singleRelations.includes(relation);
            const subUsesSome = !this.singleRelations.includes(subRelation);
            const innerValue = { [field]: numericValue };
            const subLevel = subUsesSome ? { some: innerValue } : innerValue;
            this.searchCondition.push({
              [relation]: relUsesSome ? { some: { [subRelation]: subLevel } } : { [subRelation]: subLevel }
            });
          } else if (parts.length === 2) {
            const [relation, field] = parts;
            const relUsesSome = !this.singleRelations.includes(relation);
            const innerValue = { [field]: numericValue };
            this.searchCondition.push({
              [relation]: relUsesSome ? { some: innerValue } : innerValue
            });
          }
        } else {
          this.searchCondition.push({ [item]: numericValue });
        }
      });
    }
    if (isBooleanValue) {
      const boolValue = this.searchItem === "true";
      this.booleanFields?.forEach((item) => {
        if (item.includes(".")) {
          const parts = item.split(".");
          if (parts.length === 3) {
            const [relation, subRelation, field] = parts;
            const relUsesSome = !this.singleRelations.includes(relation);
            const subUsesSome = !this.singleRelations.includes(subRelation);
            const innerValue = { [field]: boolValue };
            const subLevel = subUsesSome ? { some: innerValue } : innerValue;
            this.searchCondition.push({
              [relation]: relUsesSome ? { some: { [subRelation]: subLevel } } : { [subRelation]: subLevel }
            });
          } else if (parts.length === 2) {
            const [relation, field] = parts;
            const relUsesSome = !this.singleRelations.includes(relation);
            const innerValue = { [field]: boolValue };
            this.searchCondition.push({
              [relation]: relUsesSome ? { some: innerValue } : innerValue
            });
          }
        } else {
          this.searchCondition.push({ [item]: boolValue });
        }
      });
    }
    if (isNaN(numericValue) && !isBooleanValue) {
      this.stringSearchFields?.forEach((item) => {
        if (item.includes(".")) {
          const parts = item.split(".");
          if (parts.length === 3) {
            const [relation, subRelation, field] = parts;
            const relUsesSome = !this.singleRelations.includes(relation);
            const subUsesSome = !this.singleRelations.includes(subRelation);
            const innerValue = { [field]: { contains: this.searchItem, mode: "insensitive" } };
            const subLevel = subUsesSome ? { some: innerValue } : innerValue;
            this.searchCondition.push({
              [relation]: relUsesSome ? { some: { [subRelation]: subLevel } } : { [subRelation]: subLevel }
            });
          } else if (parts.length === 2) {
            const [relation, field] = parts;
            const relUsesSome = !this.singleRelations.includes(relation);
            const innerValue = { [field]: { contains: this.searchItem, mode: "insensitive" } };
            this.searchCondition.push({
              [relation]: relUsesSome ? { some: innerValue } : innerValue
            });
          }
        } else {
          this.searchCondition.push({
            [item]: { contains: this.searchItem, mode: "insensitive" }
          });
        }
      });
    }
  }
  filter() {
    const excludedField = [
      "searchTerm",
      "page",
      "limit",
      "sortBy",
      "sortOrder",
      "fields",
      "include"
    ];
    Object.keys(this.query).forEach((field) => {
      if (excludedField.includes(field)) return;
      const value = this.query[field];
      const parts = field.split(".");
      if (parts.length === 3) {
        const [relation, subRelation, actualField] = parts;
        const bracketMatch = actualField?.match(/^(.+)\[(gt|lt|gte|lte|equals)\]$/) ?? null;
        const fieldValue = this.buildFieldValue(actualField, value, bracketMatch);
        const subUsesSome = !this.singleRelations.includes(subRelation);
        const subLevel = subUsesSome ? { some: fieldValue } : fieldValue;
        const relUsesSome = !this.singleRelations.includes(relation);
        this.filterCondition.push({
          [relation]: relUsesSome ? { some: { [subRelation]: subLevel } } : { [subRelation]: subLevel }
          // schedule: { appointments: {...} }
        });
      } else if (parts.length === 2) {
        const [relation, actualField2] = parts;
        const bracketMatch = actualField2?.match(/^(.+)\[(gt|lt|gte|lte|equals)\]$/) ?? null;
        const fieldValue = this.buildFieldValue(actualField2, value, bracketMatch);
        const relUsesSome = !this.singleRelations.includes(relation);
        this.filterCondition.push({
          [relation]: relUsesSome ? { some: fieldValue } : fieldValue
          // schedule: { startDateTime: "..." }
        });
      } else if (!field.includes(".")) {
        const bracketMatch = field.match(/^(.+)\[(gt|lt|gte|lte|equals)\]$/) ?? null;
        if (bracketMatch) {
          const [, actualField, operator] = bracketMatch;
          this.filterCondition.push({
            [actualField]: {
              [operator]: this.parseValue(value)
            }
          });
        } else if (Array.isArray(value)) {
          this.filterCondition.push({
            [field]: { in: value.map((v) => this.parseValue(v)) }
          });
        } else {
          this.filterCondition.push({
            [field]: this.parseValue(value)
          });
        }
      }
    });
  }
  dynamicInclude() {
    if (this.query?.include) {
      const includeAllFields = this.query.include.split(",").map((item) => item.trim());
      includeAllFields.forEach((item) => {
        const includeSubFields = item.split(".");
        if (includeSubFields.length === 2) {
          const [firstField, secondField] = includeSubFields;
          this.include = {
            ...this.include,
            [firstField]: { include: { [secondField]: true } }
          };
        } else {
          this.include = { ...this.include, [item]: true };
        }
      });
    }
  }
  callAll() {
    this.sort();
    if (this.searchItem) {
      this.search();
    }
    this.filter();
    this.dynamicInclude();
  }
  fetch = async () => {
    const delegate = prisma[this.model];
    if (!delegate || typeof delegate.findMany !== "function") {
      throw new AppError(
        status9.BAD_REQUEST,
        `"${this.model}" \u09A8\u09BE\u09AE\u09C7 \u0995\u09CB\u09A8\u09CB prisma model \u09AA\u09BE\u0993\u09AF\u09BC\u09BE \u09AF\u09BE\u09AF\u09BC\u09A8\u09BF`
      );
    }
    const whereCondition = {
      ...this.searchCondition.length > 0 && { OR: this.searchCondition },
      ...this.filterCondition.length > 0 && { AND: this.filterCondition }
    };
    const data = await delegate.findMany({
      where: whereCondition,
      include: this.include,
      orderBy: this.orderBy,
      skip: this.skip,
      take: this.take
    });
    const totalAmountOfData = await delegate.count({ where: whereCondition });
    const meta = {
      page: this.page,
      limit: this.take,
      total: totalAmountOfData,
      totalPages: Math.ceil(totalAmountOfData / this.take)
    };
    return { data, meta };
  };
};

// src/app/modules/idea/idea.service.ts
var createIdea = async (payload, user) => {
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId, isDeleted: false }
  });
  if (!category) {
    throw new AppError(status10.NOT_FOUND, "Category not found");
  }
  if (payload.type === IdeaType.PAID && !payload.price) {
    throw new AppError(status10.BAD_REQUEST, "Price is required for paid ideas");
  }
  console.log("payload", payload);
  const idea = await prisma.idea.create({
    data: {
      title: payload.title,
      problemStatement: payload.problemStatement,
      proposedSolution: payload.proposedSolution,
      description: payload.description,
      images: payload.images || [],
      type: payload.type || IdeaType.FREE,
      price: payload.price || null,
      isPaid: payload.type === IdeaType.PAID,
      status: payload?.isPublished ? IdeaStatus.PENDING : IdeaStatus.DRAFT,
      authorId: user?.id,
      categoryId: payload.categoryId
    },
    include: {
      category: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });
  return idea;
};
var submitIdea = async (ideaId, user) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false }
  });
  if (!idea) {
    throw new AppError(status10.NOT_FOUND, "Idea not found");
  }
  if (idea.authorId !== user?.id) {
    throw new AppError(status10.FORBIDDEN, "You are not authorized");
  }
  if (idea.status !== IdeaStatus.DRAFT) {
    throw new AppError(status10.BAD_REQUEST, "Only draft ideas can be submitted");
  }
  const updated = await prisma.idea.update({
    where: { id: ideaId },
    data: { status: IdeaStatus.UNDER_REVIEW }
  });
  return updated;
};
var updateIdea = async (ideaId, payload, user) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false }
  });
  if (!idea) {
    throw new AppError(status10.NOT_FOUND, "Idea not found");
  }
  if (idea.authorId !== user?.id) {
    throw new AppError(status10.FORBIDDEN, "You are not authorized");
  }
  console.log("payload", payload);
  const updated = await prisma.idea.update({
    where: { id: ideaId },
    data: {
      ...payload.title && { title: payload.title },
      ...payload.problemStatement && { problemStatement: payload.problemStatement },
      ...payload.proposedSolution && { proposedSolution: payload.proposedSolution },
      ...payload.description && { description: payload.description },
      ...payload.images !== void 0 && { images: payload.images },
      ...payload.categoryId && { categoryId: payload.categoryId },
      ...payload.type && { type: payload.type },
      ...payload.price && { price: payload.price },
      ...payload.isPublished !== void 0 && { isPublished: payload.isPublished },
      ...payload.isPublished === true && payload.status === "DRAFT" ? { status: IdeaStatus.PENDING } : { status: payload?.status }
    }
  });
  return updated;
};
var deleteIdea = async (ideaId, user) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false }
  });
  if (!idea) {
    throw new AppError(status10.NOT_FOUND, "Idea not found");
  }
  if (user?.role !== Role.ADMIN && idea.authorId !== user?.id) {
    throw new AppError(status10.FORBIDDEN, "You are not authorized");
  }
  if (user?.role !== Role.ADMIN && idea.status !== IdeaStatus.DRAFT) {
    throw new AppError(status10.BAD_REQUEST, "Only draft ideas can be deleted");
  }
  const deleted = await prisma.idea.update({
    where: { id: ideaId },
    data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
  });
  return deleted;
};
var approveIdea = async (ideaId) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false }
  });
  if (!idea) {
    throw new AppError(status10.NOT_FOUND, "Idea not found");
  }
  if (idea.status !== IdeaStatus.UNDER_REVIEW) {
    throw new AppError(status10.BAD_REQUEST, "Idea is not under review");
  }
  const updated = await prisma.idea.update({
    where: { id: ideaId },
    data: { status: IdeaStatus.APPROVED }
  });
  return updated;
};
var rejectIdea = async (ideaId, payload) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false }
  });
  if (!idea) {
    throw new AppError(status10.NOT_FOUND, "Idea not found");
  }
  if (idea.status !== IdeaStatus.UNDER_REVIEW) {
    throw new AppError(status10.BAD_REQUEST, "Idea is not under review");
  }
  const updated = await prisma.idea.update({
    where: { id: ideaId },
    data: {
      status: IdeaStatus.REJECTED,
      rejectionFeedback: payload.rejectionFeedback
    }
  });
  return updated;
};
var moveToUnderReview = async (ideaId) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false }
  });
  if (!idea) {
    throw new AppError(status10.NOT_FOUND, "Idea not found");
  }
  if (idea.status !== IdeaStatus.PENDING) {
    throw new AppError(status10.BAD_REQUEST, "Only pending ideas can be moved to under review");
  }
  const updated = await prisma.idea.update({
    where: { id: ideaId },
    data: { status: IdeaStatus.UNDER_REVIEW }
  });
  return updated;
};
var getAllIdeas = async (query, userId) => {
  const stringSearchFields = [
    "title",
    "description",
    "problemStatement",
    "author.name",
    "category.name"
  ];
  const builder = new QueryBuilder(
    query,
    "idea",
    [],
    stringSearchFields,
    [],
    ["author", "category"]
  );
  builder.filterCondition.push(
    { status: IdeaStatus.APPROVED },
    { isDeleted: false }
  );
  builder.callAll();
  if (query.sortBy === "top_voted") {
    builder.orderBy = { votes: { _count: "desc" } };
  }
  builder.include = {
    category: true,
    author: {
      select: { id: true, name: true, image: true }
    },
    _count: {
      select: { votes: true, comments: true }
    },
    // ✅ userId থাকলে user এর vote আনো
    ...userId && {
      votes: {
        where: { userId },
        select: { type: true }
      }
    }
  };
  const result = await builder.fetch();
  const data = result.data.map((idea) => ({
    ...idea,
    userVote: idea.votes?.[0]?.type || null,
    votes: void 0
  }));
  return { ...result, data };
};
var getMyIdeas = async (user, query) => {
  const stringSearchFields = ["title", "description", "problemStatement"];
  const builder = new QueryBuilder(
    query,
    "idea",
    [],
    stringSearchFields,
    [],
    ["author", "category"]
  );
  builder.filterCondition.push(
    { authorId: user?.id },
    { isDeleted: false }
  );
  builder.callAll();
  builder.include = {
    category: true,
    _count: {
      select: { votes: true, comments: true }
    },
    // ✅ নিজের vote
    votes: {
      where: { userId: user?.id },
      select: { type: true }
    }
  };
  const result = await builder.fetch();
  const data = result.data.map((idea) => ({
    ...idea,
    userVote: idea.votes?.[0]?.type || null,
    votes: void 0
  }));
  return { ...result, data };
};
var getIdeaById = async (ideaId, userId, role) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false },
    include: {
      category: true,
      author: {
        select: { id: true, name: true, image: true }
      },
      _count: {
        select: { votes: true, comments: true }
      },
      // ✅ userId থাকলে user এর vote আনো
      ...userId && {
        votes: {
          where: { userId },
          select: { type: true }
        }
      }
    }
  });
  if (!idea) {
    throw new AppError(status10.NOT_FOUND, "Idea not found");
  }
  if (role === Role.ADMIN) {
    return {
      ...idea,
      userVote: idea.votes?.[0]?.type || null,
      votes: void 0
    };
  }
  if (idea.isPaid) {
    if (!userId) {
      throw new AppError(status10.UNAUTHORIZED, "Please login to view this idea");
    }
    const payment = await prisma.payment.findUnique({
      where: { ideaId_userId: { ideaId, userId } }
    });
    if (!payment || payment.status !== PaymentStatus.SUCCESS) {
      throw new AppError(status10.FORBIDDEN, "Please purchase this idea to view it");
    }
  }
  await prisma.idea.update({
    where: { id: ideaId },
    data: { viewCount: { increment: 1 } }
  });
  return {
    ...idea,
    userVote: idea.votes?.[0]?.type || null,
    votes: void 0
  };
};
var getAllIdeasAdmin = async (query) => {
  const stringSearchFields = [
    "title",
    "description",
    "problemStatement",
    "author.name",
    "category.name"
  ];
  const builder = new QueryBuilder(
    query,
    "idea",
    [],
    stringSearchFields,
    [],
    ["author", "category"]
  );
  builder.filterCondition.push(
    // { authorId: user?.id },
    { isDeleted: false }
  );
  builder.callAll();
  if (query.sortBy === "top_voted") {
    builder.orderBy = { votes: { _count: "desc" } };
  }
  builder.include = {
    category: true,
    author: true,
    _count: {
      select: {
        votes: true,
        comments: true
      }
    }
  };
  return await builder.fetch();
};
var ideaService = {
  createIdea,
  submitIdea,
  getAllIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
  approveIdea,
  rejectIdea,
  getMyIdeas,
  getAllIdeasAdmin,
  moveToUnderReview
};

// src/app/modules/idea/idea.controller.ts
var createIdea2 = catchAsyncHandler(async (req, res) => {
  const result = await ideaService.createIdea(req.body, req.user);
  return sendResponse(res, {
    httpStatusCode: status11.CREATED,
    success: true,
    message: "Idea created successfully",
    data: result
  });
});
var submitIdea2 = catchAsyncHandler(async (req, res) => {
  const result = await ideaService.submitIdea(req.params.id, req.user);
  return sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Idea submitted for review",
    data: result
  });
});
var getAllIdeas2 = catchAsyncHandler(async (req, res) => {
  const result = await ideaService.getAllIdeas(req.query);
  return sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Ideas fetched successfully",
    data: result
  });
});
var getIdeaById2 = catchAsyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const role = req.user?.role;
  const result = await ideaService.getIdeaById(req.params.id, userId, role);
  return sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Idea fetched successfully",
    data: result
  });
});
var updateIdea2 = catchAsyncHandler(async (req, res) => {
  const result = await ideaService.updateIdea(
    req.params.id,
    req.body,
    req.user
  );
  return sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Idea updated successfully",
    data: result
  });
});
var deleteIdea2 = catchAsyncHandler(async (req, res) => {
  const result = await ideaService.deleteIdea(req.params.id, req.user);
  return sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Idea deleted successfully",
    data: result
  });
});
var approveIdea2 = catchAsyncHandler(async (req, res) => {
  const result = await ideaService.approveIdea(req.params.id);
  return sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Idea approved successfully",
    data: result
  });
});
var rejectIdea2 = catchAsyncHandler(async (req, res) => {
  const result = await ideaService.rejectIdea(req.params.id, req.body);
  return sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Idea rejected",
    data: result
  });
});
var getMyIdeas2 = catchAsyncHandler(async (req, res) => {
  const result = await ideaService.getMyIdeas(req.user, req.query);
  return sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "My ideas fetched successfully",
    data: result
  });
});
var getAllIdeasAdmin2 = catchAsyncHandler(
  async (req, res) => {
    const result = await ideaService.getAllIdeasAdmin(req.query);
    return sendResponse(res, {
      httpStatusCode: status11.OK,
      success: true,
      message: "All ideas fetched successfully",
      data: result
    });
  }
);
var moveToUnderReview2 = catchAsyncHandler(async (req, res) => {
  const result = await ideaService.moveToUnderReview(req.params.id);
  return sendResponse(res, {
    httpStatusCode: status11.OK,
    success: true,
    message: "Idea moved to under review",
    data: result
  });
});
var ideaController = {
  createIdea: createIdea2,
  submitIdea: submitIdea2,
  getAllIdeas: getAllIdeas2,
  getIdeaById: getIdeaById2,
  updateIdea: updateIdea2,
  deleteIdea: deleteIdea2,
  approveIdea: approveIdea2,
  rejectIdea: rejectIdea2,
  getMyIdeas: getMyIdeas2,
  getAllIdeasAdmin: getAllIdeasAdmin2,
  moveToUnderReview: moveToUnderReview2
};

// src/app/modules/idea/idea.route.ts
var router4 = Router4();
router4.get("/", ideaController.getAllIdeas);
router4.post(
  "/",
  checkAuth(Role.MEMBER, Role.ADMIN),
  multerUpload.fields([{ name: "images", maxCount: 5 }]),
  ideaUploadMiddleware,
  validationRequest(ideaValidationSchema.createIdeaSchema),
  ideaController.createIdea
);
router4.patch(
  "/:id",
  checkAuth(Role.MEMBER, Role.ADMIN),
  multerUpload.fields([{ name: "images", maxCount: 5 }]),
  ideaUploadMiddleware,
  validationRequest(ideaValidationSchema.updateIdeaSchema),
  ideaController.updateIdea
);
router4.delete(
  "/:id",
  checkAuth(Role.MEMBER, Role.ADMIN),
  ideaController.deleteIdea
);
router4.patch(
  "/:id/submit",
  checkAuth(Role.MEMBER),
  ideaController.submitIdea
);
router4.get(
  "/roleWise",
  checkAuth(Role.MEMBER, Role.ADMIN),
  ideaController.getMyIdeas
);
router4.get(
  "/admin",
  checkAuth(Role.ADMIN),
  ideaController.getAllIdeasAdmin
);
router4.patch(
  "/:id/approve",
  checkAuth(Role.ADMIN),
  ideaController.approveIdea
);
router4.patch(
  "/:id/reject",
  checkAuth(Role.ADMIN),
  validationRequest(ideaValidationSchema.rejectIdeaSchema),
  ideaController.rejectIdea
);
router4.patch(
  "/:id/under-review",
  checkAuth(Role.ADMIN),
  ideaController.moveToUnderReview
);
router4.get("/:id", checkAuth(Role.MEMBER, Role.ADMIN), ideaController.getIdeaById);
var ideaRoutes = router4;

// src/app/modules/global/global.route.ts
import { Router as Router5 } from "express";

// src/app/modules/global/global.controller.ts
var deleteFile = async (req, res) => {
  const { filePath } = req.body;
  const result = await deleteFileFromCloudinary(filePath);
  if (result) {
    sendResponse(res, {
      success: true,
      message: "File deleted successfully",
      httpStatusCode: 200,
      data: []
    });
  }
};

// src/app/modules/global/global.route.ts
var router5 = Router5();
router5.post(
  "/",
  checkAuth(Role.MEMBER, Role.ADMIN),
  deleteFile
);
var globalRoutes = router5;

// src/app/modules/payment/payment.route.ts
import { Router as Router6 } from "express";
import "express";

// src/app/modules/payment/payment.service.ts
import Stripe2 from "stripe";

// src/app/modules/payment/payment.utils.ts
import puppeteer from "puppeteer";
var generatePaymentConfirmationImage = async (data) => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const page = await browser.newPage();
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; background: #f0f4f8; padding: 30px; }
          .card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-width: 700px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #16a34a, #15803d); color: white; text-align: center; padding: 32px 20px 24px; }
          .header h1 { font-size: 26px; letter-spacing: 1px; }
          .badge { display: inline-block; background: #4caf50; color: white; padding: 6px 20px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-top: 12px; }
          .body { padding: 28px 32px; }
          .section { margin-bottom: 24px; }
          .section-title { font-size: 13px; font-weight: bold; text-transform: uppercase; color: #16a34a; background: #f0fdf4; border-left: 4px solid #16a34a; padding: 8px 14px; border-radius: 4px; margin-bottom: 14px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .label { font-size: 11px; color: #888; text-transform: uppercase; margin-bottom: 2px; }
          .value { font-size: 14px; color: #222; font-weight: 500; }
          .payment-box { background: #fffbf0; border: 1px solid #ffe082; border-radius: 10px; padding: 18px 20px; }
          .total-row { display: flex; justify-content: space-between; border-top: 1px dashed #ffe082; margin-top: 14px; padding-top: 14px; }
          .total-amount { font-size: 22px; font-weight: bold; color: #16a34a; }
          .footer { text-align: center; background: #f9f9f9; border-top: 1px solid #eee; padding: 16px; font-size: 12px; color: #aaa; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>\u{1F331} EcoSpark Hub</h1>
            <p>Official Payment Receipt</p>
            <div class="badge">\u2705 Payment Successful</div>
            <p style="font-size:12px;opacity:.75;margin-top:8px">\u{1F4C5} ${data.date}</p>
          </div>
          <div class="body">
            <div class="section">
              <div class="section-title">\u{1F464} Buyer Information</div>
              <div class="info-grid">
                <div><div class="label">Full Name</div><div class="value">${data.authorName}</div></div>
                <div><div class="label">Email</div><div class="value">${data.authorEmail}</div></div>
              </div>
            </div>
            <div class="section">
              <div class="section-title">\u{1F4A1} Idea Information</div>
              <div class="info-grid">
                <div><div class="label">Idea Title</div><div class="value">${data.ideaTitle}</div></div>
                <div><div class="label">Idea ID</div><div class="value" style="font-size:11px">${data.ideaId}</div></div>
              </div>
            </div>
            <div class="section">
              <div class="section-title">\u{1F4B3} Payment Information</div>
              <div class="payment-box">
                <div class="info-grid">
                  <div><div class="label">Payment ID</div><div class="value" style="font-size:11px">${data.paymentId}</div></div>
                  <div><div class="label">Payment Method</div><div class="value">Card (Stripe)</div></div>
                  <div><div class="label">Status</div><div class="value" style="color:#2e7d32;font-weight:bold">PAID \u2705</div></div>
                </div>
                <div class="total-row">
                  <span style="font-size:15px;font-weight:bold;color:#555">Total Amount Paid</span>
                  <span class="total-amount">\u09F3 ${data.amount}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="footer">
            <p>This is a computer-generated payment receipt. Please keep this for your records.</p>
          </div>
        </div>
      </body>
    </html>
  `);
  const buffer = await page.screenshot({ type: "png", fullPage: true });
  await browser.close();
  return buffer;
};

// src/config/stripe.config.ts
import Stripe from "stripe";
var stripe = new Stripe(envVars.STRIPE_SECRET_KEY);

// src/app/utils/stripe.ts
var createCheckoutSession = async (payload) => {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: payload.ideaTitle,
            description: `Purchased by ${payload.buyerName}`
          },
          unit_amount: payload.price * 100
        },
        quantity: 1
      }
    ],
    // ✅ session level metadata
    metadata: {
      ideaId: payload.ideaId,
      paymentId: payload.paymentId
    },
    // ✅ payment_intent level এও metadata — এটাই আসল fix
    payment_intent_data: {
      metadata: {
        ideaId: payload.ideaId,
        paymentId: payload.paymentId
      }
    },
    success_url: `${process.env.FRONTEND_URL}/payment/success?idea=${payload.ideaId}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
  });
  return session;
};

// src/app/modules/payment/payment.service.ts
import { status as status12 } from "http-status";
var stripe2 = new Stripe2(envVars.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27"
});
var initiatePayment = async (ideaId, user) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false, status: IdeaStatus.APPROVED }
  });
  if (!idea) {
    throw new AppError(status12.NOT_FOUND, "Idea not found");
  }
  if (idea.type !== IdeaType.PAID) {
    throw new AppError(status12.BAD_REQUEST, "This idea is free");
  }
  if (!idea.price) {
    throw new AppError(status12.BAD_REQUEST, "Idea price is not set");
  }
  const existingPayment = await prisma.payment.findUnique({
    where: { ideaId_userId: { ideaId, userId: user?.id } }
  });
  if (existingPayment?.status === PaymentStatus.SUCCESS) {
    throw new AppError(status12.BAD_REQUEST, "You already purchased this idea");
  }
  const buyer = await prisma.user.findUnique({
    where: { id: user?.id }
  });
  if (!buyer) {
    throw new AppError(status12.NOT_FOUND, "User not found");
  }
  let payment;
  if (existingPayment) {
    payment = await prisma.payment.update({
      where: { id: existingPayment.id },
      data: { status: PaymentStatus.PENDING }
    });
  } else {
    payment = await prisma.payment.create({
      data: {
        amount: idea.price,
        ideaId,
        userId: user?.id,
        status: PaymentStatus.PENDING
      }
    });
  }
  const session = await createCheckoutSession({
    ideaId,
    paymentId: payment.id,
    buyerName: buyer.name,
    ideaTitle: idea.title,
    price: idea.price
  });
  return {
    paymentUrl: session.url,
    paymentId: payment.id,
    sessionId: session.id
  };
};
var handleStripeWebhookEvent = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe2.webhooks.constructEvent(
      req.body,
      sig,
      envVars.WEBHOOK_SIGNING_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  const existingEvent = await prisma.payment.findFirst({
    where: { stripeEventId: event.id }
  });
  if (existingEvent) {
    console.log(`Event ${event.id} already processed. Skipping`);
    return res.json({ message: `Event ${event.id} already processed` });
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const ideaId = session.metadata?.ideaId;
      const paymentId = session.metadata?.paymentId;
      if (!ideaId || !paymentId) {
        return res.status(400).json({ message: "Missing ideaId or paymentId" });
      }
      const paymentData = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          stripeEventId: event.id,
          status: session.payment_status === "paid" ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
          paymentGatewayData: session
        },
        include: {
          idea: true,
          user: true
        }
      });
      const imageBuffer = await generatePaymentConfirmationImage({
        authorName: paymentData.user.name,
        authorEmail: paymentData.user.email,
        ideaTitle: paymentData.idea.title,
        amount: session.amount_total / 100,
        ideaId,
        paymentId,
        date: (/* @__PURE__ */ new Date()).toDateString()
      });
      const fileName = `ecospark-invoice-${paymentData.user.name}-${Date.now()}.png`;
      const uploadResult = await uploadFileToCloudinary(imageBuffer, fileName);
      if (!uploadResult?.secure_url) {
        throw new Error("Cloudinary upload failed");
      }
      await prisma.payment.update({
        where: { id: paymentId },
        data: { invoiceUrl: uploadResult.secure_url }
      });
      await sendEmail({
        to: paymentData.user.email,
        subject: "Payment Confirmation - EcoSpark Hub",
        templateName: "paymentConfirmationEmail",
        templateData: {
          authorName: paymentData.user.name,
          authorEmail: paymentData.user.email,
          ideaTitle: paymentData.idea.title,
          amount: session.amount_total / 100,
          ideaId,
          paymentId,
          date: (/* @__PURE__ */ new Date()).toDateString(),
          imageUrl: uploadResult.secure_url
        }
      });
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      console.log(`Payment failed: ${paymentIntent.id}`);
      break;
    }
    default:
      console.log(`Unhandled event: ${event.type}`);
  }
  return res.json({ received: true, message: `Event ${event.id} processed` });
};
var verifyPayment = async (ideaId, user) => {
  const payment = await prisma.payment.findUnique({
    where: { ideaId_userId: { ideaId, userId: user?.id } }
  });
  return {
    isPurchased: payment?.status === PaymentStatus.SUCCESS,
    invoiceUrl: payment?.invoiceUrl || null
  };
};
var getMyPayments = async (user) => {
  const payments = await prisma.payment.findMany({
    where: { userId: user?.id },
    orderBy: { createdAt: "desc" },
    include: {
      idea: {
        select: {
          id: true,
          title: true,
          images: true,
          type: true,
          price: true
        }
      }
    }
  });
  return payments;
};
var paymentService = {
  initiatePayment,
  handleStripeWebhookEvent,
  verifyPayment,
  getMyPayments
};

// src/app/modules/payment/payment.controller.ts
import { status as status13 } from "http-status";
var initiatePayment2 = catchAsyncHandler(async (req, res) => {
  const result = await paymentService.initiatePayment(req.body.ideaId, req.user);
  return sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Payment initiated successfully",
    data: result
  });
});
var handleStripeWebhookEvent2 = async (req, res) => {
  return await paymentService.handleStripeWebhookEvent(req, res);
};
var verifyPayment2 = catchAsyncHandler(async (req, res) => {
  const result = await paymentService.verifyPayment(req.params.ideaId, req.user);
  return sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Payment status fetched",
    data: result
  });
});
var getMyPayments2 = catchAsyncHandler(async (req, res) => {
  const result = await paymentService.getMyPayments(req.user);
  return sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Payments fetched successfully",
    data: result
  });
});
var paymentController = {
  initiatePayment: initiatePayment2,
  handleStripeWebhookEvent: handleStripeWebhookEvent2,
  verifyPayment: verifyPayment2,
  getMyPayments: getMyPayments2
};

// src/app/modules/payment/payment.route.ts
var router6 = Router6();
router6.post(
  "/initiate",
  checkAuth(Role.MEMBER, Role.ADMIN),
  paymentController.initiatePayment
);
router6.get(
  "/verify/:ideaId",
  checkAuth(Role.MEMBER, Role.ADMIN),
  paymentController.verifyPayment
);
router6.get(
  "/my",
  checkAuth(Role.MEMBER, Role.ADMIN),
  paymentController.getMyPayments
);
var paymentRoutes = router6;

// src/app/modules/comment/comment.route.ts
import { Router as Router7 } from "express";

// src/app/modules/comment/comment.controller.ts
import { status as status15 } from "http-status";

// src/app/modules/comment/comment.service.ts
import { status as status14 } from "http-status";
var createComment = async (ideaId, payload, user) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false, status: IdeaStatus.APPROVED }
  });
  if (!idea) {
    throw new AppError(status14.NOT_FOUND, "Idea not found");
  }
  if (payload.parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: payload.parentId, isDeleted: false }
    });
    if (!parentComment) {
      throw new AppError(status14.NOT_FOUND, "Parent comment not found");
    }
  }
  const comment = await prisma.comment.create({
    data: {
      content: payload.content,
      ideaId,
      authorId: user?.id,
      parentId: payload.parentId || null
    },
    include: {
      author: {
        select: { id: true, name: true, image: true }
      }
    }
  });
  return comment;
};
var getCommentsByIdea = async (ideaId, query) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false }
  });
  if (!idea) {
    throw new AppError(status14.NOT_FOUND, "Idea not found");
  }
  const builder = new QueryBuilder(
    query,
    "comment",
    [],
    ["content"],
    [],
    ["author"]
  );
  builder.filterCondition.push(
    { ideaId },
    { isDeleted: false },
    { parentId: null }
  );
  builder.callAll();
  builder.include = {
    author: {
      select: { id: true, name: true, image: true }
    },
    replies: {
      where: { isDeleted: false },
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: { id: true, name: true, image: true }
        },
        replies: {
          where: { isDeleted: false },
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              select: { id: true, name: true, image: true }
            }
          }
        }
      }
    },
    _count: {
      select: { replies: true }
    }
  };
  return await builder.fetch();
};
var deleteComment = async (commentId, user) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId, isDeleted: false }
  });
  if (!comment) {
    throw new AppError(status14.NOT_FOUND, "Comment not found");
  }
  if (user?.role !== Role.ADMIN && comment.authorId !== user?.id) {
    throw new AppError(status14.FORBIDDEN, "You are not authorized");
  }
  const deleted = await prisma.comment.update({
    where: { id: commentId },
    data: { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() }
  });
  return deleted;
};
var commentService = {
  createComment,
  getCommentsByIdea,
  deleteComment
};

// src/app/modules/comment/comment.controller.ts
var createComment2 = catchAsyncHandler(async (req, res) => {
  const result = await commentService.createComment(
    req.params.ideaId,
    req.body,
    req.user
  );
  return sendResponse(res, {
    httpStatusCode: status15.CREATED,
    success: true,
    message: "Comment added successfully",
    data: result
  });
});
var getCommentsByIdea2 = catchAsyncHandler(
  async (req, res) => {
    const result = await commentService.getCommentsByIdea(
      req.params.ideaId,
      req.query
    );
    return sendResponse(res, {
      httpStatusCode: status15.OK,
      success: true,
      message: "Comments fetched successfully",
      data: result
    });
  }
);
var deleteComment2 = catchAsyncHandler(async (req, res) => {
  const result = await commentService.deleteComment(req.params.id, req.user);
  return sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "Comment deleted successfully",
    data: result
  });
});
var commentController = {
  createComment: createComment2,
  getCommentsByIdea: getCommentsByIdea2,
  deleteComment: deleteComment2
};

// src/app/modules/comment/comment.validation.ts
import { z as z4 } from "zod";
var createCommentSchema = z4.object({
  content: z4.string().min(1, "Comment cannot be empty"),
  parentId: z4.string().uuid().optional()
});
var commentValidationSchema = {
  createCommentSchema
};

// src/app/modules/comment/comment.route.ts
var router7 = Router7();
router7.get("/:ideaId", commentController.getCommentsByIdea);
router7.post(
  "/:ideaId",
  checkAuth(Role.MEMBER, Role.ADMIN),
  validationRequest(commentValidationSchema.createCommentSchema),
  commentController.createComment
);
router7.delete(
  "/:id",
  checkAuth(Role.MEMBER, Role.ADMIN),
  commentController.deleteComment
);
var commentRoutes = router7;

// src/app/modules/vote/vote.route.ts
import { Router as Router8 } from "express";

// src/app/modules/vote/vote.controller.ts
import { status as status17 } from "http-status";

// src/app/modules/vote/vote.service.ts
import { status as status16 } from "http-status";
var voteIdea = async (ideaId, payload, user) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false, status: IdeaStatus.APPROVED }
  });
  if (!idea) {
    throw new AppError(status16.NOT_FOUND, "Idea not found");
  }
  const existingVote = await prisma.vote.findUnique({
    where: { ideaId_userId: { ideaId, userId: user?.id } }
  });
  if (existingVote) {
    if (existingVote.type === payload.type) {
      await prisma.vote.delete({
        where: { ideaId_userId: { ideaId, userId: user?.id } }
      });
      return { message: `${payload.type} removed` };
    }
    const updated = await prisma.vote.update({
      where: { ideaId_userId: { ideaId, userId: user?.id } },
      data: { type: payload.type }
    });
    return updated;
  }
  const vote = await prisma.vote.create({
    data: {
      type: payload.type,
      ideaId,
      userId: user?.id
    }
  });
  return vote;
};
var removeVote = async (ideaId, user) => {
  const existingVote = await prisma.vote.findUnique({
    where: { ideaId_userId: { ideaId, userId: user?.id } }
  });
  if (!existingVote) {
    throw new AppError(status16.NOT_FOUND, "Vote not found");
  }
  await prisma.vote.delete({
    where: { ideaId_userId: { ideaId, userId: user?.id } }
  });
  return { message: "Vote removed successfully" };
};
var getVoteCount = async (ideaId, userId) => {
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId, isDeleted: false }
  });
  if (!idea) {
    throw new AppError(status16.NOT_FOUND, "Idea not found");
  }
  const [upvotes, downvotes, userVote] = await Promise.all([
    prisma.vote.count({ where: { ideaId, type: VoteType.UPVOTE } }),
    prisma.vote.count({ where: { ideaId, type: VoteType.DOWNVOTE } }),
    // Login থাকলে user এর vote কী সেটাও দেখাবে
    userId ? prisma.vote.findUnique({
      where: { ideaId_userId: { ideaId, userId } }
    }) : null
  ]);
  return {
    upvotes,
    downvotes,
    total: upvotes - downvotes,
    userVote: userVote?.type || null
    // UPVOTE, DOWNVOTE, null
  };
};
var voteService = {
  voteIdea,
  removeVote,
  getVoteCount
};

// src/app/modules/vote/vote.controller.ts
var voteIdea2 = catchAsyncHandler(async (req, res) => {
  const result = await voteService.voteIdea(
    req.params.ideaId,
    req.body,
    req.user
  );
  return sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Vote recorded successfully",
    data: result
  });
});
var removeVote2 = catchAsyncHandler(async (req, res) => {
  const result = await voteService.removeVote(req.params.ideaId, req.user);
  return sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Vote removed successfully",
    data: result
  });
});
var getVoteCount2 = catchAsyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const result = await voteService.getVoteCount(req.params.ideaId, userId);
  return sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Vote count fetched successfully",
    data: result
  });
});
var voteController = {
  voteIdea: voteIdea2,
  removeVote: removeVote2,
  getVoteCount: getVoteCount2
};

// src/app/modules/vote/vote.validation.ts
import { z as z5 } from "zod";
var voteSchema = z5.object({
  type: z5.nativeEnum(VoteType, { message: "Vote type must be UPVOTE or DOWNVOTE" })
});
var voteValidationSchema = {
  voteSchema
};

// src/app/modules/vote/vote.route.ts
var router8 = Router8();
router8.get("/:ideaId", voteController.getVoteCount);
router8.post(
  "/:ideaId",
  checkAuth(Role.MEMBER, Role.ADMIN),
  validationRequest(voteValidationSchema.voteSchema),
  voteController.voteIdea
);
router8.delete(
  "/:ideaId",
  checkAuth(Role.MEMBER, Role.ADMIN),
  voteController.removeVote
);
var voteRoutes = router8;

// src/app/modules/dashboard/dashboard.route.ts
import { Router as Router9 } from "express";

// src/app/modules/dashboard/dashboard.controller.ts
import { status as status18 } from "http-status";

// src/app/modules/dashboard/dashboard.service.ts
var getAdminStats = async () => {
  const [
    totalUsers,
    totalIdeas,
    totalVotes,
    totalComments,
    totalPayments,
    pendingIdeas,
    approvedIdeas,
    rejectedIdeas,
    underReviewIdeas
  ] = await Promise.all([
    prisma.user.count({ where: { isDeleted: false } }),
    prisma.idea.count({ where: { isDeleted: false } }),
    prisma.vote.count(),
    prisma.comment.count({ where: { isDeleted: false } }),
    prisma.payment.count(),
    prisma.idea.count({ where: { status: IdeaStatus.PENDING, isDeleted: false } }),
    prisma.idea.count({ where: { status: IdeaStatus.APPROVED, isDeleted: false } }),
    prisma.idea.count({ where: { status: IdeaStatus.REJECTED, isDeleted: false } }),
    prisma.idea.count({ where: { status: IdeaStatus.UNDER_REVIEW, isDeleted: false } })
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
      underReview: underReviewIdeas
    }
  };
};
var getMemberStats = async (user) => {
  const [
    totalIdeas,
    draftIdeas,
    approvedIdeas,
    rejectedIdeas,
    underReviewIdeas,
    totalVotes,
    totalComments,
    totalPayments
  ] = await Promise.all([
    prisma.idea.count({ where: { authorId: user?.id, isDeleted: false } }),
    prisma.idea.count({ where: { authorId: user?.id, status: IdeaStatus.DRAFT, isDeleted: false } }),
    prisma.idea.count({ where: { authorId: user?.id, status: IdeaStatus.APPROVED, isDeleted: false } }),
    prisma.idea.count({ where: { authorId: user?.id, status: IdeaStatus.REJECTED, isDeleted: false } }),
    prisma.idea.count({ where: { authorId: user?.id, status: IdeaStatus.UNDER_REVIEW, isDeleted: false } }),
    prisma.vote.count({ where: { userId: user?.id } }),
    prisma.comment.count({ where: { authorId: user?.id, isDeleted: false } }),
    prisma.payment.count({ where: { userId: user?.id } })
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
      underReview: underReviewIdeas
    }
  };
};
var getAllUsers = async (query) => {
  const { page = 1, limit = 10, search, status: status23, role } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const where = {
    ...status23 && { status: status23 },
    ...role && { role },
    ...search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } }
      ]
    }
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
          select: { ideas: true, votes: true, comments: true }
        }
      }
    }),
    prisma.user.count({ where })
  ]);
  return {
    data: users,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    }
  };
};
var updateUserStatus = async (userId, status23) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isDeleted: false }
  });
  if (!user) {
    throw new Error("User not found");
  }
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { status: status23 },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true
    }
  });
  return updated;
};
var updateUserRole = async (userId, role) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isDeleted: false }
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
      status: true
    }
  });
  return updated;
};
var deleteUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isDeleted: false }
  });
  if (!user) {
    throw new Error("User not found");
  }
  const deleted = await prisma.user.update({
    where: { id: userId },
    data: { isDeleted: true, status: UserStatus.DELETED, deletedAt: /* @__PURE__ */ new Date() }
  });
  return deleted;
};
var dashboardService = {
  getAdminStats,
  getMemberStats,
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser
};

// src/app/modules/dashboard/dashboard.controller.ts
var getAdminStats2 = catchAsyncHandler(async (req, res) => {
  const result = await dashboardService.getAdminStats();
  return sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Admin stats fetched successfully",
    data: result
  });
});
var getMemberStats2 = catchAsyncHandler(async (req, res) => {
  const result = await dashboardService.getMemberStats(req.user);
  return sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Member stats fetched successfully",
    data: result
  });
});
var getAllUsers2 = catchAsyncHandler(async (req, res) => {
  const result = await dashboardService.getAllUsers(req.query);
  return sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "Users fetched successfully",
    data: result
  });
});
var updateUserStatus2 = catchAsyncHandler(async (req, res) => {
  const result = await dashboardService.updateUserStatus(
    req.params.userId,
    req.body.status
  );
  return sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "User status updated successfully",
    data: result
  });
});
var updateUserRole2 = catchAsyncHandler(async (req, res) => {
  const result = await dashboardService.updateUserRole(
    req.params.userId,
    req.body.role
  );
  return sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "User role updated successfully",
    data: result
  });
});
var deleteUser2 = catchAsyncHandler(async (req, res) => {
  const result = await dashboardService.deleteUser(req.params.userId);
  return sendResponse(res, {
    httpStatusCode: status18.OK,
    success: true,
    message: "User deleted successfully",
    data: result
  });
});
var dashboardController = {
  getAdminStats: getAdminStats2,
  getMemberStats: getMemberStats2,
  getAllUsers: getAllUsers2,
  updateUserStatus: updateUserStatus2,
  updateUserRole: updateUserRole2,
  deleteUser: deleteUser2
};

// src/app/modules/dashboard/dashboard.route.ts
var router9 = Router9();
router9.get(
  "/admin/stats",
  checkAuth(Role.ADMIN),
  dashboardController.getAdminStats
);
router9.get(
  "/admin/users",
  checkAuth(Role.ADMIN),
  dashboardController.getAllUsers
);
router9.patch(
  "/admin/users/:userId/status",
  checkAuth(Role.ADMIN),
  dashboardController.updateUserStatus
);
router9.patch(
  "/admin/users/:userId/role",
  checkAuth(Role.ADMIN),
  dashboardController.updateUserRole
);
router9.delete(
  "/admin/users/:userId",
  checkAuth(Role.ADMIN),
  dashboardController.deleteUser
);
router9.get(
  "/member/stats",
  checkAuth(Role.MEMBER, Role.ADMIN),
  dashboardController.getMemberStats
);
var dashboardRoutes = router9;

// src/app/routes/index.ts
var route = Router10();
var allRoutes = [
  {
    path: "/auth",
    handler: AuthRoutes
  },
  {
    path: "/user",
    handler: userRoutes
  },
  {
    path: "/idea/category",
    handler: categoryRoutes
  },
  {
    path: "/idea",
    handler: ideaRoutes
  },
  {
    path: "/delete",
    handler: globalRoutes
  },
  {
    path: "/payments",
    handler: paymentRoutes
  },
  {
    path: "/comments",
    handler: commentRoutes
  },
  {
    path: "/votes",
    handler: voteRoutes
  },
  {
    path: "/dashboard",
    handler: dashboardRoutes
  }
];
allRoutes.forEach((i) => route.use(i?.path, i?.handler));
var routes_default = route;

// src/app/middleware/globalErrorHandler.ts
import status21 from "http-status";
import z7 from "zod";

// src/app/errorHelplers/handleZodError.ts
import status19 from "http-status";
import "zod";
var handleZodError = (err) => {
  const statusCode = status19.BAD_REQUEST;
  const message = "Zod Validation Error";
  let errorSources = [];
  errorSources = err?.issues?.map((error) => {
    return {
      path: error.path.join("=>"),
      message: error?.message
    };
  });
  return {
    success: false,
    message,
    errorSources,
    statusCode
  };
};

// src/app/utils/deleteUploadedFilesFromGlobalErrorHandler.ts
var deleteUploadedFilesFromGlobalErrorHandler = async (req) => {
  try {
    let filesToDeleteList = [];
    if (req?.file && req?.file?.path) {
      filesToDeleteList?.push(req?.file?.path);
    } else if (req?.files && typeof req?.files === "object" && !Array.isArray(req?.files)) {
      Object.values(req?.files)?.forEach((files) => {
        files?.forEach((file) => {
          if (file?.path) {
            filesToDeleteList.push(file?.path);
          }
        });
      });
    } else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const imageUrls = req.files.forEach((file) => {
        if (file?.path) {
          filesToDeleteList.push(file.path);
        }
      });
    }
    if (filesToDeleteList?.length > 0) {
      await Promise.all(filesToDeleteList?.map((i) => deleteFileFromCloudinary(i)));
    }
    console.log(`files of ${filesToDeleteList.join(",")} are deleted`);
  } catch (error) {
    console.log(error);
  }
};

// src/app/errorHelplers/handlePrismaError.ts
import status20 from "http-status";
var getStatusCodeFromPrismaError = (errorCode) => {
  if (errorCode === "P2002") {
    return status20.CONFLICT;
  }
  if (["P2025", "P2001", "P2015", "P2018"].includes(errorCode)) {
    return status20.NOT_FOUND;
  }
  if (["P1000", "P6002"].includes(errorCode)) {
    return status20.UNAUTHORIZED;
  }
  if (["P1010", "P6010"].includes(errorCode)) {
    return status20.FORBIDDEN;
  }
  if (errorCode === "P6003") {
    return status20.PAYMENT_REQUIRED;
  }
  if (["P1008", "P2004", "P6004"].includes(errorCode)) {
    return status20.GATEWAY_TIMEOUT;
  }
  if (errorCode === "P5011") {
    return status20.TOO_MANY_REQUESTS;
  }
  if (errorCode === "P6009") {
    return 413;
  }
  if (errorCode.startsWith("P1") || ["P2024", "P2037", "P6008"].includes(errorCode)) {
    return status20.SERVICE_UNAVAILABLE;
  }
  if (errorCode.startsWith("P2")) {
    return status20.BAD_REQUEST;
  }
  if (errorCode.startsWith("P3") || errorCode.startsWith("P4")) {
    return status20.INTERNAL_SERVER_ERROR;
  }
  return status20.INTERNAL_SERVER_ERROR;
};
var formatErrorMeta = (meta) => {
  if (!meta) return "";
  const parts = [];
  if (meta.target) {
    parts.push(`Field(s): ${String(meta.target)}`);
  }
  if (meta.field_name) {
    parts.push(`Field: ${String(meta.field_name)}`);
  }
  if (meta.column_name) {
    parts.push(`Column: ${String(meta.column_name)}`);
  }
  if (meta.table) {
    parts.push(`Table: ${String(meta.table)}`);
  }
  if (meta.model_name) {
    parts.push(`Model: ${String(meta.model_name)}`);
  }
  if (meta.relation_name) {
    parts.push(`Relation: ${String(meta.relation_name)}`);
  }
  if (meta.constraint) {
    parts.push(`Constraint: ${String(meta.constraint)}`);
  }
  if (meta.database_error) {
    parts.push(`Database Error: ${String(meta.database_error)}`);
  }
  return parts.length > 0 ? parts.join(" |") : "";
};
var handlePrismaClientKnownRequestError = (error) => {
  const statusCode = getStatusCodeFromPrismaError(error.code);
  const metaInfo = formatErrorMeta(error.meta);
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred with the database operation.";
  const errorSources = [
    {
      path: error.code,
      message: metaInfo ? `${mainMessage} | ${metaInfo}` : mainMessage
    }
  ];
  if (error.meta?.cause) {
    errorSources.push({
      path: "cause",
      message: String(error.meta.cause)
    });
  }
  return {
    success: false,
    statusCode,
    message: `Prisma Client Known Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientUnknownError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An unknown error occurred with the database operation.";
  const errorSources = [
    {
      path: "Unknown Prisma Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode: status20.INTERNAL_SERVER_ERROR,
    message: `Prisma Client Unknown Request Error: ${mainMessage}`,
    errorSources
  };
};
var handlePrismaClientValidationError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const errorSources = [];
  const fieldMatch = cleanMessage.match(/Argument `(\w+)`/i);
  const fieldName = fieldMatch ? fieldMatch[1] : "Unknown Field";
  const mainMessage = lines.find(
    (line) => !line.includes("Argument") && !line.includes("\u2192") && line.length > 10
  ) || lines[0] || "Invalid query parameters provided to the database operation.";
  errorSources.push({
    path: fieldName,
    message: mainMessage
  });
  return {
    success: false,
    statusCode: status20.BAD_REQUEST,
    message: `Prisma Client Validation Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientInitializationError = (error) => {
  const statusCode = error.errorCode ? getStatusCodeFromPrismaError(error.errorCode) : status20.SERVICE_UNAVAILABLE;
  const cleanMessage = error.message;
  cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred while initializing the Prisma Client.";
  const errorSources = [
    {
      path: error.errorCode || "Initialization Error",
      message: mainMessage
    }
  ];
  return {
    success: false,
    statusCode,
    message: `Prisma Client Initialization Error: ${mainMessage}`,
    errorSources
  };
};
var handlerPrismaClientRustPanicError = () => {
  const errorSources = [{
    path: "Rust Engine Crashed",
    message: "The database engine encountered a fatal error and crashed. This is usually due to an internal bug in the Prisma engine or an unexpected edge case in the database operation. Please check the Prisma logs for more details and consider reporting this issue to the Prisma team if it persists."
  }];
  return {
    success: false,
    statusCode: status20.INTERNAL_SERVER_ERROR,
    message: "Prisma Client Rust Panic Error: The database engine crashed due to a fatal error.",
    errorSources
  };
};

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = async (error, req, res, next) => {
  let success = false;
  let errorSources = [];
  let message = "Internal Server Error";
  let stack = "";
  let httpStatusCode = status21.INTERNAL_SERVER_ERROR;
  if (envVars.NODE_ENV === "Development") {
    console.log("Error from global error handler", error);
  }
  if (error instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaClientKnownRequestError(error);
    httpStatusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = error.stack;
  } else if (error instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    const simplifiedError = handlePrismaClientUnknownError(error);
    httpStatusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = error.stack;
  } else if (error instanceof prismaNamespace_exports.PrismaClientValidationError) {
    const simplifiedError = handlePrismaClientValidationError(error);
    httpStatusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = error.stack;
  } else if (error instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    const simplifiedError = handlerPrismaClientRustPanicError();
    httpStatusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = error.stack;
  } else if (error instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    const simplifiedError = handlerPrismaClientInitializationError(error);
    httpStatusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = error.stack;
  } else if (error instanceof z7.ZodError) {
    const simplifiedError = await handleZodError(error);
    success = simplifiedError?.success;
    message = simplifiedError?.message;
    httpStatusCode = simplifiedError?.statusCode;
    errorSources = [...simplifiedError.errorSources];
  } else if (error instanceof AppError) {
    if (req?.file || req?.files) {
      await deleteUploadedFilesFromGlobalErrorHandler(req);
    }
    console.log("global error handler", req?.files);
    message = error?.message;
    httpStatusCode = error?.statusCode;
    stack = error?.stack;
    errorSources = [{
      path: "/",
      message: error?.message
    }];
  } else if (error instanceof Error) {
    message = error?.message;
    httpStatusCode = status21.INTERNAL_SERVER_ERROR;
    stack = error?.stack;
    errorSources = [{
      path: "/",
      message: error?.message
    }];
  }
  return await res.status(httpStatusCode).json({
    success: false,
    message,
    error: error?.message,
    errorSources: envVars.NODE_ENV === "development" ? errorSources : void 0,
    stack: envVars.NODE_ENV === "development" ? stack : void 0
  });
};

// src/app/middleware/notFoundHandler.ts
import status22 from "http-status";
var NotfoundHandler = async (req, res) => {
  return res.status(status22.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
    // error:`Route ${req.originalUrl} not found`
  });
};

// src/app.ts
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import cron from "node-cron";
var app = express2();
app.post(
  "/api/v1/payments/webhook",
  express2.raw({ type: "application/json" }),
  paymentController.handleStripeWebhookEvent
);
app.use(express2.json());
app.use(express2.urlencoded({ extended: true }));
app.use(cookieParser());
var allowedOrigins = [
  process.env.APP_URL,
  process.env.PROD_APP_URL,
  "https://assignment5-portal-frontend.vercel.app",
  "http://localhost:3000",
  "http://localhost:6060"
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin);
      if (isAllowed) callback(null, true);
      else callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/v1", routes_default);
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use(globalErrorHandler);
app.use(NotfoundHandler);
cron.schedule("*/30 * * * *", async () => {
  console.log("Cron: canceled unpaid appointments if any");
});
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
