import { useState } from "react";
import { ToastContainer } from "react-toastify";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AppRoutes from "../routes/AppRoutes";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--primary)] text-[var(--text-primary)]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex h-screen min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="min-w-0 flex-1 overflow-y-auto">
          <AppRoutes />
        </main>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default AppLayout;
