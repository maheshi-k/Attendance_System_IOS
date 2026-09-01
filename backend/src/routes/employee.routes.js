import express from 'express';
import { getEmployee,addEmployee,getEmployeeById, updateEmployee , updateEmployeeStatusByID , getEmployeeByStatusController, deleteEmployeeByID, getActiveEmployeeCountController } from '../controllers/employee.controller.js';
import { createEmployeeSchema, updateEmployeeSchema } from '../validators/employee.validator.js';
import { validate } from '../middlewares/error.middleware.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { uploadProfilePhoto } from "../middlewares/upload.js";
import { requirePermission } from '../middlewares/permission.middleware.js';

const router = express.Router();

router.get("/",authenticateToken, requirePermission("EMPLOYEE_VIEW"), getEmployee);
router.post("/create",authenticateToken, requirePermission("EMPLOYEE_CREATE"), uploadProfilePhoto.single("profile_photo"), 
	validate(createEmployeeSchema) , addEmployee);
router.get("/:id",authenticateToken, requirePermission("EMPLOYEE_VIEW"), getEmployeeById);
router.get("/status/:status",authenticateToken, requirePermission("EMPLOYEE_VIEW"), getEmployeeByStatusController);
router.put(
	"/:id",authenticateToken, requirePermission("EMPLOYEE_UPDATE"),
	uploadProfilePhoto.single("profile_photo"),
	validate(updateEmployeeSchema),
	updateEmployee,
);
router.delete("/:id",authenticateToken,
  requirePermission("EMPLOYEE_DELETE"), deleteEmployeeByID);
router.patch("/:id/status", authenticateToken,
  requirePermission("EMPLOYEE_UPDATE"), updateEmployeeStatusByID);
router.get("/active/count", authenticateToken, requirePermission("EMPLOYEE_VIEW"), getActiveEmployeeCountController);

export default router;