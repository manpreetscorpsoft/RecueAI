import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function MobileBottomNav({ role = "admin" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const items = [
    {
      label: t("navigation.dashboard"),
      path: "/dashboard",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
          <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" />
          <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" />
          <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" />
          <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" />
        </svg>
      ),
    },

    {
      label: t("navigation.expenses"),
      path: "/expenses",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
          <rect
            x="5"
            y="3"
            width="14"
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
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
          <circle
            cx="12"
            cy="8"
            r="3"
            stroke="currentColor"
            strokeWidth="1.8"
          />

          <path
            d="M6 20v-2.5A6 6 0 0 1 12 11.5a6 6 0 0 1 6 6V20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  // Group is available for Admin only.
  if (role === "admin") {
    items.push({
      label: t("navigation.group"),
      path: "/group",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
          <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />

          <circle
            cx="16"
            cy="9"
            r="2.5"
            stroke="currentColor"
            strokeWidth="1.8"
          />

          <path
            d="M3 20v-2a5 5 0 0 1 10 0v2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          <path
            d="M14 14.5a4.5 4.5 0 0 1 6 4.25V20"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),
    });
  }

  return (
    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        border-t
        border-[#393c40]
        bg-[#171c22]
        px-2
        pb-[max(8px,env(safe-area-inset-bottom))]
        pt-2
        lg:hidden
      "
    >
      <div
        className={`
          mx-auto
          grid
          max-w-[520px]

          ${items.length === 4 ? "grid-cols-4" : "grid-cols-3"}
        `}
      >
        {items.map((item) => {
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
              min-h-[58px]
              flex-col
              items-center
              justify-center
              gap-1
              text-[11px]

              ${isActive ? "text-[#d5af42]" : "text-[#9a9da2]"}
            `}
            >
              <span>{item.icon}</span>

              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
