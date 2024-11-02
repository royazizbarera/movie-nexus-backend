import express from "express";
import movieController from "../controllers/MovieController";
import {verifyToken} from "../middlewares/verifyToken";

const router = express.Router();

router.get("/", verifyToken, movieController.getMovies);

router.get("/:id", verifyToken, movieController.getMovieById);

router.post("/", verifyToken, movieController.createMovie);

router.put("/:id", verifyToken, movieController.updateMovieById);

router.delete("/:id", verifyToken, movieController.deleteMovieById);

export default router;
