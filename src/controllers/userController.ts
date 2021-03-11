import { getRepository } from "typeorm"
import { Response, Request } from "express";
import { validate } from "class-validator";
import { v4 as uuid } from "uuid";
import { BitcoinPrice, BitcoinTransfer, UsdTransfer, User } from "@database/";
import { FormatUserRequest, FormatApiError, Constants } from "@helpers/index";

interface IApiResponse { status: number, response: any }
export class UserController {
    static async signUp(request: Request, response: Response) {
        const promise: Promise<IApiResponse> = new Promise(async (resolve, reject) => {
            try {
                const values = FormatUserRequest(request.body, ["name", "username", "email"]);
                const userRepo = getRepository(User)
                const user = userRepo.create(<object>Object.assign(values, { usdBalance: 0, bitcoinAmount: 0 }));
                const errors = await validate(user);
                if (errors.length) throw { name: Constants.INVALID_REQUEST_DATA, errors: errors };
                const result = await userRepo.save(user).catch((err) => { throw err });
                return resolve({ status: 201, response: result })
            } catch (error) {
                const apiError = FormatApiError(error);
                return resolve({ status: apiError.code, response: apiError.body });
            }
        });
        return response.status((await promise).status).send((await promise).response)
    }

    static async getUserDetails(request: Request, response: Response) {
        const promise: Promise<IApiResponse> = new Promise(async (resolve, reject) => {
            try {
                FormatUserRequest(request.params, ["id"])
                const userRepo = getRepository(User)
                const result = await userRepo.findOne({ where: { id: request.params.id } })
                    .catch(() => { throw { name: Constants.DATA_NOT_FOUND, field: "User" } });
                if (!result) throw { name: Constants.DATA_NOT_FOUND, field: "User" }
                return resolve({ status: 200, response: result })
            } catch (error) {
                const apiError = FormatApiError(error);
                return resolve({ status: apiError.code, response: apiError.body });
            }
        });
        return response.status((await promise).status).send((await promise).response)
    }

    static async updateUserDetails(request: Request, response: Response) {
        const promise: Promise<IApiResponse> = new Promise(async (resolve, reject) => {
            try {
                FormatUserRequest(request.params, ["id"])
                FormatUserRequest(request.body, [], ["name", "username", "email"])
                const userRepo = getRepository(User)
                const user = await userRepo.findOne({ where: { id: request.params.id } })
                    .catch(() => { console.log(Constants.DATA_NOT_FOUND) });
                if (!user) throw { name: Constants.DATA_NOT_FOUND, field: "User" }

                user.name = request.body.name || user.name;
                user.username = request.body.username || user.username;
                user.email = request.body.email || user.email
                const errors = await validate(user);
                if (errors.length) throw { name: Constants.INVALID_REQUEST_DATA, errors: errors };

                const result = await userRepo.save(user).catch((err) => { throw new Error(err) });
                return resolve({ status: 200, response: result });
            } catch (error) {
                const apiError = FormatApiError(error);
                return resolve({ status: apiError.code, response: apiError.body });
            }
        });
        return response.status((await promise).status).send((await promise).response)
    }

    static async createUSDTransaction(request: Request, response: Response) {
        const promise: Promise<IApiResponse> = new Promise(async (resolve, reject) => {
            try {
                FormatUserRequest(request.params, ["userId"]);
                const values = FormatUserRequest(request.body, ["action", "amount"]);

                const user = await User.findOne({ where: { id: request.params.userId } })
                    .catch(() => { console.log(Constants.DATA_NOT_FOUND) });
                if (!user) throw { name: Constants.DATA_NOT_FOUND, field: "User" };

                const usdTransferRepo = getRepository(UsdTransfer);
                const usdTransfer = usdTransferRepo.create(values);
                const errors = await validate(usdTransfer);
                if (errors.length) throw { name: Constants.INVALID_REQUEST_DATA, errors: errors };

                if (user.usdBalance < usdTransfer.amount && usdTransfer.action === "withdraw")
                    throw { name: Constants.INSUFFICIENT_BALANCE, field: "amount" };

                if (usdTransfer.action === "withdraw")
                    user.usdBalance = ((user.usdBalance) - (usdTransfer.amount));
                if (usdTransfer.action === "deposit")
                    user.usdBalance = ((user.usdBalance) + (usdTransfer.amount));

                await user.save().catch((err) => { throw new Error(err) });
                usdTransfer.user = user;
                const result = await usdTransferRepo.save(usdTransfer).catch((err) => { throw new Error(err) });
                return resolve({ status: 201, response: result })
            } catch (error) {
                const apiError = FormatApiError(error);
                return resolve({ status: apiError.code, response: apiError.body });
            }
        });
        return response.status((await promise).status).send((await promise).response)
    }

