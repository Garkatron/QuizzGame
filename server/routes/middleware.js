import jwt from "jsonwebtoken";

/**
 * Middleware to authenticate the requester using their session token.
 * If valid, attaches the user object to `req.user`.
 * @param {*} req - Express request object
 * @param {*} res - Express response object
 * @param {*} next - Express next middleware function
 */
export function middleware_authenticate_token(req, res, next) {
    const header = req.headers["authorization"];
    const token = header && header.split(" ")[1];

    if (!token) return res.status(401).json({ success: false, message: "Without token" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: "Invalid Token" });

        req.user = user;
        next();
    });
}

/**
 * Middleware to check if the authenticated user has the required permissions.
 * Returns 403 if the user lacks any of the specified permissions.
 * @param {string[]} requiredPermissions - Array of permission names required for this endpoint
 * You can see the permissions in ../constants.js
 */
export function authorize_permissions(requiredPermissions) {
    return (req, res, next) => {
        const userPermissions = req.user.permissions || {};
        const hasPermission = requiredPermissions.every(p => userPermissions[p] === true);
        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: "Forbidden",
                errors: ["You don't have the required permissions"],
            });
        }
        next();
    };
}
