import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { CONFIG } from "../constants.js";


class PasswordHashError extends Error {
    constructor() {
        super("Can't hash the password");
        this.name = "PasswordHashError";
    }
}

class PasswordSaltError extends Error {
    constructor() {
        super("Can't generate salt");
        this.name = "PasswordSaltError";
    }
}

class PasswordCompareError extends Error {
    constructor() {
        super("Can't compare password");
        this.name = "PasswordCompareError";
    }
}



export async function hash_password(password) {
    try {
        const salt = await bcrypt.genSalt(CONFIG.PASSWORD_SALT_ROUNDS);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (err) {
        if (err.message.includes("salt")) {
            throw new PasswordSaltError();
        }
        throw new PasswordHashError();
    }
}

export async function compare_password(password, hash) {
    try {
        return await bcrypt.compare(password, hash);
    } catch {
        throw new PasswordCompareError();
    }
}


export function generate_access_token(user_name, user_permissions) {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not definied");
    return jwt.sign({
        name: user_name,
        permissions: user_permissions
    }, process.env.JWT_SECRET, { expiresIn: "1h" });
}