import express from "express";
import countryController from "../controllers/CountryController";
import {verifyToken} from "../middlewares/verifyToken";

const router = express.Router();

router.get("/", countryController.getCountries);

router.get("/:code", countryController.getCountryByCode);

router.post("/", verifyToken, countryController.createCountry);

router.put("/:code", verifyToken, countryController.updateCountryByCode);

router.delete("/:code", verifyToken, countryController.deleteCountryByCode);

export default router;