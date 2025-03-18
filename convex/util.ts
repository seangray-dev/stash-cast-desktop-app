import { ActionCtx, MutationCtx } from "./_generated/server";
import { QueryCtx } from "./_generated/server";

export async function getUserId(ctx: QueryCtx | ActionCtx | MutationCtx) {
  return (await ctx.auth.getUserIdentity())?.subject;
}
