// config
export const CONFIG = {
    SERVER_PORT: 3000,
    PASSWORD_SALT_ROUNDS: 10,
    MIN_OPTIONS: 2,
};

// Regex y seguridad
export const REGEX = {
    PASSWORD: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
    PASSWORD_SIMPLE: /^.{8,}$/, // ! Testing, not production.
    EMAIL: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
};

// Mensajes de error
export const ERROR_MESSAGES = {
    INVALID_NAME: "Your user name is invalid.",
    INVALID_PASSWORD: "Your password is invalid.",
    INVALID_EMAIL: "Your email is invalid.",
    USER_EXISTS: "This user already exists.",
    EMAIL_TAKEN: "This email is already in use.",
    NOT_FOUND_USER: "No user exists with this name.",
    USER_NOT_EXISTS: "User not exists.",
    QUESTION_NOT_FOUND: "Question not found.",
    COLLECTION_NOT_FOUND: "Collection not found.",
    QUESTION_ALREADY_EXISTS: "Question already exists",
    INVALID_STRING: "Invalid string",
    INVALID_OPTIONS_ARRAY: "At least 2 options required",
    OPTIONS_MUST_INCLUDE_ANSWER: "Answer must be one of the options",
    INVALID_TAGS_ARRAY: "Invalid tags array",
    INVALID_QUESTIONS_ARRAY: "Invalid questions array",
    COLLECTION_ALREADY_EXISTS: "Collection already exists.",
    NEED_OWNERSHIP_OR_ADMIN: "You must be owner or admin to edit this",
    NEED_ANSWER: "Your question needs an answer.",
    MISSING_PARAMETERS: "Missing parameters."
};

// Permisos de usuario/admin
export const UserPermissions = {
    ADMIN: "ADMIN",
    EDIT_QUESTION: "EDIT_QUESTION",
    DELETE_QUESTION: "DELETE_QUESTION",
    CREATE_QUESTION: "CREATE_QUESTION",
    CREATE_COLLECTION: "CREATE_COLLECTION",
    EDIT_COLLECTION: "EDIT_COLLECTION",
    DELETE_COLLECTION: "DELETE_COLLECTION",
    EDIT_USER: "EDIT_USER",
    DELETE_USER: "DELETE_USER",
    CREATE_USER: "CREATE_USER",
};
