import {
  ArrowLeft,
  BriefcaseBusiness,
  ImagePlus,
  LockKeyhole,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

function AddEmployee() {
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate("/employees");
  };

  return (
    <section className="flex min-h-full flex-col gap-6 p-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Back to employees"
          title="Back to employees"
          onClick={() => navigate("/employees")}
          className="rounded-lg p-1 text-[#424939] transition hover:bg-[#e7e8e9]"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold text-[#234100]">
          Add New Employee
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-[minmax(0,1fr)_181px] gap-6"
      >
        <div className="flex flex-col gap-6">
          <fieldset className="rounded-2xl border border-[rgba(194,201,181,0.3)] bg-white p-5">
            <legend className="sr-only">Personal Information</legend>
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#191c1d]">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[rgba(127,178,73,0.1)] text-[#4d7b1b]">
                <UserRound size={15} />
              </span>
              Personal Information
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <label className="text-xs font-medium text-[#625e58]">
                First Name
                <input
                  required
                  name="firstName"
                  placeholder="John"
                  className="mt-1.5 h-10 w-full rounded-lg bg-[#f3f4f5] px-3 text-sm text-[#191c1d] outline-none focus:ring-2 focus:ring-[rgba(127,178,73,0.3)]"
                />
              </label>
              <label className="text-xs font-medium text-[#625e58]">
                Last Name
                <input
                  required
                  name="lastName"
                  placeholder="Doe"
                  className="mt-1.5 h-10 w-full rounded-lg bg-[#f3f4f5] px-3 text-sm text-[#191c1d] outline-none focus:ring-2 focus:ring-[rgba(127,178,73,0.3)]"
                />
              </label>
              <label className="text-xs font-medium text-[#625e58]">
                Employee ID
                <input
                  required
                  name="employeeId"
                  placeholder="EMP-2024-001"
                  className="mt-1.5 h-10 w-full rounded-lg bg-[#f3f4f5] px-3 text-sm text-[#191c1d] outline-none focus:ring-2 focus:ring-[rgba(127,178,73,0.3)]"
                />
              </label>
              <label className="text-xs font-medium text-[#625e58]">
                NIC / National ID
                <input
                  required
                  name="nationalId"
                  placeholder="123456789V"
                  className="mt-1.5 h-10 w-full rounded-lg bg-[#f3f4f5] px-3 text-sm text-[#191c1d] outline-none focus:ring-2 focus:ring-[rgba(127,178,73,0.3)]"
                />
              </label>
              <label className="text-xs font-medium text-[#625e58]">
                Email Address
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="john.doe@biogrowth.com"
                  className="mt-1.5 h-10 w-full rounded-lg bg-[#f3f4f5] px-3 text-sm text-[#191c1d] outline-none focus:ring-2 focus:ring-[rgba(127,178,73,0.3)]"
                />
              </label>
              <label className="text-xs font-medium text-[#625e58]">
                Phone Number
                <input
                  required
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  className="mt-1.5 h-10 w-full rounded-lg bg-[#f3f4f5] px-3 text-sm text-[#191c1d] outline-none focus:ring-2 focus:ring-[rgba(127,178,73,0.3)]"
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="rounded-2xl border border-[rgba(194,201,181,0.3)] bg-white p-5">
            <legend className="sr-only">Employment Details</legend>
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#191c1d]">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[rgba(127,178,73,0.1)] text-[#4d7b1b]">
                <BriefcaseBusiness size={15} />
              </span>
              Employment Details
            </div>
            <div className="grid grid-cols-3 gap-4">
              <label className="text-xs font-medium text-[#625e58]">
                Designation
                <input
                  required
                  name="designation"
                  defaultValue="Software Engineer"
                  className="mt-1.5 h-10 w-full rounded-lg bg-[#f3f4f5] px-3 text-sm text-[#191c1d] outline-none focus:ring-2 focus:ring-[rgba(127,178,73,0.3)]"
                />
              </label>
              <label className="text-xs font-medium text-[#625e58]">
                Employment Type
                <select
                  name="employmentType"
                  defaultValue="Full-Time"
                  className="mt-1.5 h-10 w-full rounded-lg bg-[#f3f4f5] px-3 text-sm text-[#191c1d] outline-none focus:ring-2 focus:ring-[rgba(127,178,73,0.3)]"
                >
                  <option>Full-Time</option>
                  <option>Part-Time</option>
                  <option>Contract</option>
                </select>
              </label>
              <label className="text-xs font-medium text-[#625e58]">
                Joining Date
                <input
                  required
                  type="date"
                  name="joiningDate"
                  className="mt-1.5 h-10 w-full rounded-lg bg-[#f3f4f5] px-3 text-sm text-[#191c1d] outline-none focus:ring-2 focus:ring-[rgba(127,178,73,0.3)]"
                />
              </label>
            </div>
          </fieldset>
        </div>

        <div className="flex flex-col gap-6">
          <fieldset className="rounded-2xl border border-[rgba(194,201,181,0.3)] bg-white p-5">
            <legend className="sr-only">Profile Photo</legend>
            <p className="mb-4 text-sm font-semibold text-[#191c1d]">
              Profile Photo
            </p>
            <label className="flex h-[126px] cursor-pointer flex-col items-center justify-center rounded-full border-2 border-dashed border-[#c2c9b5] text-center text-[9px] uppercase tracking-[0.5px] text-[#625e58]">
              <ImagePlus size={22} className="mb-2 text-[#a7af99]" />
              Upload Image
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
              />
            </label>
            <p className="mt-4 text-center text-[9px] leading-4 text-[#625e58]">
              JPG, PNG or WEBP.
              <br />
              Max size 2MB. 400x400px
              <br />
              recommended.
            </p>
          </fieldset>

          <fieldset className="rounded-2xl border border-[rgba(194,201,181,0.3)] bg-white p-5">
            <legend className="sr-only">Security and Access</legend>
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#191c1d]">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[rgba(127,178,73,0.1)] text-[#4d7b1b]">
                <ShieldCheck size={15} />
              </span>
              Security &amp; Access
            </div>
            <label className="block text-xs font-medium text-[#625e58]">
              Username
              <div className="relative mt-1.5">
                <UserRound
                  size={12}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#a7af99]"
                />
                <input
                  required
                  name="username"
                  placeholder="john.doe"
                  className="h-10 w-full rounded-lg bg-[#f3f4f5] pl-8 pr-3 text-sm text-[#191c1d] outline-none focus:ring-2 focus:ring-[rgba(127,178,73,0.3)]"
                />
              </div>
            </label>
            <label className="mt-4 block text-xs font-medium text-[#625e58]">
              Password
              <div className="relative mt-1.5">
                <LockKeyhole
                  size={12}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#a7af99]"
                />
                <input
                  required
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="h-10 w-full rounded-lg bg-[#f3f4f5] pl-8 pr-3 text-sm text-[#191c1d] outline-none focus:ring-2 focus:ring-[rgba(127,178,73,0.3)]"
                />
              </div>
            </label>
          </fieldset>
        </div>

        <div className="col-span-2 flex items-center gap-6 pt-1">
          <button
            type="button"
            onClick={() => navigate("/employees")}
            className="text-sm font-semibold text-[#625e58] transition hover:text-[#191c1d]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-[#7fb249] px-6 py-2.5 text-sm font-bold text-white shadow-[0_10px_15px_-3px_rgba(127,178,73,0.1)] transition hover:bg-[#72a13f]"
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
