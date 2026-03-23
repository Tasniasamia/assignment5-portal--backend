import type { Role, UserStatus } from "../../generated/prisma/enums"

export interface IJwtUserPayload {
    id:  string 
    email: string
    role: Role
    status: UserStatus
    isDeleted: boolean
    name: string
  }
  