import { ChevronDown, Download, UserPlus } from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllEmployees,
  getEmployeesByStatus,
} from "../../services/employee.service";
import type { EmployeeRecord, EmployeeStatus } from "../../types/employee";

import EmployeeTable from "./EmployeeTable";
import EmployeePagination from "./EmployeePagination";

function Employee() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //Filter Section
  const [selectedStatus, setSelectedStatus] = useState<
    "All Status" | EmployeeStatus
  >("All Status");

  const totalEmployees = employees.length;

  const totalPages = Math.ceil(totalEmployees / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;

  const endIndex = Math.min(startIndex + rowsPerPage, totalEmployees);

  const currentEmployees = employees.slice(startIndex, endIndex);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        setError("");

        let response;

        if (selectedStatus === "All Status") {
          response = await getAllEmployees();
        } else {
          response = await getEmployeesByStatus(selectedStatus);
        }

        console.log("Employees API response:", response);

        setEmployees(response.data);

        // Go back to first page when filter changes
        setCurrentPage(1);
      } catch (error) {
        console.error("Failed to load employees:", error);

        setError("Failed to load employees");
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, [selectedStatus]);

  return (
    <section className="flex min-h-full flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-end justify-between gap-6 pb-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] font-semibold leading-10 tracking-[-0.32px] text-[var(--text-primary-dark)]">
            Employee Directory
          </h1>

          <p className="text-base leading-6 text-[var(--text-primary-light)]">
            Manage institutional records, access levels, and QR identities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-[rgba(194,201,181,0.3)] bg-[var(--text-primary-opc-10)] px-[21px] py-[11px] text-sm font-semibold text-[#424939] transition hover:bg-[#dcddde]"
          >
            <Download size={15} />
            Export
          </button>

          <button
            type="button"
            onClick={() => navigate("/employees/add")}
            className="flex items-center gap-2 rounded-xl bg-[#7fb249] px-6 py-2.5 text-sm font-bold text-[#234100] shadow-[0_10px_15px_-3px_rgba(127,178,73,0.1)] transition hover:bg-[#72a13f]"
          >
            <UserPlus size={16} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between rounded-2xl border border-[rgba(194,201,181,0.3)] bg-white p-[17px]">
        <div className="relative">
          <select
            aria-label="Filter employees by status"
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(
                event.target.value as "All Status" | EmployeeStatus,
              )
            }
            className="h-9 w-[136px] appearance-none rounded-lg bg-[#f3f4f5] px-4 pr-9 text-sm font-medium text-[#191c1d] outline-none"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>On Leave</option>
            <option>Probation</option>
          </select>

          <ChevronDown
            size={16}
            strokeWidth={2}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#625e58]"
          />
        </div>

        <p className="text-[13px] font-medium tracking-[0.65px] text-[#625e58]">
          {totalEmployees === 0
            ? "Showing 0 employees"
            : `Showing ${startIndex + 1}-${endIndex} of ${totalEmployees} employees`}
        </p>
      </div>

      {/* Employee Table */}
      <EmployeeTable
        employees={currentEmployees}
        loading={loading}
        error={error}
      />

      <EmployeePagination
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        totalEmployees={totalEmployees}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={setRowsPerPage}
      />
    </section>
  );
}

export default Employee;
