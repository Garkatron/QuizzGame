import bcrypt from "bcryptjs";
import { EMAIL_TAKEN, INVALID_NAME, INVALID_PASSWORD, PASSWORD_SALT_ROUNDS, REGEX_EMAIL, REGEX_PASSWORD, REGEX_PASSWORD_SIMPLE, USER_EXISTS, USER_NOT_EXISTS } from "../constants.js"
import { INVALID_EMAIL } from "../constants.js"
import { User } from "../db/models.js";
import jwt from "jsonwebtoken";

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
/*
export async function user_not_exists({ name, id, email }) {
    let query = null;

    if (id) {
        query = { _id: id };
    } else if (email) {
        query = { email };
    } else if (name) {
        query = { name };
    } else {
        throw new Error("Should provide name, id or email.");
    }

    const user = await User.findOne(query);
    if (user) throw new Error(USER_EXISTS);

    return null;
}*/


export async function user_exists({ name, id, email }) {
    let query = null;

    if (id) {
        query = { _id: id };
    } else if (email) {
        query = { email };
    } else if (name) {
        query = { name };
    } else {
        throw new Error("Should provide name, id or email.");
    }

    const user = await User.findOne(query);
    if (!user) throw new Error(USER_NOT_EXISTS);

    return user;
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

function send_response(res, statusCode, success, message = "", data = null) {
    const response = { success, message };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
}

// Helpers específicos
export function send_response_successful(res, message, data) {
    return send_response(res, 200, true, message, data);
}

export function send_response_unsuccessful(res, errors = []) {
    return send_response(res, 400, false, errors.join(", "));
}

export function send_response_failed_at(res, errors = []) {
    return send_response(res, 500, false, errors.join(", "));
}

export function send_response_not_found(res, errors = []) {
    return send_response(res, 404, false, errors.join(", "));
}

// Tokens

export function generate_access_token(user_name, user_permissions) {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not definied");
    return jwt.sign({
        name: user_name,
        permissions: user_permissions
    }, process.env.JWT_SECRET, { expiresIn: "1h" });
}