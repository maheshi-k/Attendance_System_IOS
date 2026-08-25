import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Employee from "./components/Employee/Employee";
import AddEmployee from "./components/Employee/EmployeeForm";
import Attendance from "./components/Attendance/Attendance";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--primary)] text-[var(--text-primary)]">
      <Sidebar />
      <div className="flex h-screen min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/attendance" element={<Attendance />} />

            <Route
              path="/attendance/add"
              element={<Navigate to="/attendance" replace />}
            />

            <Route
              path="/attendance/:id/edit"
              element={<Navigate to="/attendance" replace />}
            />

            <Route path="/employees" element={<Employee />} />

            <Route path="/employees/add" element={<AddEmployee />} />

            <Route path="/employees/:id/edit" element={<AddEmployee />} />

            <Route path="/reports" />

            <Route path="/settings" />
          </Routes>
        </main>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default App;
