import * as express from 'express';
import { UserController, BitcoinController } from "@controllers/index";

const router = express.Router();

router.post("/users", UserController.signUp);
router.get("/users/:id", UserController.getUserDetails);
router.put("/users/:id", UserController.updateUserDetails);
router.post("/users/:userId/usd", UserController.createUSDTransaction);

router.put("/bitcoin", BitcoinController.UpdateBitcoin);
router.get("/bitcoin", BitcoinController.getBitcoinDetails);
router.post("/users/:userId/bitcoins", UserController.createBitcoinTransaction);

router.get('/users/:userId/balance', UserController.getUserBalance);

router.use("*", (request: express.Request, response: express.Response) => {
    response.status(501).send({ message: "Endpoint not implemented" })
});

export default router;
