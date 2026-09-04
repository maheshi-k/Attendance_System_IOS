import {
  Briefcase,
  CalendarDays,
  Camera,
  Edit3,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { useEmployee } from "../context/EmployeeContext";
import avatarAsset from "../assets/avatar.png";
import {
  updateMyProfile,
  type UpdateMyProfileData,
} from "../services/employee.service";
import { useRef, useState } from "react";

function ProfilePage() {
  const { employee, loading, setEmployee } = useEmployee();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<UpdateMyProfileData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openEditDrawer = () => {
    if (!employee) return;

    setEditForm({
      first_name: employee.first_name,
      last_name: employee.last_name,
      email_2: employee.email_2,
      mobile_no_1: employee.mobile_no_1,
      mobile_no_2: employee.mobile_no_2,
      address: employee.address,
      gender: employee.gender,
      nic: employee.nic,
      profile_photo: employee.profile_photo,
    });
    setSaveError("");
    setIsEditOpen(true);
  };

  const updateField = <K extends keyof UpdateMyProfileData>(
    field: K,
    value: UpdateMyProfileData[K],
  ) => {
    setEditForm((current) =>
      current ? { ...current, [field]: value } : current,
    );
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      updateField("profileFile", file);
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editForm) return;

    setSaving(true);
    setSaveError("");

    try {
      const updatedEmployee = await updateMyProfile(editForm);
      setEmployee(updatedEmployee);
      setIsEditOpen(false);
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Unable to update profile",
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-[#625e58]">Loading profile...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-[#625e58]">Unable to load profile.</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f8f9fa] pb-28 m-2 text-[#191c1d]">
      <main className="mx-auto flex w-full max-w-[672px] flex-col gap-4 px-4 pb-10 pt-5">
        <section className="rounded-[22px] border border-[#e4e7df] bg-white p-4 shadow-[0_8px_24px_rgba(18,18,18,0.04)]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.6px] text-[#625e58]">
                My Profile
              </p>
              <h1 className="mt-1 text-[28px] font-semibold leading-tight text-[#191c1d]">
                {employee.first_name} {employee.last_name}
              </h1>
            </div>

            <button
              type="button"
              onClick={openEditDrawer}
              className="flex items-center gap-2 rounded-full bg-[#3c6a00] px-3.5 py-2 text-[12px] font-semibold text-white shadow-[0_6px_12px_rgba(60,106,0,0.2)]"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </button>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <div className="relative">
              <img
                src={employee.profile_photo || avatarAsset}
                alt={`${employee.first_name} ${employee.last_name}`}
                className="h-[88px] w-[88px] rounded-full object-cover ring-[4px] ring-[#edf3e5]"
              />
              <button
                type="button"
                onClick={openEditDrawer}
                aria-label="Update profile image"
                className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#3c6a00] text-white shadow-md"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[16px] font-semibold text-[#191c1d]">
                {employee.designation}
              </p>
              <p className="mt-1 text-[12px] text-[#625e58]">
                {employee.emp_code}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#edf3e5] px-2.5 py-1 text-[11px] font-medium text-[#234100]">
                <span className="h-2 w-2 rounded-full bg-[#7cb342]" />
                {employee.employment_status}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[20px] border border-[#e4e7df] bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#3c6a00]" />
            <h2 className="text-[16px] font-semibold text-[#191c1d]">
              Conatct Details
            </h2>
          </div>

          <div className="rounded-[18px] border border-[#e4e7df] bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-[#625e58]">
              <Mail className="h-4 w-4 text-[#3c6a00]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.5px]">
                Official Email
              </span>
            </div>
            <p className="mt-3 text-[14px] font-medium text-[#191c1d]">
              {employee.email_1}
            </p>
            <br></br>
            <div className="flex items-center gap-2 text-[#625e58]">
              <Mail className="h-4 w-4 text-[#3c6a00]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.5px]">
                Personal Email
              </span>
            </div>
            <p className="mt-3 text-[14px] font-medium text-[#191c1d]">
              {employee.email_2}
            </p>
          </div>

          <div className="rounded-[18px] border border-[#e4e7df] bg-white p-3 mt-2 shadow-sm">
            <div className="flex items-center gap-2 text-[#625e58]">
              <Phone className="h-4 w-4 text-[#3c6a00]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.5px]">
                Phone
              </span>
            </div>
            <p className="mt-3 text-[14px] font-medium text-[#191c1d]">
              {employee.mobile_no_1}
            </p>
            <p className="mt-3 text-[14px] font-medium text-[#191c1d]">
              {employee.mobile_no_2}
            </p>
          </div>
        </section>

        <section className="rounded-[20px] border border-[#e4e7df] bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#3c6a00]" />
            <h2 className="text-[16px] font-semibold text-[#191c1d]">
              Personal Details
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[12px] bg-[#f8f9fa] p-3">
              <p className="text-[11px] uppercase tracking-[0.5px] text-[#625e58]">
                Full Name
              </p>
              <p className="mt-2 text-[15px] font-medium text-[#191c1d]">
                {employee.first_name} {employee.last_name}
              </p>
            </div>

            <div className="rounded-[12px] bg-[#f8f9fa] p-3">
              <p className="text-[11px] uppercase tracking-[0.5px] text-[#625e58]">
                Employee ID
              </p>
              <p className="mt-2 text-[15px] font-medium text-[#191c1d]">
                {employee.emp_code}
              </p>
            </div>

            <div className="rounded-[12px] bg-[#f8f9fa] p-3">
              <div className="flex items-center gap-2 text-[#625e58]">
                <p className="text-[11px] uppercase tracking-[0.5px]">
                  Address
                </p>
              </div>
              <p className="mt-2 text-[15px] font-medium text-[#191c1d]">
                {employee.address}
              </p>
            </div>

            <div className="rounded-[12px] bg-[#f8f9fa] p-3">
              <div className="flex items-center gap-2 text-[#625e58]">
                <p className="text-[11px] uppercase tracking-[0.5px]">Gender</p>
              </div>
              <p className="mt-2 text-[15px] font-medium text-[#191c1d]">
                {employee.gender}
              </p>
            </div>

            <div className="rounded-[12px] bg-[#f8f9fa] p-3">
              <div className="flex items-center gap-2 text-[#625e58]">
                <p className="text-[11px] uppercase tracking-[0.5px]">
                  NIC Number
                </p>
              </div>
              <p className="mt-2 text-[15px] font-medium text-[#191c1d]">
                {employee.nic}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[20px] border border-[#e4e7df] bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <UserRound className="h-4 w-4 text-[#3c6a00]" />
            <h2 className="text-[16px] font-semibold text-[#191c1d]">
              Employment Details
            </h2>
          </div>

          <div className="space-y-3">
            <div className="rounded-[12px] bg-[#f8f9fa] p-3">
              <div className="flex items-center gap-2 text-[#625e58]">
                <p className="text-[11px] uppercase tracking-[0.5px]">
                  Current Employment
                </p>
              </div>
              <p className="mt-2 text-[15px] font-medium text-[#191c1d]">
                {employee.designation}
              </p>
            </div>
            <div className="rounded-[12px] bg-[#f8f9fa] p-3">
              <div className="flex items-center gap-2 text-[#625e58]">
                <p className="text-[11px] uppercase tracking-[0.5px]">
                  Current Status
                </p>
              </div>
              <p className="mt-2 text-[15px] font-medium text-[#191c1d]">
                {employee.employment_status}
              </p>
            </div>
            <div className="rounded-[12px] bg-[#f8f9fa] p-3">
              <div className="flex items-center gap-2 text-[#625e58]">
                <p className="text-[11px] uppercase tracking-[0.5px]">
                  Joining Date
                </p>
              </div>
              <p className="mt-2 text-[15px] font-medium text-[#191c1d]">
                {formatDate(employee.joining_date)}
              </p>
            </div>
          </div>
        </section>
      </main>

      {isEditOpen && editForm && (
        <div className="fixed inset-0 z-50 bg-black/30" role="presentation">
          <button
            type="button"
            aria-label="Close edit profile drawer"
            className="absolute inset-0 h-full w-full cursor-default"
            onClick={() => setIsEditOpen(false)}
          />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e4e7df] px-5 py-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.6px] text-[#625e58]">
                  Profile settings
                </p>
                <h2 className="mt-1 text-xl font-semibold text-[#191c1d]">
                  Edit profile
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                aria-label="Close edit profile"
                className="rounded-full p-2 text-[#625e58] hover:bg-[#f1f4eb]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      editForm.profileFile
                        ? URL.createObjectURL(editForm.profileFile)
                        : editForm.profile_photo || avatarAsset
                    }
                    alt="Profile preview"
                    className="h-16 w-16 rounded-full object-cover ring-4 ring-[#edf3e5]"
                  />
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full bg-[#edf3e5] px-3 py-2 text-xs font-semibold text-[#234100]"
                    >
                      Change photo
                    </button>
                    <p className="mt-1 text-xs text-[#625e58]">
                      PNG, JPG or WEBP
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-medium text-[#625e58]">
                    First name
                    <input
                      required
                      value={editForm.first_name}
                      onChange={(event) =>
                        updateField("first_name", event.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-[#c2c9b5] px-3 py-2.5 text-sm text-[#191c1d] outline-none focus:border-[#3c6a00]"
                    />
                  </label>
                  <label className="text-xs font-medium text-[#625e58]">
                    Last name
                    <input
                      required
                      value={editForm.last_name}
                      onChange={(event) =>
                        updateField("last_name", event.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-[#c2c9b5] px-3 py-2.5 text-sm text-[#191c1d] outline-none focus:border-[#3c6a00]"
                    />
                  </label>
                </div>

                <label className="block text-xs font-medium text-[#625e58]">
                  Personal email
                  <input
                    type="email"
                    value={editForm.email_2 ?? ""}
                    onChange={(event) =>
                      updateField("email_2", event.target.value)
                    }
                    className="mt-1 w-full rounded-lg border border-[#c2c9b5] px-3 py-2.5 text-sm text-[#191c1d] outline-none focus:border-[#3c6a00]"
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-medium text-[#625e58]">
                    Primary phone
                    <input
                      required
                      value={editForm.mobile_no_1 ?? ""}
                      onChange={(event) =>
                        updateField("mobile_no_1", event.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-[#c2c9b5] px-3 py-2.5 text-sm text-[#191c1d] outline-none focus:border-[#3c6a00]"
                    />
                  </label>
                  <label className="text-xs font-medium text-[#625e58]">
                    Secondary phone
                    <input
                      value={editForm.mobile_no_2 ?? ""}
                      onChange={(event) =>
                        updateField("mobile_no_2", event.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-[#c2c9b5] px-3 py-2.5 text-sm text-[#191c1d] outline-none focus:border-[#3c6a00]"
                    />
                  </label>
                </div>

                <label className="block text-xs font-medium text-[#625e58]">
                  Address
                  <textarea
                    value={editForm.address ?? ""}
                    onChange={(event) =>
                      updateField("address", event.target.value)
                    }
                    rows={3}
                    className="mt-1 w-full resize-none rounded-lg border border-[#c2c9b5] px-3 py-2.5 text-sm text-[#191c1d] outline-none focus:border-[#3c6a00]"
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-medium text-[#625e58]">
                    Gender
                    <select
                      required
                      value={editForm.gender ?? ""}
                      onChange={(event) =>
                        updateField("gender", event.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-[#c2c9b5] bg-white px-3 py-2.5 text-sm text-[#191c1d] outline-none focus:border-[#3c6a00]"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  <label className="text-xs font-medium text-[#625e58]">
                    NIC number
                    <input
                      required
                      value={editForm.nic ?? ""}
                      onChange={(event) =>
                        updateField("nic", event.target.value)
                      }
                      className="mt-1 w-full rounded-lg border border-[#c2c9b5] px-3 py-2.5 text-sm text-[#191c1d] outline-none focus:border-[#3c6a00]"
                    />
                  </label>
                </div>

                {saveError && (
                  <p className="text-sm text-[#ba1a1a]">{saveError}</p>
                )}
              </div>

              <div className="flex gap-3 border-t border-[#e4e7df] px-5 py-4">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 rounded-full border border-[#c2c9b5] px-4 py-3 text-sm font-semibold text-[#3c6a00]"
                >
                  Cancel
                </button>
                <button
                  disabled={saving}
                  type="submit"
                  className="flex-1 rounded-full bg-[#3c6a00] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
