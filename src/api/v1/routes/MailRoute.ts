import { Router } from "express";

import MailController from "../controllers/MailController";
import { verifyToken } from "../middlewares/verifyToken";

const router = Router();

router.post("/send-mail", verifyToken, MailController.sendMail);

export default router;
