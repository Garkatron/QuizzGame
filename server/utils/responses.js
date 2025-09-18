function send_response(res, statusCode, success, message = "", data = null) {
    const response = { success, message };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
}

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
