import express from 'express';
import { getRoles, addRole , getRoleById , updateRole , updateRoleStatusByID } from '../controllers/role.controller.js';

const router = express.Router();

router.get("/all", getRoles);
router.post("/create", addRole);
router.get("/:id", getRoleById);
router.put("/:id", updateRole);
router.patch("/:id/status", updateRoleStatusByID);

export default router;