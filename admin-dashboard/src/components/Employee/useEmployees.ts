import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  deleteEmployee,
  getAllEmployees,
  getEmployeesByStatus,
} from "../../services/employee.service";

import type { EmployeeRecord, EmployeeStatus } from "../../types/employee";

type StatusFilter = "All Status" | EmployeeStatus;

export function useEmployees(searchQuery = "") {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedStatus, setSelectedStatus] =
    useState<StatusFilter>("All Status");

  const [selectedDesignation, setSelectedDesignation] =
    useState("All Designations");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ---------------------------------------------------------------------------
  // Derived values
  // ---------------------------------------------------------------------------

  const designationOptions = useMemo(() => {
    return Array.from(
      new Set(
        employees
          .map((employee) => employee.designation)
          .filter((designation): designation is string => Boolean(designation)),
      ),
    ).sort();
  }, [employees]);

  const activeDesignation = designationOptions.includes(selectedDesignation)
    ? selectedDesignation
    : "All Designations";

  const filteredEmployees = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        !normalizedQuery ||
        [
          employee.first_name,
          employee.last_name,
          employee.emp_code,
          employee.email_1,
          employee.designation,
        ]
          .filter((value): value is string => Boolean(value))
          .some((value) => value.toLowerCase().includes(normalizedQuery));

      const matchesDesignation =
        activeDesignation === "All Designations" ||
        employee.designation === activeDesignation;

      return matchesSearch && matchesDesignation;
    });
  }, [employees, activeDesignation, searchQuery]);

  const totalEmployees = filteredEmployees.length;

  const totalPages = Math.ceil(totalEmployees / rowsPerPage);

  const visiblePage = totalPages ? Math.min(currentPage, totalPages) : 1;

  const startIndex = (visiblePage - 1) * rowsPerPage;

  const endIndex = Math.min(startIndex + rowsPerPage, totalEmployees);

  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  // ---------------------------------------------------------------------------
  // Load employees
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          selectedStatus === "All Status"
            ? await getAllEmployees()
            : await getEmployeesByStatus(selectedStatus);

        setEmployees(response.data);
        setCurrentPage(1);
      } catch (loadError) {
        console.error("Failed to load employees:", loadError);

        setError("Failed to load employees");
        setEmployees([]);

        toast.error("Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, [selectedStatus]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const deactivateEmployee = async (employee: EmployeeRecord) => {
    const confirmed = window.confirm(
      `Deactivate ${employee.first_name} ${employee.last_name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteEmployee(employee.emp_id);

      setEmployees((currentEmployees) =>
        currentEmployees.filter((item) => item.emp_id !== employee.emp_id),
      );

      toast.success("Employee deactivated successfully");
    } catch (deleteError) {
      console.error("Failed to deactivate employee:", deleteError);

      toast.error("Failed to deactivate employee");
    }
  };

  const changeDesignation = (designation: string) => {
    setSelectedDesignation(designation);
    setCurrentPage(1);
  };

  // ---------------------------------------------------------------------------
  // Return
  // ---------------------------------------------------------------------------

  return {
    // Employee data
    employees: currentEmployees,
    totalEmployees,

    // Loading / error
    loading,
    error,

    // Filters
    selectedStatus,
    selectedDesignation: activeDesignation,
    designationOptions,

    // Pagination
    totalPages,
    currentPage: visiblePage,
    rowsPerPage,
    startIndex,
    endIndex,

    // Setters
    setSelectedStatus,
    setSelectedDesignation: changeDesignation,
    setCurrentPage,
    setRowsPerPage,

    // Actions
    deactivateEmployee,
  };
}
