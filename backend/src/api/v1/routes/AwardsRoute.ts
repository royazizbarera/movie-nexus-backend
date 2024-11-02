import express from "express";
import awardController from "../controllers/AwardController";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

/**
 * @route GET /awards
 * @description Get a list of all awards
 * @access Public
 */
router.get("/", awardController.getAwards);

/**
 * @route GET /awards/:id
 * @description Get a single award by ID
 * @access Public
 */
router.get("/:id", awardController.getAwardById);

/**
 * @route POST /awards
 * @description Create a new award
 * @access Private
 */
router.post("/", verifyToken, awardController.createAward);

/**
 * @route PUT /awards/:id
 * @description Update an award by ID
 * @access Private
 */
router.put("/:id", verifyToken, awardController.updateAwardById);

/**
 * @route DELETE /awards/:id
 * @description Delete an award by ID
 * @access Private
 */
router.delete("/:id", verifyToken, awardController.deleteAwardById);

export default router;
