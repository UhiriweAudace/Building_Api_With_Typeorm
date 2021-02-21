import { getRepository } from "typeorm"
import { Response, Request } from "express";
import { User } from "../database"

export class UserController {
    static async signUp(request: Request, response: Response) {
        const promise: Promise<{ code: number, result: any }> = new Promise(async (resolve, reject) => {
            try {
                const userRepo = getRepository(User)
                const user = userRepo.create({ ...request.body });
                const info = await userRepo.save(user).catch((err) => { throw new Error(err) });
                return { code: 200, result: "success" }
            } catch (error) {
                console.log("error=============", error.name)
                return resolve({ code: 500, result: "Something went wrong" })
            }
        });

        response.status((await promise).code).send((await promise).result)
    }
}
