import { ERROR_MESSAGES, UserPermissions } from "../constants.js";

export function has_ownership_or_admin(user, resourceOwnerId) {
    if (!(user.permissions.get(UserPermissions.ADMIN) || user._id.equals(resourceOwnerId))) {
        throw Error(ERROR_MESSAGES.NEED_OWNERSHIP_OR_ADMIN);
    }
}
