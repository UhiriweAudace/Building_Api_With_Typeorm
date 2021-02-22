import { error as Constants } from "./Constants"

type ErrorInfo = { path: string, message: string }

export const FormatUserRequest = (data, required = []) => {
    const values = new Object(data);

    let fieldErrors: ErrorInfo[] = [];
    required.forEach(field => {
        if (!Object.keys(data).includes(field)) {
            let error: ErrorInfo = { path: "", message: "" };
            error.path = field;
            error.message = ` ${field} is required`;
            fieldErrors.push(error)
        }
    });
    if (fieldErrors.length) throw { name: Constants.INVALID_REQUEST_FORMAT, errors: fieldErrors };

    return values;
};