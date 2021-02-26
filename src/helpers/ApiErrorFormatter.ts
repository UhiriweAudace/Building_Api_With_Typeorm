
import { Constants as E } from "@helpers/index";

/**
 * This method format the API Error,
 * It accepts the error object.
 * @param error provided error
 */
export const FormatApiError = (error: any): { code: number, body: object } => {

    //Assign error an empty array if not given
    error.errors = error.errors ? error.errors : [];
    switch (error.name) {
        // Returns 400 if invalid request format data was provided
        // Returns 400 if invalid request data was provided
        case E.INVALID_REQUEST_FORMAT:
        case E.INVALID_REQUEST_DATA:
            return { code: 400, body: { errors: FormatValidationError(error) } };

        case E.DATA_NOT_FOUND:
            return { code: 404, body: { message: `${error.field} ${error.name}` } };

        case E.INSUFFICIENT_BALANCE:
            return { code: 422, body: { message: error.name, field: error.field } };
    }

    // Returns 500 for errors uncatched
    return {
        code: 500,
        body: {
            message: E.INTERNAL_SERVER_ERROR,
            errors: FormatValidationError(error)
        }
    };
};

const FormatValidationError = (response: any) => {
    const error = response.errors || [];
    if (response.error) {
        error.push(response.error);
    }
    if (response.name === E.INVALID_REQUEST_DATA) {
        return response.errors.map((error: any): { field: string, message: string } => {
            return {
                field: error.property,
                message: <string>Object.entries(error.constraints)[0][1]
            }
        })
    }
    return error.map((object: any): { field: string, message: string } => {
        return (object = {
            field: object.path,
            message: object.message ? object.message.replace(/^.*?\./i, '') : null,
        });
    });
};
