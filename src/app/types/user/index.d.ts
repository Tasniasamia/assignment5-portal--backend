import type { JwtPayload } from "jsonwebtoken";
import type { Role, UserStatus } from "../../../generated/prisma/enums";

interface userTypes{
    email: string;
    role: Role;
    id: string;
    status: UserStatus;
    isDeleted: boolean;
    name:string;
}

declare global {
    namespace Express {
      interface Request {
       user:JwtPayload
      }
  
    }
  }
  