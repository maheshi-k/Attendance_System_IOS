import {
  ArrowLeft,
  BriefcaseBusiness,
  ImagePlus,
  LockKeyhole,
  Plus,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createEmployee,
  getEmployeeById,
  getEmployeeDesignationHistory,
  updateEmployee,
} from "../../services/employee.service";
import type { EmployeeRecord, DesignationHistory } from "../../types/employee";

type DesignationRow = {
  id: number;
  isPresent: boolean;
  effectiveTo: string;
  designation?: string;
  effectiveFrom?: string;
};

function AddEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [employee, setEmployee] = useState<EmployeeRecord | null>(null);
  const [loading, setLoading] = useState(isEditing);
  const [designationRows, setDesignationRows] = useState<DesignationRow[]>([
    { id: 0, isPresent: true, effectiveTo: "" },
  ]);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [employeeCode, setEmployeeCode] = useState("");
  const [password, setPassword] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!profilePhoto) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(profilePhoto);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [profilePhoto]);

  useEffect(() => {
    if (!id) {
      return;
    }

    const loadEmployee = async () => {
      try {
        const [employeeResponse, historyResponse] = await Promise.all([
          getEmployeeById(Number(id)),
          getEmployeeDesignationHistory(Number(id)),
        ]);
        setEmployee(employeeResponse.data);
        setEmployeeCode(employeeResponse.data.emp_code);
        setDesignationRows(
          historyResponse.data.length > 0
            ? historyResponse.data
                .slice()
                .reverse()
                .map((history: DesignationHistory, index: number) => ({
                  id: index,
                  isPresent: history.effective_to == null,
                  effectiveTo: history.effective_to
                    ? new Date(history.effective_to).toISOString().slice(0, 10)
                    : "",
                  designation: history.designation,
                  effectiveFrom: new Date(history.effective_from)
                    .toISOString()
                    .slice(0, 10),
                }))
            : [{ id: 0, isPresent: true, effectiveTo: "" }],
        );
      } catch (error) {
        console.error("Failed to load employee:", error);
        toast.error("Failed to load employee");
        navigate("/employees");
      } finally {
        setLoading(false);
      }
    };

    loadEmployee();
  }, [id, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const employeeData = new FormData();

    employeeData.append("emp_code", form.get("employeeId") as string);
    employeeData.append("first_name", form.get("firstName") as string);
    employeeData.append("last_name", form.get("lastName") as string);
    employeeData.append("email_1", form.get("email1") as string);
    employeeData.append("email_2", form.get("email2") as string);
    if (password) {
      employeeData.append("password", password);
    }
    employeeData.append("nic", form.get("nationalId") as string);
    employeeData.append("gender", form.get("gender") as string);
    employeeData.append("address", form.get("address") as string);
    employeeData.append("role_id", form.get("role") as string);
    employeeData.append(
      "employment_status",
      form.get("employmentStatus") as string,
    );
    employeeData.append("mobile_no_1", form.get("mobile1") as string);
    employeeData.append("mobile_no_2", form.get("mobile2") as string);
    employeeData.append("joining_date", form.get("joiningDate") as string);
    const designationHistory = designationRows.map((row) => ({
      designation: form.get(`designation-${row.id}`),
      effective_from: form.get(`startDate-${row.id}`),
      effective_to: row.isPresent ? null : form.get(`endDate-${row.id}`),
      is_present: row.isPresent,
    }));
    const currentDesignation =
      designationHistory.find((history) => history.is_present) ??
      designationHistory[designationHistory.length - 1];
    employeeData.append("designation", String(currentDesignation.designation));
    employeeData.append(
      "designation_history",
      JSON.stringify(designationHistory),
    );
    employeeData.append("is_active", "true");

    if (profilePhoto) {
      employeeData.append("profile_photo", profilePhoto);
    }

    try {
      const result = isEditing
        ? await updateEmployee(Number(id), employeeData)
        : await createEmployee(employeeData);

      console.log(
        `Employee ${isEditing ? "updated" : "created"} successfully:`,
        result,
      );

      toast.success(
        `Employee ${isEditing ? "updated" : "created"} successfully!`,
      );

      navigate("/employees");
    } catch (error) {
      console.error("Error creating employee:", error);

      toast.error(
        error instanceof Error ? error.message : "Failed to create employee",
      );
    }
  };

  const addDesignation = () => {
    setDesignationRows((rows) => [
      ...rows,
      { id: rows.length, isPresent: true, effectiveTo: "" },
    ]);
  };

  const setDesignationPresent = (id: number, isPresent: boolean) => {
    setDesignationRows((rows) =>
      rows.map((row) => (row.id === id ? { ...row, isPresent } : row)),
    );
  };

  if (loading || (isEditing && !employee)) {
    return (
      <section className="p-8 text-sm text-[var(--text-primary-light)]">
        Loading employee...
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-0 flex-col gap-6 overflow-y-auto p-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Back to employees"
          title="Back to employees"
          onClick={() => navigate("/employees")}
          className="rounded-lg p-1 text-[var(--text-primary-dark-green)] transition hover:bg-[var(--text-primary-opc-10)]"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold text-[var(--text-primary-green)]">
          {isEditing ? "Edit Employee" : "Add New Employee"}
        </h1>
      </div>

      <form
        key={employee?.emp_id ?? "new"}
        onSubmit={handleSubmit}
        className="grid grid-cols-[minmax(0,1fr)_250px] gap-6"
      >
        <div className="flex flex-col gap-6">
          <fieldset className="rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-primary)] p-5">
            <legend className="sr-only">Personal Information</legend>
            <div className="mb-5 flex items-center gap-2 text-lg font-semibold text-[var(--text-primary-dark)]">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--secondary-soft)] text-[var(--secondary-muted)]">
                <UserRound size={15} />
              </span>
              Personal Information
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <label className="text-sm font-medium text-[var(--text-primary-light)]">
                First Name
                <input
                  required
                  name="firstName"
                  defaultValue={employee?.first_name ?? ""}
                  placeholder="John"
                  className="mt-1.5 h-10 w-full rounded-lg bg-[var(--surface-input)] px-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
                />
              </label>
              <label className="text-sm font-medium text-[var(--text-primary-light)]">
                Last Name
                <input
                  required
                  name="lastName"
                  defaultValue={employee?.last_name ?? ""}
                  placeholder="Doe"
                  className="mt-1.5 h-10 w-full rounded-lg bg-[var(--surface-input)] px-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
                />
              </label>
              <label className="text-sm font-medium text-[var(--text-primary-light)]">
                Employee ID
                <input
                  required
                  name="employeeId"
                  value={employeeCode}
                  onChange={(event) => {
                    const value = event.target.value;
                    setEmployeeCode(value);
                    if (!isEditing) {
                      setPassword(value);
                    }
                  }}
                  placeholder="EMP-2024-001"
                  className="mt-1.5 h-10 w-full rounded-lg bg-[var(--surface-input)] px-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
                />
              </label>
              <label className="text-sm font-medium text-[var(--text-primary-light)]">
                NIC / National ID
                <input
                  required
                  name="nationalId"
                  defaultValue={employee?.nic ?? ""}
                  placeholder="123456789V"
                  className="mt-1.5 h-10 w-full rounded-lg bg-[var(--surface-input)] px-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
                />
              </label>
              <label className="text-sm font-medium text-[var(--text-primary-light)]">
                Email Address 1
                <input
                  required
                  type="email"
                  name="email1"
                  defaultValue={employee?.email_1 ?? ""}
                  placeholder="john.doe@biogrowth.com"
                  className="mt-1.5 h-10 w-full rounded-lg bg-[var(--surface-input)] px-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
                />
              </label>
              <label className="text-sm font-medium text-[var(--text-primary-light)]">
                Email Address 2
                <input
                  type="email"
                  name="email2"
                  defaultValue={employee?.email_2 ?? ""}
                  placeholder="john.doe.personal@example.com"
                  className="mt-1.5 h-10 w-full rounded-lg bg-[var(--surface-input)] px-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
                />
              </label>
              <label className="text-sm font-medium text-[var(--text-primary-light)]">
                Gender
                <select
                  name="gender"
                  defaultValue={employee?.gender ?? ""}
                  className="mt-1.5 h-10 w-full rounded-lg bg-[var(--surface-input)] px-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option>Female</option>
                  <option>Male</option>
                </select>
              </label>
              <label className="text-sm font-medium text-[var(--text-primary-light)]">
                Role
                <select
                  required
                  name="role"
                  defaultValue={String(employee?.role_id ?? 1)}
                  className="mt-1.5 h-10 w-full rounded-lg bg-[var(--surface-input)] px-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
                >
                  <option value="1">Employee</option>
                  <option value="2">Admin</option>
                  <option value="3">Supervisor</option>
                </select>
              </label>
              <label className="text-sm font-medium text-[var(--text-primary-light)]">
                Address
                <input
                  name="address"
                  defaultValue={employee?.address ?? ""}
                  placeholder="123 Main Street, Colombo"
                  className="mt-1.5 h-10 w-full rounded-lg bg-[var(--surface-input)] px-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
                />
              </label>
              <label className="text-sm font-medium text-[var(--text-primary-light)]">
                Mobile Number 1
                <input
                  required
                  name="mobile1"
                  defaultValue={employee?.mobile_no_1 ?? ""}
                  placeholder="0712345678"
                  className="mt-1.5 h-10 w-full rounded-lg bg-[var(--surface-input)] px-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
                />
              </label>
              <label className="text-sm font-medium text-[var(--text-primary-light)]">
                Mobile Number 2
                <input
                  name="mobile2"
                  defaultValue={employee?.mobile_no_2 ?? ""}
                  placeholder="0771234567"
                  className="mt-1.5 h-10 w-full rounded-lg bg-[var(--surface-input)] px-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
                />
              </label>
              <label className="text-sm font-medium text-[var(--text-primary-light)]">
                Joining Date
                <input
                  required
                  type="date"
                  name="joiningDate"
                  defaultValue={employee?.joining_date?.slice(0, 10) ?? ""}
                  className="mt-1.5 h-10 w-full rounded-lg bg-[var(--surface-input)] px-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-primary)] p-5">
            <legend className="sr-only">Employment Details</legend>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-lg font-semibold text-[var(--text-primary-dark)]">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--secondary-soft)] text-[var(--secondary-muted)]">
                  <BriefcaseBusiness size={15} />
                </span>
                Employment Details
              </div>
              {!isEditing && (
                <button
                  type="button"
                  onClick={addDesignation}
                  className="flex items-center gap-1.5 rounded-lg border border-[var(--border-dashed)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--secondary-soft)]"
                >
                  <Plus size={14} />
                  Add Designation
                </button>
              )}
            </div>
            <div className="flex flex-col gap-4">
              {designationRows.map((row, index) => (
                <div
                  key={row.id}
                  className="rounded-xl border border-[var(--border-muted)] p-4"
                >
                  <p className="mb-4 text-sm font-semibold text-[var(--text-primary-dark)]">
                    Job Position {index + 1}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="text-sm font-medium text-[var(--text-primary-light)]">
                      Designation
                      <select
                        required
                        name={`designation-${row.id}`}
                        defaultValue={
                          row.designation ??
                          (index === 0
                            ? (employee?.designation ?? "Software Engineer")
                            : "")
                        }
                        className="mt-1.5 h-10 w-full rounded-lg bg-[var(--surface-input)] px-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
                      >
                        <option value="" disabled>
                          Select designation
                        </option>

                        <option value="Software Engineer">
                          Software Engineer
                        </option>

                        <option value="Intern Software Engineer">
                          Intern Software Engineer
                        </option>

                        <option value="Senior Software Engineer">
                          Senior Software Engineer
                        </option>

                        <option value="Tech Lead">Tech Lead</option>

                        <option value="QA Engineer">QA Engineer</option>

                        <option value="Senior QA Engineer">
                          Senior QA Engineer
                        </option>

                        <option value="UI/UX Engineer">UI/UX Engineer</option>
                      </select>
                    </label>
                    <label className="text-sm font-medium text-[var(--text-primary-light)]">
                      Employment Type
                      <select
                        required
                        name="employmentStatus"
                        defaultValue={employee?.employment_status ?? "Active"}
                        className="mt-1.5 h-10 w-full rounded-lg bg-[var(--surface-input)] px-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
                      >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Probation">Probation</option>
                      </select>
                    </label>
                    <label className="text-sm font-medium text-[var(--text-primary-light)]">
                      Start Date
                      <input
                        required
                        type="date"
                        name={`startDate-${row.id}`}
                        defaultValue={
                          row.effectiveFrom ??
                          (index === 0
                            ? employee?.joining_date?.slice(0, 10)
                            : "")
                        }
                        className="mt-1.5 h-10 w-full rounded-lg bg-[var(--surface-input)] px-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
                      />
                    </label>
                    <div className="text-sm font-medium text-[var(--text-primary-light)]">
                      End Date / Present
                      <div className="mt-1.5 flex items-center gap-3">
                        <input
                          type="date"
                          name={`endDate-${row.id}`}
                          defaultValue={row.effectiveTo}
                          required={!row.isPresent}
                          disabled={row.isPresent}
                          className="h-10 min-w-0 flex-1 rounded-lg bg-[var(--surface-input)] px-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)] disabled:cursor-not-allowed disabled:opacity-60"
                        />
                        <label className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-[var(--text-primary-light)]">
                          <input
                            type="checkbox"
                            name={`present-${row.id}`}
                            checked={row.isPresent}
                            onChange={(event) =>
                              setDesignationPresent(
                                row.id,
                                event.target.checked,
                              )
                            }
                            className="h-4 w-4 accent-[var(--secondary-action)]"
                          />
                          Present
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="flex flex-col gap-6">
          <fieldset className="rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-primary)] p-5">
            <legend className="sr-only">Profile Photo</legend>
            <p className="mb-4 text-lg font-semibold text-[var(--text-primary-dark)]">
              Profile Photo
            </p>
            <label
              htmlFor="profile-photo-upload"
              className="group relative mx-auto flex h-[126px] w-[126px] cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[var(--border-dashed)] bg-gray-50"
            >
              {profilePhoto && previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile preview"
                  className="absolute inset-0 h-full w-full aspect-square rounded-full object-cover"
                />
              ) : employee?.profile_photo ? (
                <img
                  src={employee.profile_photo}
                  alt="Employee profile"
                  className="absolute inset-0 h-full w-full aspect-square rounded-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <ImagePlus
                    size={22}
                    className="mb-2 text-[var(--icon-muted)]"
                  />

                  <span className="text-[11px] uppercase tracking-[0.5px] text-[var(--text-primary-light)]">
                    Upload Image
                  </span>
                </div>
              )}

              {/* Hover overlay */}
              {(profilePhoto || employee?.profile_photo) && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex flex-col items-center text-white">
                    <ImagePlus size={22} />
                    <span className="mt-1 text-[11px] font-medium">
                      Change Image
                    </span>
                  </div>
                </div>
              )}

              <input
                id="profile-photo-upload"
                type="file"
                name="profile_photo"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  setProfilePhoto(file);
                }}
              />
            </label>

            {/* File name */}
            {profilePhoto && (
              <p
                className="mt-3 max-w-[180px] truncate text-center text-xs text-[var(--text-primary-light)]"
                title={profilePhoto.name}
              >
                {profilePhoto.name}
              </p>
            )}

            {/* Existing image path */}
            {!profilePhoto && employee?.profile_photo && (
              <p
                className="mt-3 max-w-[180px] truncate text-center text-xs text-[var(--text-primary-light)]"
                title={employee.profile_photo}
              >
                {employee.profile_photo.split("/").pop()}
              </p>
            )}

            <p className="mt-1 text-center text-[11px] text-[var(--text-primary-light)]">
              JPG, PNG or WEBP
              <br />
              Max size 2MB. 400×400px recommended.
            </p>
          </fieldset>

          <fieldset className="rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-primary)] p-5">
            <legend className="sr-only">Security and Access</legend>
            <div className="mb-5 flex items-center gap-2 text-lg font-semibold text-[var(--text-primary-dark)]">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--secondary-soft)] text-[var(--secondary-muted)]">
                <ShieldCheck size={15} />
              </span>
              Security &amp; Access
            </div>
            {/* <label className="block text-sm font-medium text-[var(--text-primary-light)]">
              Username
              <div className="relative mt-1.5">
                <UserRound
                  size={12}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--icon-muted)]"
                />
                <input
                  required
                  name="username"
                  placeholder="john.doe"
                  className="h-10 w-full rounded-lg bg-[var(--surface-input)] pl-8 pr-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
                />
              </div>
            </label> */}
            <label className="mt-4 block text-sm font-medium text-[var(--text-primary-light)]">
              Password
              <div className="relative mt-1.5">
                <LockKeyhole
                  size={12}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--icon-muted)]"
                />
                <input
                  required={!isEditing}
                  type="password"
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={
                    isEditing
                      ? "Leave blank to keep current password"
                      : "Employee ID"
                  }
                  className="h-10 w-full rounded-lg bg-[var(--surface-input)] pl-8 pr-3 text-sm text-[var(--text-primary-dark)] outline-none focus:ring-2 focus:ring-[var(--secondary-focus)]"
                />
              </div>
            </label>
          </fieldset>
        </div>

        <div className="col-span-2 flex items-center gap-6 pt-1">
          <button
            type="button"
            onClick={() => navigate("/employees")}
            className="text-sm font-semibold text-[var(--text-primary-light)] transition hover:text-[var(--text-primary-dark)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-[var(--secondary-action)] px-6 py-2.5 text-sm font-bold text-[var(--surface-primary)] shadow-[0_10px_15px_-3px_var(--secondary-soft)] transition hover:bg-[var(--secondary-action-hover)]"
          >
            <Save size={15} />
            Save Employee
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddEmployee;
