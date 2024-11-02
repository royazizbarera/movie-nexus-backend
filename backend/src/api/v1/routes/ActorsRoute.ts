import express from "express";
import actorController from "../controllers/ActorController";
import movieController from "../controllers/MovieController";
import {verifyToken} from "../middlewares/verifyToken";

const router = express.Router();

router.get("/", actorController.getActors);

router.get("/:id", actorController.getActorById);

router.post("/", verifyToken, actorController.createActor);

router.delete("/:id", verifyToken, actorController.deleteActorById);

router.put("/:id", verifyToken, actorController.updateActorById);

export default router;