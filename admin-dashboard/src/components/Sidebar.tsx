import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { menuItems, bottomItems } from "../config/navigation";
import Logo from "../assets/Logo.png";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const userPermissions = useMemo(() => {
    const storedPermissions = localStorage.getItem("attendance_permissions");
    const parsedPermissions = storedPermissions
      ? JSON.parse(storedPermissions)
      : [];

    return parsedPermissions.map(
      (permission: { permission_code?: string }) => permission.permission_code,
    );
  }, [location.pathname]);

  const visibleMenuItems = useMemo(
    () =>
      menuItems.filter((item) => {
        if (item.disabled) return false;
        if (!item.permission) return true;
        return userPermissions.includes(item.permission);
      }),
    [userPermissions],
  );

  const toggleMenu = (label: string) => {
    setExpandedMenu((current) => (current === label ? null : label));
  };

  const closeExpandedMenu = () => {
    setExpandedMenu(null);
  };

  useEffect(() => {
    if (!location.pathname.startsWith("/")) {
      setExpandedMenu(null);
    }
  }, [location.pathname]);

  return (
    <aside className="hidden min-h-screen w-sidebar shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
      <div
        className="flex h-[124px] items-center gap-4 px-[30px] cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <img
          src={Logo}
          alt="Logo"
          onClick={() => {
            navigate("/dashboard");
          }}
          className="h-[45px] w-[45px] rounded-md object-contain"
        />

        <div>
          <h1 className="text-lg font-bold leading-5 text-[var(--text-secondary)]">
            Admin Portal
          </h1>

          <p className="mt-1 text-2xs tracking-[1px] text-gray-500">
            ATTENDANCE SYSTEM
          </p>
        </div>
      </div>

      <nav className="px-2">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;

          if (item.children) {
            const visibleChildren = item.children.filter(
              (child) =>
                !child.permission || userPermissions.includes(child.permission),
            );

            if (!visibleChildren.length) {
              return null;
            }

            const isExpanded = expandedMenu === item.label;

            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => toggleMenu(item.label)}
                  className={`flex h-[42px] w-full items-center gap-3 rounded-lg px-4 text-sm font-medium transition ${
                    isExpanded
                      ? "bg-[var(--secondary-opc-10)] text-[var(--text-secondary-dark)]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={20} strokeWidth={1.8} />

                  <span>{item.label}</span>

                  <ChevronDown
                    size={14}
                    className={`ml-auto transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="ml-[48px] space-y-1 py-2">
                    {visibleChildren.map((child) => (
                      <NavLink
                        key={child.label}
                        to={child.path}
                        className={({ isActive }) =>
                          `block rounded-md py-2 text-sm transition ${
                            isActive
                              ? "font-medium text-[var(--text-secondary)]"
                              : "text-gray-600 hover:text-[var(--text-secondary)]"
                          }`
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.path}
              end
              onClick={closeExpandedMenu}
              className={({ isActive }) =>
                `flex h-[42px] w-full items-center gap-3 rounded-lg px-4 text-sm font-medium transition ${
                  isActive && !expandedMenu
                    ? "bg-[var(--secondary-opc-10)] text-[var(--text-secondary-dark)]"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              <Icon size={20} strokeWidth={1.8} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto px-4 pb-4">
        {/* <button
          type="button"
          className="flex h-[47px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--text-secondary)] text-base font-bold text-white transition hover:bg-[var(--text-secondary-dark)]"
        >
          <PlusCircle size={21} strokeWidth={2} />
          <span>Generate Report</span>
        </button> */}
      </div>

      <div className="border-t border-gray-200 px-2 py-4">
        {bottomItems.map((item) => {
          const Icon = item.icon;

          if (item.action === "logout") {
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setExpandedMenu(null);
                  localStorage.removeItem("attendance_token");
                  localStorage.removeItem("attendance_employee");
                  window.dispatchEvent(new Event("auth:change"));
                  navigate("/login", { replace: true });
                }}
                className="flex h-[42px] w-full items-center gap-3 rounded-lg px-4 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <Icon size={21} strokeWidth={1.8} />
                <span>{item.label}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.label}
              to={item.path}
              end
              onClick={closeExpandedMenu}
              className={({ isActive }) =>
                `flex h-[42px] w-full items-center gap-3 rounded-lg px-4 text-sm font-medium transition ${
                  isActive
                    ? "bg-[var(--secondary-opc-10)] text-[var(--text-secondary-dark)]"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <Icon size={21} strokeWidth={1.8} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}

export default Sidebar;
