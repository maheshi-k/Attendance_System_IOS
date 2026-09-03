import lateAsset from "../../assets/lateAsset.svg";
import presentAsset from "../../assets/presentAsset.svg";

import { useNavigate } from "react-router-dom";

type RecentRecordsProps = {
  records: Array<{
    att_id: number;
    att_date: string;
    check_in: string | null;
    check_out: string | null;
    status: string;
  }>;
};

function RecentRecords({ records }: RecentRecordsProps) {
  const navigate = useNavigate();

  const displayRecords = records.map((record) => ({
    date: new Date(record.att_date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    time: `In: ${record.check_in ?? "--:--"} • Out: ${record.check_out ?? "--:--"}`,
    hours: record.check_in && record.check_out ? "Recorded" : "In progress",
    status: record.status,
    icon: record.status === "Late" ? lateAsset : presentAsset,
    active: record.status === "Present",
  }));

  return (
    <section>
      <div className="mb-4 flex items-center justify-between px-1">
        <h2 className="font-mono text-[13px] font-medium tracking-[0.05em] text-[#191c1d]">
          RECENT RECORDS
        </h2>
        <button
          type="button"
          onClick={() => navigate("/attendance-history")}
          className="text-[13px] font-bold text-[#3c6a00]"
        >
          View All
        </button>
      </div>
      <div className="overflow-hidden rounded-lg border border-[#c2c9b5] bg-white">
        {displayRecords.length === 0 ? (
          <p className="p-6 text-center text-sm text-[var(--text-secondary)]">
            No attendance records found
          </p>
        ) : (
          displayRecords.slice(0, 5).map((record, index) => (
            <div
              key={record.date}
              className={`flex items-center justify-between gap-3 p-4 ${index ? "border-t border-[#edeeef]" : ""}`}
            >
              <div className="flex min-w-0 items-center gap-4">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${record.active ? "bg-[rgba(124,179,66,0.1)]" : "bg-[#edeeef]"}`}
                >
                  <img
                    src={record.icon}
                    alt=""
                    className="h-5 w-[18px] object-contain"
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-base font-semibold leading-6 text-[#191c1d]">
                    {record.date}
                  </p>
                  <p className="truncate text-xs leading-[18px] text-[#625e58]">
                    {record.time}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p
                  className={`text-base font-bold leading-6 ${record.active ? "text-[#3c6a00]" : "text-[#191c1d]"}`}
                >
                  {record.hours}
                </p>
                <p
                  className={`text-xs font-bold leading-[18px] ${record.active ? "text-[#7cb342]" : "text-[#625e58]"}`}
                >
                  {record.status}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default RecentRecords;
