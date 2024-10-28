import express from "express";
import movieController from "../controllers/MovieController";

const router = express.Router();

// router.get("/search", movieController.searchMovies)

router.get("/", movieController.getMovies);

router.get("/:id", movieController.getMovieById);

router.put("/:id", movieController.updateMovieById);

router.delete("/:id", movieController.deleteMovieById);

// add a new route to create a movie
router.post("/", movieController.createMovie);

// add a new route to delete a movie by its ID
router.delete("/:id", movieController.deleteMovieById);

// add a new route to update a movie by its ID
router.put("/:id", movieController.updateMovieById);

export default router;
