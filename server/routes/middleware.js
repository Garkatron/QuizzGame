import jwt from "jsonwebtoken";

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