import { X } from "lucide-react";
import SuccessIcon from "../../assets/successIcon.svg";

interface AttendanceSuccessPopupProps {
  status: "check-in" | "check-out";
  time: string;
  onDone: () => void;
}

export function AttendanceSuccessPopup({
  status,
  time,
  onDone,
}: AttendanceSuccessPopupProps) {
  const successIcon = SuccessIcon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="relative w-full max-w-[340px] rounded-[12px] border border-[#c2c9b5] bg-white p-[41px] shadow-[0px_8px_16px_rgba(60,106,0,0.12)]">
        {/* Close Button */}
        <button
          onClick={onDone}
          className="absolute right-4 top-4 rounded-full p-1 text-[#625e58] transition-colors hover:bg-[#f3f4f5] hover:text-[#191c1d]"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[rgba(124,179,66,0.2)]">
            <img
              src={successIcon}
              alt="Success"
              className="h-[40px] w-[40px]"
            />
          </div>
        </div>

        {/* Heading */}
        <h2 className="mb-6 text-center font-['Manrope'] text-[24px] font-semibold leading-[32px] text-[#191c1d]">
          Attendance Marked
          <br />
          Successfully
        </h2>

        {/* Status Info */}
        <div className="mb-6 rounded-[8px] bg-[#f3f4f5] px-[24px] py-[16px]">
          <div className="mb-2 text-center font-['Inter'] text-[12px] font-medium uppercase leading-[18px] tracking-[0.6px] text-[#625e58]">
            STATUS
          </div>
          <div className="text-center font-['Manrope'] text-[18px] font-normal leading-[28px] text-[#3c6a00]">
            {status === "check-in" ? "Check-In: " : "Check-Out: "}
            {time}
          </div>
        </div>

        {/* Button */}
        <button
          onClick={onDone}
          className="w-full rounded-[9999px] bg-[#7cb342] py-[16px] font-['Inter'] text-[16px] font-semibold leading-[24px] text-white transition-colors hover:bg-[#6d9d3a]"
        >
          Done
        </button>
      </div>
    </div>
  );
}
