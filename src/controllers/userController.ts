import { getRepository } from "typeorm"
import { Response, Request } from "express";
import { validate } from "class-validator";
import { User } from "../database";
import { FormatUserRequest, FormatApiError, Constants } from "../helpers";

type ErrorInfo = { path: string, message: string }
export class UserController {
    static async signUp(request: Request, response: Response) {
        const promise: Promise<{ status: number, response: any }> = new Promise(async (resolve, reject) => {
            try {
                const values = FormatUserRequest(request.body, ["name", "username", "email"]);
                const userRepo = getRepository(User)
                const user = userRepo.create(values);
                const errors = await validate(user);
                if (errors.length) throw { name: Constants.INVALID_REQUEST_DATA, errors: errors };
                const result = await userRepo.save(user).catch((err) => { throw new Error(err) });
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
