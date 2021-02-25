import { Constants } from "@helpers/index"

interface IErrorInfo { path: string, message: string }

/**
 * This method formats the request body based on the
 * required field and/or optional field 
 * @param data data object to be validated
 * @param required required fields
 * @param optional optional fields
 * @returns {object} valid data object
 */
export const FormatUserRequest = (data, required = [], optional = []) => {
    const values = new Object(data);
    let fieldErrors: IErrorInfo[] = [];
    let error: IErrorInfo
    required.forEach(field => {
        if (!Object.keys(data).includes(field)) {
            error.path = field;
            error.message = ` ${field} is required`;
            fieldErrors.push(error)
        }
    });

    Object.keys(data).forEach((field) => {
        if (!required.includes(field) || !optional.includes(field)) {
            error.path = field;
            error.message = `This field "${field}" is not allowed to be a part of this request`;
            fieldErrors.push(error)
        }
    });

    if (fieldErrors.length) throw { name: Constants.INVALID_REQUEST_FORMAT, errors: fieldErrors };
    return values;
};