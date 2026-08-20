import express from 'express';
import { getEmployee,addEmployee,getEmployeeById, updateEmployee , updateEmployeeStatusByID , getEmployeeByStatusController } from '../controllers/employee.controller.js';
import { createEmployeeSchema, updateEmployeeSchema } from '../validators/employee.validator.js';
import { validate } from '../middlewares/error.middleware.js';

const router = express.Router();

router.get("/", getEmployee);
router.post("/create", validate(createEmployeeSchema) , addEmployee);
router.get("/:id", getEmployeeById);
router.get("/status/:status", getEmployeeByStatusController);
router.put("/:id",validate(updateEmployeeSchema) , updateEmployee);
router.patch("/:id/status", updateEmployeeStatusByID);

export default router;