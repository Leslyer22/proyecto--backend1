
export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ status: "error", message: "Not authenticated" });
  }

  if (!allowedRoles.includes(user.role)) {
    return res.status(403).json({ status: "error", message: "Forbidden: insufficient privileges" });
  }

  next();
};
