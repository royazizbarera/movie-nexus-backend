import express from "express";
import genreController from "../controllers/GenreController";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

router.get("/", genreController.getGenres);
router.post("/", genreController.addGenre);
router.delete("/:id", genreController.deleteGenre);
router.put("/:id", genreController.updateGenre);


router.get("/:id", genreController.getGenreById);

router.post("/", verifyToken, genreController.createGenre);

router.put("/:id", verifyToken, genreController.updateGenreById);

router.delete("/:id", verifyToken, genreController.deleteGenreById);

export default router;