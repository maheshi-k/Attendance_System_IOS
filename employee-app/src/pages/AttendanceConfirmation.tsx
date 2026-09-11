import {
  CheckCircle2,
  Clock3,
  Home,
  LogIn,
  LogOut,
  QrCode,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  checkAttendance,
  getSelfAttendance,
} from "../services/attendance.service";
import { AttendanceSuccessPopup } from "../components/common/AttendanceSuccessPopup";
import { AttendanceErrorPopup } from "../components/common/AttendanceErrorPopup";

type AttendanceConfirmationProps = {
  token: string;
};

type AttendanceAction = "check-in" | "check-out" | "completed";

type PopupState =
  | {
      type: "success";
      status: "check-in" | "check-out";
      time: string;
    }
  | {
      type: "error";
      message: string;
      canRetry: boolean;
    }
  | null;

const formatAttendanceTime = (timeValue: string | null | undefined) => {
  if (!timeValue) {
    return "";
  }

  const trimmedValue = timeValue.trim();

  const timeMatch = /^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?$/.exec(
    trimmedValue,
  );

  if (timeMatch) {
    const hours = Number(timeMatch[1]);
    const minutes = Number(timeMatch[2]);

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return trimmedValue;
    }

    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;

    return `${String(displayHours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )} ${period}`;
  }

  const parsedTime = new Date(trimmedValue);

  if (Number.isNaN(parsedTime.getTime())) {
    return trimmedValue;
  }

  return parsedTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

