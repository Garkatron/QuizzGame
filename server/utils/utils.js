import bcrypt from "bcryptjs";
import { EMAIL_TAKEN, INVALID_NAME, INVALID_PASSWORD, PASSWORD_SALT_ROUNDS, REGEX_EMAIL, REGEX_PASSWORD, REGEX_PASSWORD_SIMPLE, USER_EXISTS, USER_NOT_EXISTS } from "../constants.js"
import { INVALID_EMAIL } from "../constants.js"
import { User } from "../db/models.js";

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

// * DB

export async function user_not_exists(name) {
    const user = await User.findOne({ name });
    if (user) throw new Error(USER_EXISTS);
}

export async function user_exists(name) {
    const user = await User.findOne({ name });
    if (!user) throw new Error(USER_NOT_EXISTS);
}

export async function does_user_exist(name) {
    const user = await User.findOne({ name });
    return !!user;
}

export async function email_not_used(email) {
    const user = await User.findOne({ email });
    if (user) throw new Error(EMAIL_TAKEN);
}

export async function is_email_used(email) {
    const user = await User.findOne({ email });
    return !!user;
}

// * STRING


export function is_valid_string(str) {
    return typeof str === "string" && str.trim().length > 0;
}

/**
 * If the name isn't valid, trows and exception
 * @param {string} name 
 */
export function has_valid_name(name) {
    if (!is_valid_string(name)) throw new Error(INVALID_NAME);
}

/**
 * If the password isn't valid, trows and exception
 * @param {string} password 
 */
export function has_valid_password(password) {
    if (!is_valid_string(password) || !REGEX_PASSWORD_SIMPLE.test(password)) throw new Error(INVALID_PASSWORD);
}


/**
 * If the email isn't valid, trows and exception
 * @param {string} email 
 */
export function has_valid_email(email) {
    if (!is_valid_string(email) || !REGEX_EMAIL.test(email)) throw new Error(INVALID_EMAIL);
}

// * RESPONSES

export function send_response_unsuccessful(res, message, error) {
    return res.status(400).json({
        success: false,
        message,
        error
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