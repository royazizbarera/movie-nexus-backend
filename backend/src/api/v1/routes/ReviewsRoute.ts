import express from "express";
import ReviewController from "../controllers/ReviewController";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

/**
 * @route GET /reviews
 * @description Get a list of all reviews
 * @access Public
 */
router.get("/", ReviewController.getReviews);

/**
 * @route GET /reviews/:id
 * @description Get a single review by ID
 * @access Public
 */
router.get("/:id", ReviewController.getReviewById);

export default router;
