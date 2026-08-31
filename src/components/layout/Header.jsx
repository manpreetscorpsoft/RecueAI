import logo from "../../assets/logo.png";
import { useTranslation } from "react-i18next";

function Header({ role = "admin", phone = "+234 812 345 6789" }) {
  const { t } = useTranslation();
  const displayRole = role === "admin" ? t("roles.admin") : t("roles.member");

  return (
    <>
      {/* =========================
          MOBILE HEADER
      ========================== */}
      <header
        className="
          flex
          h-[76px]
          items-center
          justify-between
          border-b
          border-[#3b3525]
          bg-[#0c1016]
          px-4
          lg:hidden
        "
      >
        <img
          src={logo}
          alt="Ivory Nexus Solutions"
          className="w-[110px] object-contain"
        />

        <button
          type="button"
          className="
            flex
            items-center
            gap-1.5
            text-[14px]
            text-[#a4a5a8]
          "
        >
          <span>{t("navigation.logout")}</span>

          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-[18px] w-[18px]"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"
              strokeLinecap="round"
            />

            <path
              d="M14 8l4 4-4 4M8 12h10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </header>

      {/* =========================
          DESKTOP HEADER
      ========================== */}
      <header
        className="
          hidden
          h-[72px]
          w-full
          items-center
          justify-between
          border-b
          border-[#3b3525]
          bg-[#0e1319]
          px-10
          lg:flex
        "
      >
        {/* Greeting */}
        <div>
          <p className="text-[13px] text-[#92959a]">{t("auth.welcomeBack")},</p>

          <h2 className="mt-0.5 text-[16px] font-semibold text-[#f5f0e8]">
            {displayRole}
          </h2>
        </div>

        {/* Phone */}
        <button
          type="button"
          className="
            flex
            h-[40px]
            items-center
            gap-2
            rounded-full
            border
            border-[#3b3525]
            bg-[#171c22]
            px-4
            text-[#f5f0e8]
          "
        >
          {/* WhatsApp Circle */}
          <span
            className="
              flex
              h-6
              w-6
              items-center
              justify-center
              rounded-full
              bg-[#25D366]
              text-white
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 6.5c.6-.6 1.4-.4 1.8.3l1.1 2c.3.6.2 1.1-.2 1.5l-.7.7c.8 1.5 2 2.7 3.5 3.5l.7-.7c.4-.4.9-.5 1.5-.2l2 1.1c.7.4.9 1.2.3 1.8-.8.9-1.9 1.5-3.2 1.5-4.7 0-8.5-3.8-8.5-8.5 0-1.3.6-2.4 1.7-3Z"
              />
            </svg>
          </span>

          <span className="text-[13px] font-medium">{phone}</span>

          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 text-[#8f9297]"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="m8 10 4 4 4-4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </header>
    </>
  );
}

export default Header;
