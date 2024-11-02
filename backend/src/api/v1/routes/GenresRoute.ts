import express from "express";
import genreController from "../controllers/GenreController";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

/**
 * @route GET /genres
 * @description Get a list of all genres
 * @access Public
 */
router.get("/", genreController.getGenres);

/**
 * @route GET /genres/:id
 * @description Get a single genre by ID
 * @access Public
 */
router.get("/:id", genreController.getGenreById);

/**
 * @route POST /genres
 * @description Create a new genre
 * @access Private
 */
router.post("/", verifyToken, genreController.createGenre);

/**
 * @route PUT /genres/:id
 * @description Update a genre by ID
 * @access Private
 */
router.put("/:id", verifyToken, genreController.updateGenreById);

/**
 * @route DELETE /genres/:id
 * @description Delete a genre by ID
 * @access Private
 */
router.delete("/:id", verifyToken, genreController.deleteGenreById);

export default router;