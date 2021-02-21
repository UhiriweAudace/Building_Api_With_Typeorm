
import { error as E } from "./Constants";

/**
 * This method format the API Error Message
 * It accepts the error object.
 * @param   { String                     } error
 * @returns   { Object(code, body   } 
 */
export const FormatApiError = error => {

    //Assign error an empty array if not given
    error.errors = error.errors ? error.errors : [];
    switch (error.name) {

        // Returns 400 if invalid request format data was provided
        case E.INVALID_REQUEST_FORMAT:
            return { code: 400, body: { errors: FormatValidationError(error) } };

        // Returns 400 if invalid request data was provided
        case E.INVALID_REQUEST_DATA:
            return { code: 400, body: { errors: FormatValidationError(error) } };

        case E.DATA_NOT_FOUND:
            return { code: 404, body: { message: `${error.field} ${error.name}` } }

        case E.INSUFFICIENT_BALANCE:
            return { code: 422, body: { message: error.name, field: error.field } }

    }

    // Returns 500 the error can not be resolved
    return { code: 500, body: { message: E.INTERNAL_SERVER_ERROR, errors: FormatValidationError(error) } };
};



const FormatValidationError = (response: any) => {
    const error = response.errors || [];
    if (response.error) {
        error.push(response.error);
    }
    if (response.name === E.INVALID_REQUEST_DATA) {
        return response.errors.map((error) => {
            return {
                field: error.property,
                message: Object.entries(error.constraints)[0][1]
            }
        })
    }
    return error.map(object => {
        return (object = {
            field: object.path,
            message: object.message ? object.message.replace(/^.*?\./i, '') : null,
        });
    });
};
