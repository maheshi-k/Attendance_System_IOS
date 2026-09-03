import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import homeIcon from "../../assets/homeIcon.svg";
import QRIcon from "../../assets/QRIcon.svg";
import RecordsIcon from "../../assets/RecordIcon.svg";
import LeaveIcon from "../../assets/LeaveIcon.svg";
import ProfileIcon from "../../assets/ProfileIcon.svg";

const items = [
  {
    label: "Home",
    icon: homeIcon,
    path: "/",
  },
  {
    label: "Scan QR",
    icon: QRIcon,
    path: null,
  },
  {
    label: "Records",
    icon: RecordsIcon,
    path: "/attendance-history",
  },
  {
    label: "Leave",
    icon: LeaveIcon,
    path: "/leave",
  },
  {
    label: "Profile",
    icon: ProfileIcon,
    path: "/profile",
  },
];

type BottomNavigationProps = {
  onScanQR: () => void;
};

function BottomNavigation({ onScanQR }: BottomNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [lastPath, setLastPath] = useState("/");

  const getActiveLabel = () => {
    if (location.pathname === "/") return "Home";
    if (location.pathname === "/attendance-history") return "Records";
    if (location.pathname === "/leave") return "Leave";
    if (location.pathname === "/profile") return "Profile";
    return lastPath;
  };

  const active = getActiveLabel();

  return (
    <nav className="fixed bottom-0 left-1/2 z-10 grid w-full max-w-[672px] -translate-x-1/2 grid-cols-5 border-t border-[#edeeef] bg-white px-2 py-2 shadow-[0_-8px_20px_rgba(0,0,0,0.06)]">
      {items.map((item) => {
        const isActive = active === item.label;

        return (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              if (item.label === "Scan QR") {
                onScanQR();
                return;
              }
              if (item.path) {
                setLastPath(item.path);
                navigate(item.path);
              }
            }}
            className={`flex min-h-12 flex-col items-center justify-center text-[10px] font-medium ${
              isActive ? "text-white" : "text-[#222222]"
            }`}
          >
            <div
              className={`flex h-14 w-14 flex-col items-center justify-center gap-1 rounded-full ${
                isActive
                  ? "bg-[#7CB342] shadow-[0_4px_10px_rgba(124,179,66,0.3)]"
                  : ""
              }`}
            >
              <img
                src={item.icon}
                alt=""
                style={{
                  width: 20,
                  height: 24,
                }}
                className={`object-contain ${
                  isActive ? "brightness-0 invert" : "brightness-0"
                }`}
              />

              <span>{item.label}</span>
            </div>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNavigation;
