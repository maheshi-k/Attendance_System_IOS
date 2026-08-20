import { Bell, Search, Settings } from "lucide-react";

const administratorProfile =
  "https://www.figma.com/api/mcp/asset/72855ea9-370d-40c2-be9a-c5e05d35be4e.png";

function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[rgba(194,201,181,0.3)] bg-[rgba(248,249,250,0.8)] px-6 backdrop-blur-[6px]">
      <div className="relative w-[320px]">
        <Search
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#73786e]"
          size={18}
          strokeWidth={2}
        />
        <input
          type="search"
          placeholder="Search employees, reports..."
          aria-label="Search employees and reports"
          className="h-10 w-full rounded-full border border-[#c2c9b5] bg-[#f3f4f5] pl-[41px] pr-4 text-sm text-[#191c1d] outline-none placeholder:text-[#6b7280] focus:border-[var(--text-secondary)]"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#625e58] transition hover:bg-black/5"
          >
            <Bell size={20} strokeWidth={2} />
            <span className="absolute right-[8px] top-2 h-2 w-2 rounded-full border-2 border-[#f8f9fa] bg-[#ba1a1a]" />
          </button>
          <button
            type="button"
            aria-label="Settings"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#625e58] transition hover:bg-black/5"
          >
            <Settings size={21} strokeWidth={2} />
          </button>
        </div>

        <div className="h-8 w-px bg-[#c2c9b5]" />

        <div className="flex items-center gap-2.5">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold leading-[17.5px] text-[#191c1d]">
              Administrator
            </span>
            <span className="text-[10px] font-bold leading-[12.5px] tracking-[0.2px] text-[#625e58]">
              Super User
            </span>
          </div>
          <img
            src={administratorProfile}
            alt="Administrator profile"
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
