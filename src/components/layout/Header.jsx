import recuai from "../../assets/recuai.png";
import { useTranslation } from "react-i18next";

function Header({
  role = "admin",
  phone = "+234 812 345 6789",
  onLogout,
}) {
  const { t } = useTranslation();

  const displayRole =
    role === "admin"
      ? t("roles.admin")
      : t("roles.member");

  return (
    <>
      {/* =========================
          MOBILE HEADER
      ========================== */}
      <header
        className="
          flex
          h-[72px]
          w-full
          items-center
          justify-between
          border-b
          border-[#3b3525]
          bg-[#0c1016]
          px-4
          sm:px-5
          lg:hidden
        "
      >
        {/* Logo and wordmark */}
        <div className="flex min-w-0 shrink-0 items-center gap-2">
          <img
            src={recuai}
            alt="Ivory Nexus Solutions"
            className="
              h-[42px]
              w-auto
              max-w-[100px]
              shrink-0
              object-contain

              sm:h-[46px]
              sm:max-w-[110px]
            "
          />

          <span className="shrink-0 text-[20px] font-semibold text-[#d4ad3f] sm:text-[22px]">
            RecuAi
          </span>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="
            ml-3
            flex
            shrink-0
            items-center
            gap-1.5
            text-[13px]
            text-[#a4a5a8]

            sm:text-[14px]
          "
        >
          <span>{t("navigation.logout")}</span>

          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-[18px] w-[18px] shrink-0"
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
          min-w-0
          items-center
          justify-between
          border-b
          border-[#3b3525]
          bg-[#0e1319]
          px-6
          lg:flex
          xl:px-10
        "
      >
        {/* Greeting */}
        <div className="min-w-0">
          <p className="text-[13px] text-[#92959a]">
            {t("auth.welcomeBack")},
          </p>

          <h2
            className="
              mt-0.5
              truncate
              text-[16px]
              font-semibold
              text-[#f5f0e8]
            "
          >
            {displayRole}
          </h2>
        </div>

        {/* Phone */}
        <button
          type="button"
          className="
            ml-4
            flex
            h-[40px]
            max-w-full
            shrink-0
            items-center
            gap-2
            rounded-full
            border
            border-[#3b3525]
            bg-[#171c22]
            px-3
            text-[#f5f0e8]

            xl:px-4
          "
        >
          {/* WhatsApp Circle */}
          <span
            className="
              flex
              h-6
              w-6
              shrink-0
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

          <span
            className="
              max-w-[150px]
              truncate
              text-[12px]
              font-medium

              xl:max-w-none
              xl:text-[13px]
            "
          >
            {phone}
          </span>

          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="
              hidden
              h-4
              w-4
              shrink-0
              text-[#8f9297]

              xl:block
            "
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
