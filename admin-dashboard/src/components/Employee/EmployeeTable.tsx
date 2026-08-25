import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { EmployeeRecord } from "../../types/employee";
import EmployeeStatusBadge from "./EmployeeStatusBadge";

type EmployeeTableProps = {
  employees: EmployeeRecord[];
  loading: boolean;
  error: string;
  onDelete: (employee: EmployeeRecord) => void;
  onView: (employee: EmployeeRecord) => void;
};

function EmployeeTable({
  employees,
  loading,
  error,
  onDelete,
  onView,
}: EmployeeTableProps) {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-2xl border border-[rgba(194,201,181,0.3)] bg-white">
      <div className="max-h-[500px] overflow-x-auto">
        <table className="min-w-[1000px] w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-[192px]" />
            <col className="w-[116px]" />
            <col className="w-[141px]" />
            <col className="w-[200px]" />
            <col className="w-[162px]" />
            <col className="w-[164px]" />
          </colgroup>

          <thead className="bg-[#f3f4f5] text-left text-[13px] font-medium uppercase tracking-[0.65px] text-[#625e58]">
            <tr>
              <th className="px-6 py-6">Employee</th>
              <th className="px-6 py-4">Employee ID</th>
              <th className="px-6 py-6">Designation</th>
              <th className="px-6 py-6">Contact</th>
              <th className="px-6 py-6">Status</th>
              <th className="px-6 py-6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-sm text-[#625e58]"
                >
                  Loading employees...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-base text-gray-500 italic"
                >
                  {error}
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-sm text-[#625e58]"
                >
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map((employee) => (
                <tr
                  key={employee.emp_id}
                  className="h-[105px] border-t border-[rgba(194,201,181,0.2)]"
                >
                  {/* Employee */}
                  <td className="px-6">
                    <div className="flex items-center gap-3">
                      {employee.profile_photo ? (
                        <img
                          src={employee.profile_photo}
                          alt={`${employee.first_name} ${employee.last_name}`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edeeef] text-base font-bold uppercase text-[#625e58]">
                          {employee.first_name?.charAt(0)}
                          {employee.last_name?.charAt(0)}
                        </span>
                      )}

                      <div>
                        <p className="max-w-[120px] text-base font-bold leading-6 text-[#191c1d]">
                          {employee.first_name} {employee.last_name}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Employee ID */}
                  <td className="px-6 font-mono text-[13px] font-medium tracking-[0.65px] text-[#424939]">
                    {employee.emp_code}
                  </td>

                  {/* Designation */}
                  <td className="px-6">
                    <p className="text-sm font-medium leading-5 text-[#191c1d]">
                      {employee.designation}
                    </p>
                  </td>

                  {/* Contact */}
                  <td className="px-6">
                    <p className="text-sm leading-5 text-[#191c1d]">
                      {employee.email_1}
                    </p>

                    <p className="text-xs leading-4 text-[#625e58]">
                      {employee.mobile_no_1 || "No phone number"}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-6">
                    <EmployeeStatusBadge status={employee.employment_status} />
                  </td>

                  {/* Actions */}
                  <td className="px-6">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        aria-label={`View ${employee.first_name}`}
                        title="View"
                        onClick={() => onView(employee)}
                        className="rounded-lg p-2 text-[#625e58] transition hover:bg-[#f3f4f5]"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        type="button"
                        aria-label={`Edit ${employee.first_name}`}
                        title="Edit"
                        onClick={() =>
                          navigate(`/employees/${employee.emp_id}/edit`)
                        }
                        className="rounded-lg p-2 text-[#625e58] transition hover:bg-[#f3f4f5]"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        aria-label={`Deactivate ${employee.first_name}`}
                        title="Deactivate"
                        onClick={() => onDelete(employee)}
                        className="rounded-lg p-2 text-[#625e58] transition hover:bg-[#f3f4f5]"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeTable;
