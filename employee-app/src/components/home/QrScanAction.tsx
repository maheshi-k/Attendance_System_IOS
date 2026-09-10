import { Maximize } from "lucide-react";
import scanQR from "../../assets/scanQR.svg";
// import { useState } from "react";
// import { getManualAttendanceTime } from "../../services/attendance.service";
// import ManualAttendanceModal from "../attendance/ManualAttendanceModal";

type QrScanActionProps = {
  onScan: () => void;
  // todayAttendance: {
  //   check_in: string | null;
  //   check_out: string | null;
  // } | null;
  onAttendanceSubmitted: () => Promise<void>;
};

function QrScanAction({
  onScan,
  // todayAttendance,
  // onAttendanceSubmitted,
}: QrScanActionProps) {
  // const [isAttendanceFormOpen, setIsAttendanceFormOpen] = useState(false);
  // const [manualAttendanceTime, setManualAttendanceTime] = useState<{
  //   client_date: string;
  //   client_time: string;
  //   client_datetime: string;
  // } | null>(null);
  // const [attendanceType, setAttendanceType] = useState<
  //   "check-in" | "check-out" | null
  // >(null);

  // const handleOpenAttendanceForm = () => {
  //   if (todayAttendance?.check_in && todayAttendance?.check_out) {
  //     return;
  //   }

  //   const attendanceType = !todayAttendance?.check_in
  //     ? "check-in"
  //     : "check-out";

  //   const attendanceTime = getManualAttendanceTime();

  //   setAttendanceType(attendanceType);
  //   setManualAttendanceTime(attendanceTime);
  //   setIsAttendanceFormOpen(true);
  // };

  return (
    <section className="flex flex-col items-center py-2 text-center">
      {/* QR Icon */}
      <button
        type="button"
        aria-label="Scan QR Code"
        onClick={onScan}
        className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-[var(--button-muted)] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
      >
        <span className="absolute inset-0 rounded-full border-2 border-[var(--border-soft)]" />

        <img src={scanQR} alt="" className="h-[34px] w-[34px] object-contain" />
      </button>

      <h2 className="mt-4 text-2xl font-semibold leading-8 text-[#3c6a00]">
        Scan QR Code
      </h2>

      <p className="mt-1 text-sm leading-5 text-[#625e58]">
        Scan the office entry point to check-in
      </p>

      <button
        type="button"
        onClick={onScan}
        className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--button-muted)] text-sm font-semibold text-white transition-colors hover:bg-[#4d8800]"
      >
        <Maximize className="h-4 w-4" />
        <span>Scan QR Code</span>
      </button>

      {/* OR divider */}
      {/* <div className="my-2 flex w-full items-center gap-3">
        <div className="h-px flex-1 bg-[#e4e7df]" />

        <span className="text-xs font-semibold text-[#9a978f]">OR</span>

        <div className="h-px flex-1 bg-[#e4e7df]" />
      </div>

      <button
        type="button"
        onClick={handleOpenAttendanceForm}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#dfe4d7] bg-[#f8f9f7] text-sm font-semibold text-[#344054] transition-colors hover:bg-[#f1f4eb]"
      >
        <FilePenLine className="h-4 w-4 text-[#667085]" />
        <span>Mark Attendance</span>
      </button>

      {isAttendanceFormOpen && manualAttendanceTime && attendanceType && (
        <ManualAttendanceModal
          attendanceTime={manualAttendanceTime}
          attendanceType={attendanceType}
          onClose={() => {
            setIsAttendanceFormOpen(false);
            setManualAttendanceTime(null);
            setAttendanceType(null);
          }}
          onSuccess={() => {
            void onAttendanceSubmitted();
          }}
        />
      )} */}
    </section>
  );
}

export default QrScanAction;
