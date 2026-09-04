import type { EmployeeAttendanceRecord } from "../../types/attendance.types";
import { useEffect, useState } from "react";
// import locationAsset from "../../assets/locationAsset.svg";

type CurrentStatusCardProps = {
  attendance: EmployeeAttendanceRecord | null;
};

function CurrentStatusCard({ attendance }: CurrentStatusCardProps) {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  // const [location, setLocation] = useState(() =>
  //   navigator.geolocation ? "Getting location..." : "Location not supported",
  // );

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      setCurrentDate(
        now.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      );

      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      );
    };

    updateDateTime();

    // Update time every second
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   if (!navigator.geolocation) return;

  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const { latitude, longitude } = position.coords;

  //       setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
  //     },
  //     () => {
  //       setLocation("Location unavailable");
  //     },
  //   );
  // }, []);

  return (
    <section className="rounded-lg border border-[#c2c9b5] bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[13px] font-medium tracking-[0.05em] text-[#625e58]">
            {currentDate}
          </p>

          <p className="mt-1 text-[32px] font-semibold leading-10 tracking-[-0.01em] text-[#191c1d]">
            {currentTime}
          </p>
        </div>

        <span
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${attendance ? "bg-[#d8f4d8] text-[#398243]" : "bg-[#ffdad6] text-[#93000a]"}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${attendance ? "bg-[var(--text-secondary)]" : "bg-[#ba1a1a]"}`}
          />
          {attendance?.check_out
            ? "Checked Out"
            : attendance
              ? "Checked In"
              : "Not Checked In"}
        </span>
      </div>

      {/* <div className="mt-4 flex items-center gap-2 text-sm text-[#625e58]">
        <img
          src={locationAsset}
          alt=""
          className="h-[15px] w-3 object-contain"
        />

        {location}
      </div> */}
    </section>
  );
}

export default CurrentStatusCard;
