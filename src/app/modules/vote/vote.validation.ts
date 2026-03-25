import { z } from "zod";
import { VoteType } from "../../../generated/prisma/enums";

const voteSchema = z.object({
  type: z.nativeEnum(VoteType, { message: "Vote type must be UPVOTE or DOWNVOTE" }),
});

export const voteValidationSchema = {
  voteSchema,
};