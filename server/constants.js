// ? Config
export const SERVER_PORT = 3000;

// ? Security
export const PASSWORD_SALT_ROUNDS = 10;
export const REGEX_PASSWORD = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
export const REGEX_PASSWORD_SIMPLE = /^.{8,}$/;
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
export const QUESTION_ALREADY_EXISTS = "Question already exists";
export const INVALID_STRING = "Invalid string";
export const INVALID_OPTIONS_ARRAY = "At least 2 options required";
export const OPTIONS_MUST_INCLUDE_ANSWER = "Answer must be one of the options";

// ? Admin Permissions
export const UserPermissions = {
    ADMIN: "ADMIN",

    EDIT_QUESTION: "EDIT_QUESTION",
    DELETE_QUESTION: "DELETE_QUESTION",
    CREATE_QUESTION: "CREATE_QUESTION",

    EDIT_USER: "EDIT_USER",
    DELETE_USER: "DELETE_USER",
    CREATE_USER: "CREATE_USER",
}