import express from 'express';
import { getEmployee,addEmployee,getEmployeeById, updateEmployee , updateEmployeeStatusByID , getEmployeeByStatusController, deleteEmployeeByID, getActiveEmployeeCountController } from '../controllers/employee.controller.js';
import { createEmployeeSchema, updateEmployeeSchema } from '../validators/employee.validator.js';
import { validate } from '../middlewares/error.middleware.js';
import { uploadProfilePhoto } from "../middlewares/upload.js";

const router = express.Router();

router.get("/", getEmployee);
router.post("/create", uploadProfilePhoto.single("profile_photo"), validate(createEmployeeSchema) , addEmployee);
router.get("/:id", getEmployeeById);
router.get("/status/:status", getEmployeeByStatusController);
router.put(
	"/:id",
	uploadProfilePhoto.single("profile_photo"),
	validate(updateEmployeeSchema),
	updateEmployee,
);
router.delete("/:id", deleteEmployeeByID);
router.patch("/:id/status", updateEmployeeStatusByID);
router.get("/active/count", getActiveEmployeeCountController);

export default router;