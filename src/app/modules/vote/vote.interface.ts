import type { VoteType } from "../../../generated/prisma/enums";

export type IVotePayload = {
  type: VoteType;
};