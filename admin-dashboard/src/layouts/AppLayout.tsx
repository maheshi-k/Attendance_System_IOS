import { ToastContainer } from "react-toastify";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AppRoutes from "../routes/AppRoutes";

function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--primary)] text-[var(--text-primary)]">
      <Sidebar />

      <div className="flex h-screen min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AppRoutes />
        </main>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default AppLayout;
