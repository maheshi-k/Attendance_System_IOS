import CurrentStatusCard from "./CurrentStatusCard";
import AttendanceStats from "./AttendanceStats";
import QrScanAction from "./QrScanAction";
import RecentRecords from "./RecentRecords";
import type { EmployeeLayoutContext } from "../../layouts/EmployeeLayout";
import { useOutletContext } from "react-router-dom";

function HomePage() {
  const { openScanner, attendance } = useOutletContext<EmployeeLayoutContext>();

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-28 m-2 text-[#191c1d]">
      <main className="mx-auto flex w-full max-w-[672px] flex-col gap-6 px-4 pb-8 pt-5">
        <CurrentStatusCard attendance={attendance.today} />

        <AttendanceStats stats={attendance.stats} />

        <QrScanAction onScan={openScanner} />

        <RecentRecords records={attendance.records} />
      </main>
    </div>
  );
}

export default HomePage;
