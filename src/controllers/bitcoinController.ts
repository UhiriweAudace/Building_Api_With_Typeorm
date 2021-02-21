import { getRepository } from "typeorm"
import { Response, Request } from "express";
import { validate } from "class-validator";
import { BitcoinPrice, User } from "../database";
import { FormatApiError, Constants } from "../helpers";

type ErrorInfo = { path: string, message: string }
export class BitcoinController {
    static async UpdateBitcoin(request: Request, response: Response) {
        const promise: Promise<{ status: number, response: any }> = new Promise(async (resolve, reject) => {
            try {

                let fieldErrors: ErrorInfo[] = [];
                ["price", "updatedAt"].forEach(field => {
                    if (!Object.keys(request.body).includes(field)) {
                        let error: ErrorInfo = { path: "", message: "" };
                        error.path = field;
                        error.message = ` ${field} is required`;
                        fieldErrors.push(error)
                    }
                });
                if (fieldErrors.length > 0) throw { name: Constants.INVALID_REQUEST_FORMAT, errors: fieldErrors };
                const bitcoinRepo = getRepository(BitcoinPrice)
                const bitcoin = bitcoinRepo.create({ ...request.body });
                const errors = await validate(bitcoin);
                if (errors.length) throw { name: Constants.INVALID_REQUEST_DATA, errors: errors };
                const result = await bitcoinRepo.save(bitcoin).catch((err) => { throw new Error(err) });
                return resolve({ status: 200, response: result })
            } catch (error) {
                const apiError = FormatApiError(error);
                return resolve({
                    status: apiError.code,
                    response: apiError.body,
                });
            }
        });
        response.status((await promise).status).send((await promise).response)
    }
}
