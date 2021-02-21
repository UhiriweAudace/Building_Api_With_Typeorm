import "module-alias/register";
import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";

import { AppConfig } from "./configs"
import AppRoutes from "./routes";

const app: express.Application = express();

app.use(express.json());

app.use(AppRoutes);

createConnection().then(() => {
    console.log("[Database]: connected successfully!")
    app.listen(
        AppConfig.appPort,
        () => console.log(`Substrata Api is running on port ${AppConfig.appPort}`)
    );
}).catch(error => {
    process.exit(1);
});
