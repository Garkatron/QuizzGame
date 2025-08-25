import bcrypt from "bcryptjs";
import { PASSWORD_SALT_ROUNDS, REGEX_EMAIL, REGEX_PASSWORD } from "./constants.js"

// * PASSWORD

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
        const salt = await bcrypt.genSalt(PASSWORD_SALT_ROUNDS);
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

// * STRING

export function validate_string(str) {
    return typeof str === "string" && str.trim().length > 0;
}

export function validate_name(name) {
    return validate_string(name);
}

export function validate_password(password) {
    return validate_string(password) && REGEX_PASSWORD.test(password);
}

export function validate_email(email) {
    return validate_string(email) && REGEX_EMAIL.test(email);
}

// * RESPONSES

export function send_response_unsuccessful(res, message, errors = []) {
    return res.status(400).json({
        success: false,
        message,
        errors
    });
}

export function send_response_failed_at(res, message, error) {
    return res.status(500).json({
        success: false,
        message,
        errors: [error.message]
    });
}

export function send_response_successful(res, message, data) {
    return res.status(200).json({
        success: true,
        message,
        data
    });
}

export function send_response_not_found(res, message, errors = []) {
    return res.status(404).json({
        success: false,
        message: message,
        errors: errors
    });
}