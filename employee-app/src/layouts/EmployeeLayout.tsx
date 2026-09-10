import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import HomeHeader from "../components/home/HomeHeader";
import BottomNavigation from "../components/navigation/BottomNavigation";
import QrScannerModal from "../components/attendance/QrScannerModal";

import { useEmployee } from "../context/EmployeeContext";
import { getSelfAttendance } from "../services/attendance.service";

import type { SelfAttendance } from "../types/attendance.types";

type EmployeeLayoutProps = {
  onLogout: () => void;
};

export type EmployeeLayoutContext = {
  openScanner: () => void;
  attendance: SelfAttendance;
  setAttendance: React.Dispatch<React.SetStateAction<SelfAttendance>>;
};

function EmployeeLayout({ onLogout }: EmployeeLayoutProps) {
  const { employee, loading } = useEmployee();

  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const [attendance, setAttendance] = useState<SelfAttendance>({
    today: null,
    records: [],
    stats: {
      present_days: 0,
      late_days: 0,
      absent_days: 0,
    },
  });

  const employeeName = [employee?.first_name, employee?.last_name]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    getSelfAttendance()
      .then(setAttendance)
      .catch((error) => {
        console.error("Failed to load attendance:", error);
      });
  }, []);

  const openScanner = () => {
    setIsScannerOpen(true);
  };

  const closeScanner = () => {
    setIsScannerOpen(false);
  };

  return (
    <div className="relative m-2 min-h-screen bg-[#f8f9fa] text-[#191c1d]">
      <HomeHeader
        employeeName={employeeName}
        profilePhoto={loading ? null : employee?.profile_photo}
        employeeRole={employee?.role_name}
        onLogout={onLogout}
      />

      <Outlet
        context={{
          openScanner,
          attendance,
          setAttendance,
        }}
      />

      <BottomNavigation onScanQR={openScanner} />

      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={closeScanner}
        onAttendanceUpdated={setAttendance}
      />
    </div>
  );
}

export default EmployeeLayout;
