import express from "express";

import {
  getEmployeeDesignationHistory,
  updateEmployeeDesignation,
} from "../controllers/designation.controller.js";

const router = express.Router();

router.get("/:id/history", getEmployeeDesignationHistory);

router.post("/:id/update", updateEmployeeDesignation);

export default router;