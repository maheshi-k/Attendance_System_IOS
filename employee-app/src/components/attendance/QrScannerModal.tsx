import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  checkAttendance,
  getSelfAttendance,
} from "../../services/attendance.service";
import { AttendanceSuccessPopup } from "../common/AttendanceSuccessPopup";
import { AttendanceErrorPopup } from "../common/AttendanceErrorPopup";

type QrScannerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAttendanceUpdated: (
    attendance: Awaited<ReturnType<typeof getSelfAttendance>>,
  ) => void;
};

interface SuccessState {
  isSuccess: true;
  status: "check-in" | "check-out";
  time: string;
}

interface ErrorState {
  isSuccess: false;
  errorMessage: string;
  canRetry: boolean;
}

type PopupState = SuccessState | ErrorState | null;

const formatAttendanceTime = (timeValue: string) => {
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

  // Fallback in case API returns a full datetime string.
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

function QrScannerModal({
  isOpen,
  onClose,
  onAttendanceUpdated,
}: QrScannerModalProps) {
  const [popupState, setPopupState] = useState<PopupState>(null);
  const [cameraError, setCameraError] = useState("");
  const [saving, setSaving] = useState(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannedRef = useRef(false);
  const scannerSessionRef = useRef(0);

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;

    if (!scanner) {
      return;
    }

    scannerRef.current = null;

    try {
      await scanner.stop();
    } catch (error) {
      console.log("Scanner stop skipped:", error);
    }

    try {
      scanner.clear();
    } catch {
      // Ignore clear errors.
    }
  }, []);

  const handleScan = useCallback(
    async (qrToken: string) => {
      if (!qrToken.trim() || scannedRef.current) {
        return;
      }

      const currentSession = scannerSessionRef.current;

      try {
        scannedRef.current = true;
        setSaving(true);
        setPopupState(null);

        await stopScanner();

        if (currentSession !== scannerSessionRef.current) {
          return;
        }

        // await checkAttendance(qrToken.trim());
        const attendanceResult = await checkAttendance(qrToken.trim());

        if (currentSession !== scannerSessionRef.current) {
          return;
        }

        const updatedAttendance = await getSelfAttendance();

        if (currentSession !== scannerSessionRef.current) {
          return;
        }

        const todayAttendance = updatedAttendance.today;

        if (!todayAttendance) {
          throw new Error(
            "Attendance was marked, but today's record could not be loaded.",
          );
        }

        const formattedTime = formatAttendanceTime(
          attendanceResult.client_time,
        );

        const status = todayAttendance.check_out ? "check-out" : "check-in";

        onAttendanceUpdated(updatedAttendance);

        setPopupState({
          isSuccess: true,
          status,
          time: formattedTime,
        });
      } catch (error) {
        if (currentSession !== scannerSessionRef.current) {
          return;
        }

        const errorMessage =
          error instanceof Error ? error.message : "Unable to mark attendance";

        const isCheckoutTimeError =
          errorMessage.includes(
            "Minimum 4 hours are required before checkout",
          ) || errorMessage.includes("Attendance already completed for today");

        setPopupState({
          isSuccess: false,
          errorMessage,
          canRetry: !isCheckoutTimeError,
        });
      } finally {
        if (currentSession === scannerSessionRef.current) {
          setSaving(false);
        }
      }
    },
    [onAttendanceUpdated, stopScanner],
  );

  const startScanner = useCallback(async () => {
    const session = ++scannerSessionRef.current;

    try {
      setCameraError("");
      scannedRef.current = false;

      await stopScanner();

      if (session !== scannerSessionRef.current || !isOpen) {
        return;
      }

      const readerElement = document.getElementById("qr-reader");

      if (!readerElement) {
        console.error("qr-reader element not found");
        return;
      }

      const scanner = new Html5Qrcode("qr-reader");

      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        async (decodedText) => {
          if (scannedRef.current || session !== scannerSessionRef.current) {
            return;
          }

          await handleScan(decodedText);
        },
        () => {},
      );
    } catch (error) {
      console.error("Camera error:", error);

      // if (session === scannerSessionRef.current) {
      //   setCameraError(
      //     "Unable to access the camera. Please allow camera permission and try again.",
      //   );
      // }
      if (session === scannerSessionRef.current) {
        const message = error instanceof Error ? error.message : String(error);

        setCameraError(`Camera error: ${message}`);
      }
    }
  }, [handleScan, stopScanner, isOpen]);

  useEffect(() => {
    if (!isOpen || popupState !== null) {
      return;
    }

    let cancelled = false;

    const initializeScanner = async () => {
      // Give React time to render #qr-reader.
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (cancelled) {
        return;
      }

      await startScanner();
    };

    initializeScanner();

    return () => {
      cancelled = true;
      stopScanner();
    };
  }, [isOpen, popupState, startScanner, stopScanner]);

  const handleTryAgain = () => {
    setCameraError("");
    scannedRef.current = false;
    setPopupState(null);
  };

  const handleDone = () => {
    setPopupState(null);
    setSaving(false);
    scannedRef.current = false;
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  if (popupState?.isSuccess) {
    return (
      <AttendanceSuccessPopup
        status={popupState.status}
        time={popupState.time}
        onDone={handleDone}
      />
    );
  }

  if (popupState && !popupState.isSuccess) {
    return (
      <AttendanceErrorPopup
        errorMessage={popupState.errorMessage}
        buttonText={popupState.canRetry ? "Try Again" : "Done"}
        onAction={popupState.canRetry ? handleTryAgain : handleDone}
        onClose={handleDone}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-left shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#191c1d]">Scan QR Code</h3>

          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-[#625e58]"
          >
            Close
          </button>
        </div>

        <div id="qr-reader" className="mb-4 overflow-hidden rounded-lg" />

        {cameraError && (
          <p className="mb-3 text-sm text-[#ba1a1a]">{cameraError}</p>
        )}

        {saving && (
          <p className="mb-3 text-sm text-[#625e58]">Checking attendance...</p>
        )}

        {!cameraError && !saving && (
          <p className="text-center text-sm text-[#625e58]">
            Point your camera at the office QR code
          </p>
        )}
      </div>
    </div>
  );
}

export default QrScannerModal;
