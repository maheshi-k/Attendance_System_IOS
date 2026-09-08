import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getAllEmployees } from "../../services/employee.service";
import type { EmployeeExportRow, EmployeeRecord } from "../../types/employee";
import ExportData, { type ExportColumn } from "../common/ExportData";

import EmployeeTable from "./EmployeeTable";
import EmployeePagination from "./EmployeePagination";
import EmployeeDrawer from "./EmployeeDrawer";
import EmployeeHeader from "./EmployeeHeader";
import EmployeeFilters from "./EmployeeFilters";
import { useEmployees } from "./useEmployees.ts";

const employeeExportColumns: ExportColumn<EmployeeExportRow>[] = [
  { header: "Employee ID", value: "employeeId", width: 16 },
  { header: "First Name", value: "firstName", width: 16 },
  { header: "Last Name", value: "lastName", width: 16 },
  { header: "Email 1", value: "email1", width: 28 },
  { header: "Email 2", value: "email2", width: 28 },
  { header: "Mobile Number 1", value: "mobile1", width: 18 },
  { header: "Mobile Number 2", value: "mobile2", width: 18 },
  { header: "NIC", value: "nic", width: 16 },
  { header: "Gender", value: "gender", width: 12 },
  { header: "Address", value: "address", width: 32 },
  { header: "Role", value: "role", width: 18 },
  { header: "Designation", value: "designation", width: 28 },
  { header: "Employment Status", value: "employmentStatus", width: 20 },
  { header: "Joining Date", value: "joiningDate", width: 16 },
  { header: "Account Status", value: "accountStatus", width: 16 },
  { header: "Profile Photo", value: "profilePhoto", width: 18 },
  { header: "Created At", value: "createdAt", width: 22 },
  { header: "Updated At", value: "updatedAt", width: 22 },
];

function Employee() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeRecord | null>(null);
  const {
    employees,
    loading,
    error,
    selectedStatus,
    selectedDesignation,
    designationOptions,
    totalEmployees,
    totalPages,
    currentPage,
    rowsPerPage,
    startIndex,
    endIndex,
    setSelectedStatus,
    setSelectedDesignation,
    setCurrentPage,
    setRowsPerPage,
    deactivateEmployee,
  } = useEmployees(searchParams.get("search") ?? "");

  const loadEmployeeExportData = async (): Promise<EmployeeExportRow[]> => {
    const response = await getAllEmployees();
    return response.data.map((employee) => ({
      employeeId: employee.emp_code,
      firstName: employee.first_name,
      lastName: employee.last_name,
      email1: employee.email_1,
      email2: employee.email_2 || "",
      mobile1: employee.mobile_no_1,
      mobile2: employee.mobile_no_2 || "",
      nic: employee.nic,
      gender: employee.gender,
      address: employee.address || "",
      role: employee.role_name,
      designation: employee.designation || "",
      employmentStatus: employee.employment_status,
      joiningDate: employee.joining_date,
      accountStatus: employee.is_active ? "Active" : "Inactive",
      profilePhoto: employee.profile_photo ? "Available" : "Not available",
      createdAt: employee.created_at,
      updatedAt: employee.updated_at,
    }));
  };

  return (
    <section className="flex min-h-full flex-col gap-6 p-8">
      <EmployeeHeader
        exportAction={
          <ExportData
            data={loadEmployeeExportData}
            columns={employeeExportColumns}
            fileName="employees"
            sheetName="Employees"
            label="Export"
          />
        }
        onAddEmployee={() => navigate("/employees/add")}
      />
      <EmployeeFilters
        selectedStatus={selectedStatus}
        selectedDesignation={selectedDesignation}
        designationOptions={designationOptions}
        totalEmployees={totalEmployees}
        startIndex={startIndex}
        endIndex={endIndex}
        onStatusChange={setSelectedStatus}
        onDesignationChange={setSelectedDesignation}
      />

      {/* Employee Table */}
      <EmployeeTable
        employees={employees}
        loading={loading}
        error={error}
        onDelete={deactivateEmployee}
        onView={setSelectedEmployee}
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

      {selectedEmployee && (
        <EmployeeDrawer
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </section>
  );
}

export default Employee;