function AttendanceConfirmation({ token }: AttendanceConfirmationProps) {
  const navigate = useNavigate();

  const [attendanceAction, setAttendanceAction] =
    useState<AttendanceAction | null>(null);

  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isMarking, setIsMarking] = useState(false);

  const [popupState, setPopupState] = useState<PopupState>(null);

  const loadTodayAttendance = async () => {
    const attendance = await getSelfAttendance();
    const todayAttendance = attendance.today;

    if (!todayAttendance) {
      setAttendanceAction("check-in");
      setCheckInTime("");
      setCheckOutTime("");
      return;
    }

    setCheckInTime(formatAttendanceTime(todayAttendance.check_in));

    setCheckOutTime(formatAttendanceTime(todayAttendance.check_out));

    if (todayAttendance.check_out) {
      setAttendanceAction("completed");
    } else {
      setAttendanceAction("check-out");
    }
  };

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      try {
        setIsLoading(true);

        const attendance = await getSelfAttendance();

        if (cancelled) {
          return;
        }

        const todayAttendance = attendance.today;

        if (!todayAttendance) {
          setAttendanceAction("check-in");
          setCheckInTime("");
          setCheckOutTime("");
          return;
        }

        setCheckInTime(formatAttendanceTime(todayAttendance.check_in));

        setCheckOutTime(formatAttendanceTime(todayAttendance.check_out));

        if (todayAttendance.check_out) {
          setAttendanceAction("completed");
        } else {
          setAttendanceAction("check-out");
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Unable to load today's attendance.";

        setPopupState({
          type: "error",
          message: errorMessage,
          canRetry: true,
        });
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleMarkAttendance = async () => {
    if (!token || isMarking || attendanceAction === "completed") {
      return;
    }

    const action = attendanceAction === "check-out" ? "check-out" : "check-in";

    setPopupState(null);
    setIsMarking(true);

    try {
      const attendanceResult = await checkAttendance(token);

      const updatedAttendance = await getSelfAttendance();
      const todayAttendance = updatedAttendance.today;

      if (!todayAttendance) {
        throw new Error(
          "Attendance was marked, but today's record could not be loaded.",
        );
      }

      const formattedTime = formatAttendanceTime(attendanceResult.client_time);

      setCheckInTime(formatAttendanceTime(todayAttendance.check_in));

      setCheckOutTime(formatAttendanceTime(todayAttendance.check_out));

      if (todayAttendance.check_out) {
        setAttendanceAction("completed");
      } else {
        setAttendanceAction("check-out");
      }

      setPopupState({
        type: "success",
        status: action,
        time: formattedTime,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to mark attendance.";

      const isCheckoutTimeError =
        errorMessage.includes("Minimum 4 hours are required before checkout") ||
        errorMessage.includes("Attendance already completed for today") ||
        errorMessage === "MIN_CHECKOUT_TIME" ||
        errorMessage === "ATTENDANCE_COMPLETED";

      setPopupState({
        type: "error",
        message: errorMessage,
        canRetry: !isCheckoutTimeError,
      });
    } finally {
      setIsMarking(false);
    }
  };

  const handleSuccessDone = () => {
    setPopupState(null);
    navigate("/", { replace: true });
  };

  const handleErrorClose = () => {
    setPopupState(null);
    navigate("/", { replace: true });
  };

  const handleRetry = async () => {
    setPopupState(null);

    try {
      setIsLoading(true);
      await loadTodayAttendance();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to load today's attendance.";

      setPopupState({
        type: "error",
        message: errorMessage,
        canRetry: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (popupState?.type === "success") {
    return (
      <AttendanceSuccessPopup
        status={popupState.status}
        time={popupState.time}
        onDone={handleSuccessDone}
      />
    );
  }

  if (popupState?.type === "error") {
    return (
      <AttendanceErrorPopup
        errorMessage={popupState.message}
        buttonText={popupState.canRetry ? "Try Again" : "Done"}
        onAction={popupState.canRetry ? handleRetry : handleErrorClose}
        onClose={handleErrorClose}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--primary)] px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#83bb49]" />

          <p className="text-sm text-[var(--text-secondary)]">
            Checking today's attendance...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--primary)] px-6 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 rounded-full bg-green-100 p-4">
            <QrCode size={40} className="text-green-600" strokeWidth={1.8} />
          </div>

          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Mark Attendance
          </h1>

          <div className="mt-3 w-full rounded-xl bg-green-50 p-3">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 size={20} className="text-green-600" />

              <span className="text-sm font-medium text-green-700">
                QR code verified
              </span>
            </div>
          </div>

          {(checkInTime || checkOutTime) && (
            <div className="mt-5 w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-left">
              <p className="mb-3 text-sm font-semibold text-gray-700">
                Today's Attendance
              </p>

              {checkInTime && (
                <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                  <div className="flex items-center gap-2">
                    <LogIn size={18} className="text-green-600" />

                    <span className="text-sm text-gray-600">Check-in</span>
                  </div>

                  <span className="text-sm font-semibold text-gray-800">
                    {checkInTime}
                  </span>
                </div>
              )}

              {checkOutTime && (
                <div className="flex items-center justify-between pt-3">
                  <div className="flex items-center gap-2">
                    <LogOut size={18} className="text-blue-600" />

                    <span className="text-sm text-gray-600">Check-out</span>
                  </div>

                  <span className="text-sm font-semibold text-gray-800">
                    {checkOutTime}
                  </span>
                </div>
              )}
            </div>
          )}

          {attendanceAction === "check-in" && (
            <>
              <div className="mt-5 flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-3">
                <LogIn size={19} className="text-blue-600" />

                <span className="text-sm font-medium text-blue-700">
                  Ready to Check In
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                No attendance has been marked for today. Would you like to check
                in now?
              </p>
            </>
          )}

          {attendanceAction === "check-out" && (
            <>
              <div className="mt-5 flex items-center gap-2 rounded-xl bg-orange-50 px-4 py-3">
                <Clock3 size={19} className="text-orange-600" />

                <span className="text-sm font-medium text-orange-700">
                  Ready to Check Out
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                You checked in at{" "}
                <span className="font-semibold text-gray-700">
                  {checkInTime}
                </span>
                . Would you like to check out now?
              </p>
            </>
          )}

          {attendanceAction === "completed" && (
            <>
              <div className="mt-5 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3">
                <CheckCircle2 size={19} className="text-green-600" />

                <span className="text-sm font-semibold text-green-700">
                  Attendance Completed
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                You have already completed your attendance for today.
              </p>
            </>
          )}

          <div className="mt-6 flex w-full flex-col gap-3">
            {attendanceAction !== "completed" && (
              <button
                type="button"
                onClick={handleMarkAttendance}
                disabled={isMarking}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#83bb49] px-5 py-3.5 font-semibold text-white transition hover:bg-[#75ad3d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {attendanceAction === "check-in" ? (
                  <LogIn size={19} />
                ) : (
                  <LogOut size={19} />
                )}

                {isMarking
                  ? "Marking Attendance..."
                  : attendanceAction === "check-in"
                    ? "Check In"
                    : "Check Out"}
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate("/", { replace: true })}
              disabled={isMarking}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-3.5 font-semibold text-[var(--text-primary)] transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Home size={19} />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceConfirmation;
