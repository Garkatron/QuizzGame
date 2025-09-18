import { ERROR_MESSAGES, REGEX } from "../constants.js";


export function is_valid_string(str) {
    return typeof str === "string" && str.trim().length > 0;
}


export function has_valid_name(name) {
    if (!is_valid_string(name)) throw new Error(ERROR_MESSAGES.INVALID_NAME);
}


export function has_valid_password(password) {
    if (!is_valid_string(password) || !REGEX.PASSWORD_SIMPLE.test(password)) throw new Error(ERROR_MESSAGES.INVALID_PASSWORD);
}

export function has_valid_email(email) {
    if (!is_valid_string(email) || !REGEX.EMAIL.test(email)) throw new Error(ERROR_MESSAGES.INVALID_EMAIL);
}

export function has_ownership_or_admin(user, resourceOwnerId) {
    if (!(user.permissions.get("ADMIN") || user._id.equals(resourceOwnerId))) {
        throw Error(ERROR_MESSAGES.NEED_OWNERSHIP_OR_ADMIN);
    }
}
