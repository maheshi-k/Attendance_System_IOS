import { Routes, Route, Navigate } from "react-router-dom";
import Employee from "./components/Employee/Employee";
import AddEmployee from "./components/Employee/AddEmployee";
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

            <Route path="/dashboard" />

            <Route path="/attendance" />

            <Route path="/employees" element={<Employee />} />

            <Route path="/employees/add" element={<AddEmployee />} />

            <Route path="/reports" />

            <Route path="/settings" />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
