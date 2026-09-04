import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoAsset from "../../assets/logo.png";
import avatarAsset from "../../assets/avatar.png";
import { Eye, EyeOff, KeyRound, LogOut, Settings, X } from "lucide-react";
import { changePassword } from "../../services/auth.service";
// import notificationAsset from "../../assets/notificationAsset.svg";

type HomeHeaderProps = {
  employeeName?: string;
  profilePhoto?: string | null;
  employeeRole?: string | null;
  onLogout: () => void;
};

function HomeHeader({
  employeeName,
  profilePhoto,
  employeeRole,
  onLogout,
}: HomeHeaderProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isPasswordDrawerOpen, setIsPasswordDrawerOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();

    setPasswordError("");
    setPasswordMessage("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setSavingPassword(true);

    try {
      await changePassword(currentPassword, newPassword);

      setPasswordMessage("Password updated successfully");

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Close drawer and refresh page
      setTimeout(() => {
        setIsPasswordDrawerOpen(false);
        window.location.reload();
      }, 800);
    } catch (error) {
      setPasswordError(
        error instanceof Error ? error.message : "Unable to update password",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <header className="flex h-16 items-center justify-between px-4">
      <img
        src={logoAsset}
        alt="iOneSoft Solutions"
        onClick={() => navigate("/")}
        className="h-14 w-14 object-contain"
      />
      <div className="flex items-center gap-5">
        {/* <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-8 w-8 items-center justify-center"
        >
          <img
            src={notificationAsset}
            alt=""
            className="h-5 w-5 object-contain"
          />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#3c6a00]" />
        </button> */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((prev) => !prev)}
            aria-label="Open profile menu"
            aria-expanded={isProfileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full"
          >
            <img
              src={profilePhoto || avatarAsset}
              alt={
                employeeName ? `${employeeName} profile` : "Employee profile"
              }
              className="h-10 w-10 rounded-full object-cover"
            />
          </button>

          {/* Profile Menu */}
          {isProfileMenuOpen && (
            <div
              ref={profileMenuRef}
              className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-xl border border-[#e4e7df] bg-white shadow-lg"
            >
              {/* Employee name */}
              {employeeName && (
                <div className="border-b border-[#e4e7df] px-4 py-3">
                  <p className="truncate text-sm font-semibold text-[#191c1d]">
                    {employeeName}
                  </p>

                  <p className="text-xs text-[#625e58]">{employeeRole}</p>
                </div>
              )}

              {/* Settings */}
              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  setPasswordError("");
                  setPasswordMessage("");
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setIsPasswordDrawerOpen(true);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#191c1d] transition-colors hover:bg-[#f1f4eb]"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>

              {/* Logout */}
              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#ba1a1a] transition-colors hover:bg-[#fff1f0]"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {isPasswordDrawerOpen && (
        <div className="fixed inset-0 z-[60] bg-black/30" role="presentation">
          <button
            type="button"
            aria-label="Close password drawer"
            className="absolute inset-0 h-full w-full cursor-default"
            onClick={() => setIsPasswordDrawerOpen(false)}
          />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e4e7df] px-5 py-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.6px] text-[#625e58]">
                  Account security
                </p>
                <h2 className="mt-1 text-xl font-semibold text-[#191c1d]">
                  Reset password
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close password drawer"
                onClick={() => setIsPasswordDrawerOpen(false)}
                className="rounded-full p-2 text-[#625e58] hover:bg-[#f1f4eb]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              className="flex min-h-0 flex-1 flex-col"
              onSubmit={handleUpdate}
            >
              <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
                <div className="flex items-center gap-3 rounded-lg bg-[#edf3e5] p-4 text-sm text-[#234100]">
                  <KeyRound className="h-5 w-5 shrink-0" />
                  <p>Use a password with at least 6 characters.</p>
                </div>
                {[
                  ["Current password", currentPassword, setCurrentPassword],
                  ["New password", newPassword, setNewPassword],
                  ["Confirm new password", confirmPassword, setConfirmPassword],
                ].map(([label, value, setter]) => (
                  <label
                    key={label as string}
                    className="block text-xs font-medium text-[#625e58]"
                  >
                    {label as string}
                    <span className="relative mt-1 block">
                      <input
                        required
                        minLength={label === "Current password" ? undefined : 6}
                        type={showPasswords ? "text" : "password"}
                        value={value as string}
                        onChange={(event) =>
                          (
                            setter as React.Dispatch<
                              React.SetStateAction<string>
                            >
                          )(event.target.value)
                        }
                        className="w-full rounded-lg border border-[#c2c9b5] px-3 py-2.5 pr-11 text-sm text-[#191c1d] outline-none focus:border-[#3c6a00]"
                      />
                      <button
                        type="button"
                        aria-label={
                          showPasswords ? "Hide passwords" : "Show passwords"
                        }
                        onClick={() => setShowPasswords((visible) => !visible)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#625e58] hover:bg-[#f1f4eb]"
                      >
                        {showPasswords ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </span>
                  </label>
                ))}
                {passwordError && (
                  <p className="text-sm text-[#ba1a1a]">{passwordError}</p>
                )}
                {passwordMessage && (
                  <p className="text-sm text-[#3c6a00]">{passwordMessage}</p>
                )}
              </div>
              <div className="flex gap-3 border-t border-[#e4e7df] px-5 py-4">
                <button
                  type="button"
                  onClick={() => setIsPasswordDrawerOpen(false)}
                  className="flex-1 rounded-full border border-[#c2c9b5] px-4 py-3 text-sm font-semibold text-[#3c6a00]"
                >
                  Cancel
                </button>
                <button
                  disabled={savingPassword}
                  type="submit"
                  className="flex-1 rounded-full bg-[#3c6a00] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingPassword ? "Saving..." : "Update password"}
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </header>
  );
}

export default HomeHeader;
