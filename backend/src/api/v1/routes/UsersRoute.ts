import express from "express";
import UserController from "../controllers/UserController";
import {verifyAdmin} from "../middlewares/verifyAdmin";

const router = express.Router();

/**
 * @route GET /users
 * @description Get a list of all users
 * @access Private
 */
router.get("/", verifyAdmin, UserController.getUsers);

export default router;
