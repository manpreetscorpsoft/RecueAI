import logo from "../../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Sidebar({
  role = "admin",
  onLogout,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    {
      label: t("navigation.dashboard"),
      path: "/dashboard",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <rect
            x="3"
            y="3"
            width="7"
            height="7"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <rect
            x="14"
            y="3"
            width="7"
            height="7"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <rect
            x="3"
            y="14"
            width="7"
            height="7"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <rect
            x="14"
            y="14"
            width="7"
            height="7"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      ),
    },
    {
      label: t("navigation.expenses"),
      path: "/expenses",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <rect
            x="6"
            y="3"
            width="12"
            height="18"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M9 8h6M9 12h6M9 16h4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      label: t("navigation.account"),
      path: "/account",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <circle
            cx="12"
            cy="8"
            r="3"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M6.5 20v-2.5A5.5 5.5 0 0 1 12 12a5.5 5.5 0 0 1 5.5 5.5V20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  // Group is available for members only.
  if (role === "member") {
    menuItems.push({
      label: t("navigation.group"),
      path: "/group",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
          <circle
            cx="16.5"
            cy="9"
            r="2.5"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M3.5 20v-2A5.5 5.5 0 0 1 9 12.5 5.5 5.5 0 0 1 14.5 18v2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M15 14a4.5 4.5 0 0 1 5.5 4.4V20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),
    });
  }

  return (
    <aside
      className="
    sticky
    top-0
    hidden
    h-dvh
    w-[240px]
    shrink-0
    self-start
    overflow-y-auto
    border-r
    border-[#3b3525]
    bg-[#171c22]

    lg:flex
    lg:flex-col
  "
    >
      {/* Logo */}

      <div className="flex h-[100px] items-center px-4">
        <img
          src={logo}
          alt="Ivory Nexus Solutions"
          className="max-h-[84px] w-auto object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="mt-3 flex flex-col gap-2 px-4">
        {menuItems.map((item) => {
          const isActive = item.path === location.pathname;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                if (item.path) {
                  navigate(item.path);
                }
              }}
              className={`
                flex
                h-[46px]
                w-full
                items-center
                gap-3
                rounded-[10px]
                px-4
                text-left
                text-[14px]
                transition-colors

                ${
                  isActive
                    ? "border border-[#51462a] bg-[#35332a] text-[#f5f1e8]"
                    : "border border-transparent text-[#9a9da2] hover:bg-[#20252c] hover:text-white"
                }
              `}
            >
              <span className={isActive ? "text-[#d4ad3f]" : "text-[#96999e]"}>
                {item.icon}
              </span>

              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="
            flex
            h-[46px]
            w-full
            items-center
            gap-3
            rounded-[10px]
            border
            border-transparent
            px-4
            text-left
            text-[14px]
            text-[#9a9da2]
            transition-colors
            hover:bg-[#20252c]
            hover:text-white
          "
        >
          <span className="text-[#96999e]">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M14 8l4 4-4 4M8 12h10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <span>{t("navigation.logout")}</span>
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
