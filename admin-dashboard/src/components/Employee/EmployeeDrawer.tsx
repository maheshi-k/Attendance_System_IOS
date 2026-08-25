import { CalendarDays, Mail, MapPin, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getEmployeeDesignationHistory } from "../../services/employee.service";
import type { DesignationHistory, EmployeeRecord } from "../../types/employee";
import EmployeeStatusBadge from "./EmployeeStatusBadge";

type EmployeeDrawerProps = {
  employee: EmployeeRecord;
  onClose: () => void;
};

type DrawerTab = "overview" | "history";

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString() : "-";

function EmployeeDrawer({ employee, onClose }: EmployeeDrawerProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DrawerTab>("overview");
  const [history, setHistory] = useState<DesignationHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoadingHistory(true);
        const response = await getEmployeeDesignationHistory(employee.emp_id);
        setHistory(response.data);
      } catch (error) {
        console.error("Failed to load designation history:", error);
        toast.error("Failed to load designation history");
      } finally {
        setLoadingHistory(false);
      }
    };

    loadHistory();
  }, [employee.emp_id]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-[2px]">
      <button
        type="button"
        aria-label="Close employee details"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-drawer-title"
        className="relative flex h-full w-full max-w-[360px] flex-col bg-[#fcf9f8] shadow-[-8px_0_24px_rgba(28,27,27,0.12)]"
      >
        <header className="flex items-center justify-between border-b border-[#e3dfde] bg-white px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            {employee.profile_photo ? (
              <img
                src={employee.profile_photo}
                alt=""
                className="h-11 w-11 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e5e2e1] text-sm font-bold uppercase text-[#43493a]">
                {employee.first_name?.charAt(0)}
                {employee.last_name?.charAt(0)}
              </span>
            )}
            <div className="min-w-0">
              <h2
                id="employee-drawer-title"
                className="truncate text-lg font-bold text-[#1c1b1b]"
              >
                {employee.first_name} {employee.last_name}
              </h2>
              <p className="font-mono text-xs text-[#625e58]">
                {employee.emp_code}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close employee details"
            title="Close"
            onClick={onClose}
            className="rounded-lg p-2 text-[#625e58] transition hover:bg-[#f3f4f5]"
          >
            <X size={18} />
          </button>
        </header>

        <nav
          className="flex border-b border-[#e3dfde] bg-white px-5"
          aria-label="Employee details tabs"
        >
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`border-b-2 px-1 py-3 text-xs font-bold ${
              activeTab === "overview"
                ? "border-[#416900] text-[#416900]"
                : "border-transparent text-[#625e58]"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`ml-6 border-b-2 px-1 py-3 text-xs font-bold ${
              activeTab === "history"
                ? "border-[#416900] text-[#416900]"
                : "border-transparent text-[#625e58]"
            }`}
          >
            Designation History
          </button>
        </nav>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {activeTab === "overview" ? (
            <div className="flex flex-col gap-4">
              <section className="rounded-xl border border-[#dedad9] bg-white p-4">
                <h3 className="border-b border-[#e3dfde] pb-3 text-sm font-bold text-[#1c1b1b]">
                  Personal Information
                </h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-4 pt-4 text-xs">
                  <div>
                    <dt className="uppercase text-[#817c78]">Gender</dt>
                    <dd className="mt-1 font-medium text-[#1c1b1b]">
                      {employee.gender}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase text-[#817c78]">NIC</dt>
                    <dd className="mt-1 break-words font-medium text-[#1c1b1b]">
                      {employee.nic}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="flex items-center gap-1 uppercase text-[#817c78]">
                      <MapPin size={13} /> Address
                    </dt>
                    <dd className="mt-1 font-medium text-[#1c1b1b]">
                      {employee.address || "-"}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-xl border border-[#dedad9] bg-white p-4">
                <h3 className="border-b border-[#e3dfde] pb-3 text-sm font-bold text-[#1c1b1b]">
                  Employment Details
                </h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-4 pt-4 text-xs">
                  <div>
                    <dt className="uppercase text-[#817c78]">Current Role</dt>
                    <dd className="mt-1 font-medium text-[#1c1b1b]">
                      {employee.designation || "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="uppercase text-[#817c78]">Joining Date</dt>
                    <dd className="mt-1 font-medium text-[#1c1b1b]">
                      {formatDate(employee.joining_date)}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="mb-2 uppercase text-[#817c78]">
                      Current Status
                    </dt>
                    <EmployeeStatusBadge status={employee.employment_status} />
                  </div>
                </dl>
              </section>

              <section className="rounded-xl border border-[#dedad9] bg-white p-4">
                <h3 className="border-b border-[#e3dfde] pb-3 text-sm font-bold text-[#1c1b1b]">
                  Contact Information
                </h3>
                <div className="space-y-4 pt-4 text-xs text-[#1c1b1b]">
                  <p className="flex gap-3">
                    <Phone size={16} className="shrink-0 text-[#6c7c55]" />
                    <span>
                      {employee.mobile_no_1 || "-"}
                      <br />
                      {employee.mobile_no_2 || ""}
                    </span>
                  </p>
                  <p className="flex gap-3">
                    <Mail size={16} className="shrink-0 text-[#6c7c55]" />
                    <span>
                      {employee.email_1}
                      <br />
                      {employee.email_2 || ""}
                    </span>
                  </p>
                </div>
              </section>
            </div>
          ) : (
            <section className="rounded-xl border border-[#dedad9] bg-white p-4">
              <h3 className="border-b border-[#e3dfde] pb-3 text-sm font-bold text-[#1c1b1b]">
                Designation History
              </h3>
              {loadingHistory ? (
                <p className="py-6 text-center text-xs text-[#625e58]">
                  Loading history...
                </p>
              ) : history.length === 0 ? (
                <p className="py-6 text-center text-xs text-[#625e58]">
                  No designation history
                </p>
              ) : (
                <div className="divide-y divide-[#e3dfde]">
                  {history.map((item) => (
                    <article
                      key={item.designation_history_id}
                      className="py-4 first:pt-4 last:pb-0"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-sm font-bold text-[#1c1b1b]">
                          {item.designation}
                        </h4>
                        {item.effective_to == null && (
                          <span className="rounded-full bg-[#e4f0db] px-2 py-1 text-[10px] font-bold uppercase text-[#416900]">
                            Present
                          </span>
                        )}
                      </div>
                      <p className="mt-2 flex items-center gap-1 text-xs text-[#625e58]">
                        <CalendarDays size={13} />
                        {formatDate(item.effective_from)} -{" "}
                        {item.effective_to
                          ? formatDate(item.effective_to)
                          : "Present"}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-[#e3dfde] bg-white px-5 py-4">
          <button
            type="button"
            onClick={() => navigate(`/employees/${employee.emp_id}/edit`)}
            className="text-sm font-semibold text-[#625e58] transition hover:text-[#1c1b1b]"
          >
            Edit Details
          </button>
          {/* <button
            type="button"
            onClick={() =>
              toast.info("Promotion workflow is not available yet")
            }
            className="rounded-lg bg-[#416900] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#315d08]"
          >
            Promote
          </button> */}
          <button
            type="button"
            onClick={() => navigate("/employees")}
            className="rounded-lg bg-[#416900] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#315d08]"
          >
            Close
          </button>
        </footer>
      </aside>
    </div>
  );
}

export default EmployeeDrawer;
