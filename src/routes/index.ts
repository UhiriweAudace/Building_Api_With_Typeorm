import * as express from 'express';
import { UserController, BitcoinController } from "../controllers";

const router = express.Router();

router.post("/users", UserController.signUp);
router.get("/users/:id", UserController.getUserDetails)
router.put("/bitcoin", BitcoinController.UpdateBitcoin);
router.get("/bitcoin", BitcoinController.getBitcoinDetails);

router.use("*", (request: express.Request, response: express.Response) => {
    response.status(404).send({ message: "Endpoint not found" })
})

export default router;





// import logger from "morgan";
// if (process.env.Environment === "Development") {
//     router.use(logger("combined"));
// }