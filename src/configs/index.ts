import { config } from "dotenv";

config();

const AppConfig = {
    environment: process.env.NODE_ENV,
    appPort: process.env.APP_PORT,
    hostname: process.env.APP_HOST,
    appName: process.env.APP_NAME
}

const DatabaseConfig = (environment: string) => {
    environment = environment.toUpperCase();
    return {
        type: process.env.DB_DRIVER as "postgres",
        host: process.env[`DB_${environment}_HOST`],
        port: Number(process.env[`DB_${environment}_PORT`]),
        username: process.env[`DB_${environment}_USERNAME`],
        password: process.env[`DB_${environment}_PASSWORD`],
        database: process.env[`DB_${environment}_NAME`],
        ssl: process.env[`DB_${environment}_SSL`] === 'TRUE',
    };
};

export { AppConfig, DatabaseConfig }