import { AuthContext } from "../context/auth.context";

export function checkAuth(ctx: AuthContext) {
  if (!ctx.user) throw new Error("Authentication required");
  console.log("testing husky");
}
