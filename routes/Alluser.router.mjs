
import express from "express";
import { AllUserController } from "../controllers/Alluser.controller.mjs";


/* import {
  idParamRules,
  listContestRules
} from "../validationRules/Alluser.rules.validation.mjs"; */

const router = express.Router();

// LIST + PAGINATION
router.get(
  "/news",
  /* validateRequest(listContestRules), */
  AllUserController.list
);
/* router.get(
  "/get/single/:id",
  validateRequest(idParamRules),
  AllUserController.getSigle
); */


export default router;
