import express from "express";
import cors from "cors";

import employeesRoutes from "./routes/employee.routes.js";
import authRoutes from "./routes/auth.routes.js";
import roleRoutes from "./routes/role.routes.js";
import qrRoutes from "./routes/qr.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import designationRoutes from "./routes/designation.routes.js";
import leaveRoutes from "./routes/leave.routes.js";

const app = express();

app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use(express.json());

app.get("/", (req,res) => {
    res.json({
        message: "API is running",
    });
});

app.use("/api/employees", employeesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/designations", designationRoutes);
app.use("/api/leaves", leaveRoutes);


export default app;