import express from "express";
import actorController from "../controllers/ActorController";
import movieController from "../controllers/MovieController";

const router = express.Router();

router.get("/", actorController.getActors);

router.get("/:id", actorController.getActorById);

router.post("/", actorController.createActor);

router.delete("/:id", actorController.deleteActorById);

router.put("/:id", actorController.updateActorById);

export default router;