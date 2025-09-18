import { has_valid_email, has_valid_name, has_valid_password, is_valid_string } from "../utils/format.js";
import { compare_password, hash_password } from "../utils/hashing.js";
import { ERROR_MESSAGES, UserPermissions } from "../constants.js";
import { send_response_successful, send_response_unsuccessful } from "../utils/responses.js"
import User from "../models/User.js";
import { has_ownership_or_admin } from "../utils/utils.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        has_valid_name(name);

        const user = await User.findOne({ name });
        if (user) throw new Error(ERROR_MESSAGES.USER_EXISTS);

        has_valid_email(email);
        await email_not_used(email);

        has_valid_password(password);

        const newUser = new User({
            name,
            email,
            password: await hash_password(password),
            permissions: {
                [UserPermissions.ADMIN]: false,
                [UserPermissions.EDIT_QUESTION]: true,
                [UserPermissions.DELETE_QUESTION]: true,
                [UserPermissions.CREATE_QUESTION]: true,
                [UserPermissions.CREATE_COLLECTION]: true,
                [UserPermissions.EDIT_COLLECTION]: true,
                [UserPermissions.DELETE_COLLECTION]: true,
                [UserPermissions.EDIT_USER]: true,
                [UserPermissions.DELETE_USER]: true,
                [UserPermissions.CREATE_USER]: true,
            },
            score: 0
        });

        await newUser.save();

        return send_response_successful(res, "User created succefully", { _id: newUser._id, name: newUser.name, email: newUser.email })

    } catch (error) {
        return send_response_unsuccessful(res, [error.message]);
    }
}

export const loginUser = async (req, res) => {
    try {
        const { name, password } = req.body;

        const user = await user_exists({ name });

        const isMatch = await compare_password(password, user.password);
        if (!isMatch) {
            return send_response_unsuccessful(res, [ERROR_MESSAGES.INVALID_PASSWORD]);
        }

        const accessToken = generate_access_token(name, user.permissions);

        return send_response_successful(res, "Login successful", {
            user: { _id: user._id, name: user.name, email: user.email, permissions: user.permissions },
            accessToken
        });

    } catch (error) {
        return send_response_unsuccessful(res, [error.message]);
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { name } = req.body;

        has_valid_name(name);

        const user = await user_exists({ name: req.user.name });
        const userToDelete = await user_exists({ name });

        has_ownership_or_admin(user, userToDelete._id);

        const deleted = await userToDelete.deleteOne();

        return send_response_successful(res, deleted);

    } catch (error) {
        return send_response_unsuccessful(res, [error.message]);
    }
}

export const editUser = async (req, res) => {
    try {
        const { previousName, newName, newEmail, newPassword } = req.body;

        const userToUpdate = await user_exists({ name: previousName });
        const editor = await user_exists({ name: req.user.name });

        has_ownership_or_admin(editor, userToUpdate._id);

        const updates = {};

        if (newName?.trim() && is_valid_string(newName)) {
            updates.name = newName.trim();
        }

        if (newEmail?.trim()) {
            has_valid_email(newEmail);
            updates.email = newEmail.trim();
        }

        if (newPassword?.trim()) {
            has_valid_password(newPassword);
            const hashed = await hash_password(newPassword);
            updates.password = hashed;
        }

        if (Object.keys(updates).length > 0) {
            await userToUpdate.updateOne(updates);
        }

        return send_response_successful(res, "User edited successfully", userToUpdate);

    } catch (error) {
        return send_response_unsuccessful(res, [error.message]);
    }
}

export const getUsers = async (req, res) => {
    try {

        const users = await User.find().select("name username permissions");

        return send_response_successful(res, "Login successful", users);

    } catch (error) {
        return send_response_unsuccessful(res, [error.message]);
    }
}

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
