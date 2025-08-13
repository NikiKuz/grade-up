import { TypeUser } from "#types/user.js";

export function sanitizeUser(user: TypeUser) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
