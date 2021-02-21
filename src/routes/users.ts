import * as express from 'express'
// import logger from "morgan";
import { UserController } from "../controllers"

const router = express.Router()
// if (process.env.Environment === "Development") {
//     router.use(logger("combined"));
// }

router.use("/users", UserController.signUp);
router.use("/bitcoins", () => { })

export default router;