/**
 * Authorization Middleware
 * Checks if user has required role
 * Usage: authorize('admin', 'architect')
 */
const authorize = (...allowedRoles) => (req, res, next) => {
  const userRole = req.user?.role;

  if (!userRole) {
    return res.status(403).json({
      status: 'error',
      message: 'User role not found',
    });
  }

  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({
      status: 'error',
      message: `Forbidden: User role '${userRole}' is not authorized for this action`,
    });
  }

  next();
};

export default authorize;
