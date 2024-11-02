import express from "express";
import awardController from "../controllers/AwardController";
import {verifyToken} from "../middlewares/verifyToken";

const router = express.Router();

router.get("/", awardController.getAwards);

router.get("/:id", awardController.getAwardById);

router.post("/", verifyToken, awardController.createAward);

router.put("/:id", verifyToken, awardController.updateAwardById);

router.delete("/:id", verifyToken, awardController.deleteAwardById);

export default router;