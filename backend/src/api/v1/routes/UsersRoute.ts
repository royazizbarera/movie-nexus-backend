import express from "express";
import UserController from "../controllers/UserController";
import {verifyToken} from "../middlewares/verifyToken";

const router = express.Router();

/**
 * @route GET /users
 * @description Get a list of all users
 * @access Private
 */
router.get("/", verifyToken, UserController.getUsers);

export default router;
