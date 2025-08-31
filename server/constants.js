// ? Config
export const SERVER_PORT = 3000;

// ? Security
export const PASSWORD_SALT_ROUNDS = 10;
export const REGEX_PASSWORD = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
export const REGEX_PASSWORD_SIMPLE = /^.{8,}$/; // ! Testing, not production.
export const REGEX_EMAIL = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const MIN_OPTIONS = 2;

// ? Errors
export const INVALID_NAME = "Your user name is invalid.";
export const INVALID_PASSWORD = "Your password is invalid.";
export const INVALID_EMAIL = "Your email is invalid.";
export const USER_EXISTS = "This user already exists."
export const EMAIL_TAKEN = "This email is already in use.";
export const NOT_FOUND_USER = "Not exists an user with this name";
export const USER_NOT_EXISTS = "User not exists.";
export const QUESTION_NOT_FOUND = "Question not found.";
export const COLLECTION_NOT_FOUND = "Collection not found.";
export const QUESTION_ALREADY_EXISTS = "Question already exists";
export const INVALID_STRING = "Invalid string";
export const INVALID_OPTIONS_ARRAY = "At least 2 options required";
export const OPTIONS_MUST_INCLUDE_ANSWER = "Answer must be one of the options";
export const INVALID_TAGS_ARRAY = "Invalid tags array";
export const INVALID_QUESTIONS_ARRAY = "Invalid questions array";
export const COLLECTION_ALREADY_EXISTS = "Collection already exists.";
export const NEED_OWNERSHIP_OR_ADMIN = "You msut be owner or admin to edit this";
export const NEED_ANSWER = "Your question need an answer.";
export const MISSING_PARAMETERS = "Missing parameters.";

// ? Admin Permissions
export const UserPermissions = {
    ADMIN: "ADMIN", // Allows the user to access admin content and manipulate resources they don't own.

    EDIT_QUESTION: "EDIT_QUESTION",
    DELETE_QUESTION: "DELETE_QUESTION",
    CREATE_QUESTION: "CREATE_QUESTION",

    CREATE_COLLECTION: "CREATE_COLLECTION",
    EDIT_COLLECTION: "EDIT_COLLECTION",
    DELETE_COLLECTION: "DELETE_COLLECTION",

    EDIT_USER: "EDIT_USER",
    DELETE_USER: "DELETE_USER",
    CREATE_USER: "CREATE_USER",
}