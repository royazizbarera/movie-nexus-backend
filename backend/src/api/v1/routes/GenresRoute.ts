import express from "express";
import genreController from "../controllers/GenreController";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

router.get("/:id", genreController.getGenreById);

router.post("/", verifyToken, genreController.createGenre);

router.put("/:id", verifyToken, genreController.updateGenreById);

router.delete("/:id", verifyToken, genreController.deleteGenreById);

export default router;