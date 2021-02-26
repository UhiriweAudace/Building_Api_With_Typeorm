import { createConnection, Connection, ConnectionOptions } from "typeorm";

import { User } from "@entity/User";
import { BitcoinPrice } from "@entity/BitcoinPrice";
import { BitcoinTransfer } from "@entity/BitcoinTransfer";
import { UsdTransfer } from "@entity/UsdTransfer";
import { AppConfig, DatabaseConfig } from "@configs/index";

const initConnection = async (): Promise<Connection> => {
    const DbConfig: ConnectionOptions = DatabaseConfig(AppConfig.environment);
    return await createConnection({
        ...DbConfig,
        entities: [User, UsdTransfer, BitcoinPrice, BitcoinTransfer],
        synchronize: true,
        logging: false
    }).catch((err) => { throw new Error(err) });
};

export {
    User,
    UsdTransfer,
    BitcoinPrice,
    BitcoinTransfer,
    initConnection
}