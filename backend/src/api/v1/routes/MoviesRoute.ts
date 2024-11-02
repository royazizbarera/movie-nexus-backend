import express from "express";
import movieController from "../controllers/MovieController";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

/**
 * @route GET /movies
 * @description Get a list of all movies
 * @access Public
 */
router.get("/", movieController.getMovies);

/**
 * @route GET /movies/:id
 * @description Get a single movie by ID
 * @access Public
 */
router.get("/:id", movieController.getMovieById);

/**
 * @route POST /movies
 * @description Create a new movie
 * @access Private
 */
router.post("/", verifyToken, movieController.createMovie);

/**
 * @route PUT /movies/:id
 * @description Update a movie by ID
 * @access Private
 */
router.put("/:id", verifyToken, movieController.updateMovieById);

/**
 * @route DELETE /movies/:id
 * @description Delete a movie by ID
 * @access Private
 */
router.delete("/:id", verifyToken, movieController.deleteMovieById);

export default router;