    static async createBitcoinTransaction(request: Request, response: Response) {
        const promise: Promise<IApiResponse> = new Promise(async (resolve, reject) => {
            try {
                FormatUserRequest(request.params, ["userId"]);
                const values = FormatUserRequest(request.body, ["action", "amount"]);

                const user = await User.findOne({ where: { id: request.params.userId } })
                    .catch(() => { console.log(Constants.DATA_NOT_FOUND) });
                if (!user) throw { name: Constants.DATA_NOT_FOUND, field: "User" };

                const bitcoinTransferRepo = getRepository(BitcoinTransfer);
                const bitcoinTransfer = bitcoinTransferRepo.create(values);
                const errors = await validate(bitcoinTransfer);
                if (errors.length) throw { name: Constants.INVALID_REQUEST_DATA, errors: errors };

                const bitcoinPriceRepo = getRepository(BitcoinPrice);
                const bitcoin = await bitcoinPriceRepo.findOne({ select: ["id", "price", "createdAt", "updatedAt"] });
                if (!bitcoin) throw { name: Constants.DATA_NOT_FOUND, field: "Bitcoin price -" }
                if ((user.bitcoinAmount * bitcoin.price) < bitcoinTransfer.amount && bitcoinTransfer.action === "sell")
                    throw { name: Constants.INSUFFICIENT_BALANCE, field: "amount" };

                if (bitcoinTransfer.action === "sell")
                    user.bitcoinAmount = ((user.bitcoinAmount * bitcoin.price) - (bitcoinTransfer.amount))/bitcoin.price;
                if (bitcoinTransfer.action === "buy")
                    user.bitcoinAmount = ((user.bitcoinAmount) + (bitcoinTransfer.amount / bitcoin.price));
                
                await user.save().catch((err) => { throw new Error(err) });
                bitcoinTransfer.user = user;
                const result = await bitcoinTransferRepo.save(bitcoinTransfer).catch((err) => { throw new Error(err) });
                return resolve({ status: 201, response: result });
            } catch (error) {
                const apiError = FormatApiError(error);
                return resolve({ status: apiError.code, response: apiError.body });
            }
        });
        return response.status((await promise).status).send((await promise).response)
    }

    static async getUserBalance(request: Request, response: Response) {
        const promise: Promise<IApiResponse> = new Promise(async (resolve, reject) => {
            try {
                FormatUserRequest(request.params, ["userId"])
                const userRepo = getRepository(User)
                const user = await userRepo.findOne({ where: { id: request.params.userId }, select: ["id", "name", "usdBalance", "bitcoinAmount", "updatedAt"] })
                    .catch(() => console.log(Constants.DATA_NOT_FOUND));
                if (!user) throw { name: Constants.DATA_NOT_FOUND, field: "User" }

                const bitcoinPriceRepo = getRepository(BitcoinPrice);
                const bitcoin = await bitcoinPriceRepo.findOne({ select: ["id", "price", "createdAt", "updatedAt"] })
                if (!bitcoin) throw { name: Constants.DATA_NOT_FOUND, field: "Bitcoin price -" }

                const conversionPrice = bitcoin.price;
                const totalBalance = ((user.usdBalance) + (user.bitcoinAmount * conversionPrice))
                return resolve({ status: 200, response: { ...user, total_balance: `$${totalBalance}` } })
            } catch (error) {
                const apiError = FormatApiError(error);
                return resolve({ status: apiError.code, response: apiError.body });
            }
        });
        return response.status((await promise).status).send((await promise).response)
    }
}
