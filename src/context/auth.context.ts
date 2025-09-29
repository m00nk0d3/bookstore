import { User } from "../models/user.model";
import { verifyToken } from "../services/auth.service";
export interface AuthContext {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export const createAuthContext = async (
  authHeader?: string
): Promise<AuthContext> => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {};
  }
  const token = authHeader.slice("Bearer ".length).trim();

  const payload = verifyToken(token);
  if (!payload?.sub) {
    return {};
  }
  try {
    const user = await User.findById(payload.sub).select({
      _id: 1,
      email: 1,
      username: 1,
    });
    if (user) {
      return {
        user: { id: user.id, email: user.email, username: user.username },
      };
    }
  } catch {
    // no-op: incalid user -> unauthenticated
  }
  return {};
};
