import { X } from "lucide-react";
import ErrorIcon from "../../assets/errorIcon.svg";

interface AttendanceErrorPopupProps {
  errorMessage: string;
  buttonText?: string;
  onAction: () => void;
  onClose?: () => void;
}

export function AttendanceErrorPopup({
  errorMessage,
  buttonText = "Try Again",
  onAction,
  onClose,
}: AttendanceErrorPopupProps) {
  const errorIcon = ErrorIcon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="relative w-full max-w-[340px] rounded-[12px] border border-[#c2c9b5] bg-white p-[41px] shadow-[0px_8px_16px_rgba(60,106,0,0.12)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-[#625e58] transition-colors hover:bg-[#f3f4f5] hover:text-[#191c1d]"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[rgba(179,66,66,0.2)]">
            <img src={errorIcon} alt="Error" className="h-[38px] w-[38px]" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="mb-6 text-center font-['Manrope'] text-[24px] font-semibold leading-[32px] text-[#191c1d]">
          {errorMessage}
        </h2>

        <div className="mb-6 h-[40px]" />

        {/* Button */}
        <button
          type="button"
          onClick={onAction}
          className="w-full rounded-[9999px] bg-[#b71a1a] py-[16px] font-['Inter'] text-[16px] font-semibold leading-[24px] text-white transition-colors hover:bg-[#9a1515]"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
