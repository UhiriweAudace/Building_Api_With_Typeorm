import "module-alias/register";
import "reflect-metadata";
import * as express from "express";

import AppRoutes from "@routes/";
import { AppConfig } from "@configs/"
import { initConnection } from "@database/";

const app: express.Application = express();

app.use(express.json());

app.use("/api", (request, response) => {
    return response.status(200).send({ message: 'Welcome to substrata Api' })
});

app.use(AppRoutes);

app.use((error: Error, request: express.Request, response: express.Response) => {
    return response.status(500).send({ message: error.message, errors: [] })
})

initConnection().then(() => {
    console.log("[Database]: connected successfully!")
    app.listen(
        AppConfig.appPort,
        () => console.log(`Substrata Api is running on port ${AppConfig.appPort}`)
    );
}).catch(error => {
    console.log(error.message)
    process.exit(1);
});

