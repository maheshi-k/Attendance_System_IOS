import { Edit3, Lock, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { clearAuthentication, getStoredEmployee } from "../../auth/authStorage";

import { changePassword } from "../../services/auth.service";
import { getMyProfile, updateMyProfile } from "../../services/employee.service";

import type { EmployeeRecord } from "../../types/employee";

import ProfileModal from "./ProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";

const displayValue = (value?: string | null) => value || "Not provided";

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function Profile() {
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<EmployeeRecord | null>(() =>
    getStoredEmployee<EmployeeRecord>(),
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getMyProfile();

        setEmployee(response.data);

        localStorage.setItem(
          "attendance_employee",
          JSON.stringify(response.data),
        );
      } catch (error) {
        console.error("Failed to load profile:", error);

        if (!employee) {
          toast.error("Failed to load your profile");
        }
      }
    };

    loadProfile();
  }, []);

  // Update profile
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!employee) return;

    setIsSaving(true);

    try {
      const formData = new FormData(event.currentTarget);

      const response = await updateMyProfile(formData);

      setEmployee(response.data);

      localStorage.setItem(
        "attendance_employee",
        JSON.stringify(response.data),
      );

      window.dispatchEvent(new Event("auth:change"));

      setIsEditing(false);

      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Change password
  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setIsChangingPassword(true);

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      toast.success("Password changed successfully");

      clearAuthentication();
      navigate("/login", { replace: true });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to change password",
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Loading
  if (!employee) {
    return (
      <div className="p-7 text-sm text-[var(--text-primary-light)]">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-full overflow-y-auto p-7">
      <div className="mx-auto max-w-full">
        {/* Page header */}
        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[1px] text-[var(--secondary-muted)]">
              Account
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[var(--text-primary-green)]">
              My Profile
            </h1>

            <p className="mt-1 text-sm text-[var(--text-primary-light)]">
              View and manage your personal details.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 rounded-lg bg-[var(--secondary-action)] px-4 py-2.5 text-sm font-bold text-[var(--text-primary-green)] transition hover:bg-[var(--secondary-action-hover)]"
            >
              <Edit3 size={16} />
              Edit profile
            </button>

            <button
              type="button"
              onClick={() => setIsPasswordOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-[var(--border-muted)] bg-[var(--surface-primary)] px-4 py-2.5 text-sm font-bold text-[var(--text-primary-green)] transition hover:bg-[var(--secondary-soft)]"
            >
              <Lock size={16} />
              Change password
            </button>
          </div>
        </div>

        {/* Profile card */}
        <section className="overflow-hidden rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-primary)] shadow-sm">
          {/* Profile header */}
          <div className="flex items-center gap-4 border-b border-[var(--border-muted)] bg-[var(--secondary-opc-10)] px-6 py-6">
            {employee.profile_photo ? (
              <img
                src={employee.profile_photo}
                alt=""
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--secondary-action)] text-xl font-bold uppercase text-[var(--text-primary-green)]">
                {employee.first_name?.charAt(0)}
                {employee.last_name?.charAt(0)}
              </span>
            )}

            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary-green)]">
                {employee.first_name} {employee.last_name}
              </h2>

              <p className="mt-1 text-sm text-[var(--text-primary-light)]">
                {displayValue(employee.designation)} · {employee.role_name}
              </p>

              <p className="mt-1 font-mono text-xs text-[var(--text-primary-light)]">
                {employee.emp_code}
              </p>
            </div>
          </div>

          {/* Information */}
          <div className="grid gap-8 p-6 md:grid-cols-2">
            <ProfileSection title="Personal information">
              <ProfileItem label="First name" value={employee.first_name} />

              <ProfileItem label="Last name" value={employee.last_name} />

              <ProfileItem label="Gender" value={employee.gender} />

              <ProfileItem label="NIC" value={employee.nic} />

              <ProfileItem
                label="Address"
                value={employee.address}
                icon={<MapPin size={14} />}
                fullWidth
              />
            </ProfileSection>

            <ProfileSection title="Contact information">
              <ProfileItem
                label="Primary email"
                value={employee.email_1}
                icon={<Mail size={14} />}
              />

              <ProfileItem
                label="Secondary email"
                value={employee.email_2}
                icon={<Mail size={14} />}
              />

              <ProfileItem
                label="Primary phone"
                value={employee.mobile_no_1}
                icon={<Phone size={14} />}
              />

              <ProfileItem
                label="Secondary phone"
                value={employee.mobile_no_2}
                icon={<Phone size={14} />}
              />
            </ProfileSection>

            <ProfileSection title="Employment details">
              <ProfileItem label="Designation" value={employee.designation} />

              <ProfileItem label="Status" value={employee.employment_status} />

              <ProfileItem
                label="Joining date"
                value={new Date(employee.joining_date).toLocaleDateString()}
              />

              <ProfileItem label="Role" value={employee.role_name} />
            </ProfileSection>
          </div>
        </section>
      </div>

      {/* Edit profile modal */}
      {isEditing && (
        <ProfileModal
          employee={employee}
          saving={isSaving}
          onClose={() => setIsEditing(false)}
          onSubmit={handleSubmit}
        />
      )}

      {/* Change password modal */}
      {isPasswordOpen && (
        <ChangePasswordModal
          form={passwordForm}
          setForm={setPasswordForm}
          saving={isChangingPassword}
          onClose={() => {
            if (!isChangingPassword) {
              setIsPasswordOpen(false);

              setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
              });
            }
          }}
          onSubmit={handleChangePassword}
        />
      )}
    </div>
  );
}

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="border-b border-[var(--border-muted)] pb-3 text-sm font-bold capitalize text-[var(--text-primary-green)]">
        {title}
      </h2>

      <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function ProfileItem({
  label,
  value,
  icon,
  fullWidth = false,
}: {
  label: string;
  value?: string | null;
  icon?: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <dt className="flex items-center gap-1 text-xs uppercase tracking-wide text-[var(--text-primary-light)]">
        {icon}
        {label}
      </dt>

      <dd className="mt-1 break-words text-sm font-medium text-[var(--text-primary-dark)]">
        {displayValue(value)}
      </dd>
    </div>
  );
}

export default Profile;
