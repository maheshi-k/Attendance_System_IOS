import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import RecentAttendance from "./RecentAttendance";
import StatCards from "./StatCards";
import { getAttendance } from "../services/attendance.service";
import { getAllEmployees } from "../services/employee.service";
import type { AttendanceRecord } from "../types/attendance";

function Dashboard() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAttendance(), getAllEmployees()])
      .then(([attendanceResponse, employeeResponse]) => {
        setRecords(attendanceResponse.data);
        setTotalEmployees(employeeResponse.data.length);
      })
      .catch((error) => {
        console.error("Failed to load dashboard data:", error);
        toast.error("Failed to load dashboard data");
      })
      .finally(() => setLoading(false));
  }, []);

  const todayRecords = useMemo(() => {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    return records.filter(
      (record) => record.att_date.slice(0, 10) === todayKey,
    );
  }, [records]);

  const presentCount = todayRecords.filter(
    (record) => record.status === "Present",
  ).length;
  const lateCount = todayRecords.filter(
    (record) => record.status === "Late",
  ).length;
  const absentCount = todayRecords.filter(
    (record) => record.status === "Absent",
  ).length;
  const attendanceRate = totalEmployees
    ? ((presentCount + lateCount) / totalEmployees) * 100
    : 0;

  return (
    <section className="flex min-h-full flex-col gap-6 overflow-y-auto p-8">
      <StatCards
        presentCount={presentCount}
        lateCount={lateCount}
        absentCount={absentCount}
        attendanceRate={attendanceRate}
        loading={loading}
      />
      <RecentAttendance records={records} loading={loading} />
    </section>
  );
}

export default Dashboard;
