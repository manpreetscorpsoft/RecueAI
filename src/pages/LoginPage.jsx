import logo from "../assets/logo.png";
import { useTranslation } from "react-i18next";
function LoginPage() {
  const { t } = useTranslation();
  const otpBoxes = ["4", "8", "2", "", "", ""];

  return (
    <main className="min-h-dvh bg-[#0c1016] flex items-center justify-center px-4 py-4 sm:px-6">
      <section
        className="
          w-full
          max-w-[520px]
          rounded-[22px]
          border
          border-[#403820]
          bg-[#171c23]
          px-6
          py-7
          shadow-[0_24px_70px_rgba(0,0,0,0.48)]

          sm:px-10
          sm:py-8

          lg:max-w-[520px]

          [@media(max-height:800px)]:max-w-[470px]
          [@media(max-height:800px)]:px-8
          [@media(max-height:800px)]:py-5
        "
      >
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={logo}
            alt="Ivory Nexus Solutions"
            className="
              w-[140px]
              object-contain

              sm:w-[160px]

              [@media(max-height:800px)]:w-[125px]
            "
          />
        </div>

        {/* Heading */}
        <div
          className="
            mt-4
            text-center

            sm:mt-5

            [@media(max-height:800px)]:mt-3
          "
        >
          <h1
            className="
              text-[26px]
              font-semibold
              leading-tight
              text-[#f5f0e8]

              sm:text-[29px]

              [@media(max-height:800px)]:text-[24px]
            "
          >
            {t("auth.welcomeBack")}
          </h1>

          <p
            className="
              mx-auto
              mt-3
              max-w-[390px]
              text-[14px]
              leading-[21px]
              text-[#9b9da2]

              sm:text-[15px]

              [@media(max-height:800px)]:mt-2
              [@media(max-height:800px)]:text-[13px]
              [@media(max-height:800px)]:leading-[19px]
            "
          >
            {t("auth.loginDescription")}
          </p>
        </div>

        {/* Phone Number */}
        <div
          className="
            mt-7

            [@media(max-height:800px)]:mt-5
          "
        >
          <label
            className="
              mb-2
              block
              text-[12px]
              font-medium
              uppercase
              text-[#a4a5a8]
            "
          >
            {t("auth.phoneLabel")}
          </label>

          <div
            className="
              flex
              h-[54px]
              items-center
              rounded-[8px]
              border
              border-[#292f38]
              bg-[#0d1117]
              px-4

              sm:h-[56px]

              [@media(max-height:800px)]:h-[48px]
            "
          >
            {/* Phone Icon */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 shrink-0 text-[#d5af42]"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5.5C3 4.67 3.67 4 4.5 4H7l2 5-2 1.5c1.3 2.7 3.3 4.7 6 6L14.5 14l5 2v2.5c0 .83-.67 1.5-1.5 1.5C9.72 20 3 13.28 3 5.5Z"
              />
            </svg>

            <div className="mx-3 h-6 w-px bg-[#30353d]" />

            <span className="shrink-0 text-[15px] font-medium text-[#f2f2f2]">
              +225
            </span>

            <input
              type="tel"
              placeholder={t("auth.phonePlaceholder")}
              className="
                ml-3
                min-w-0
                flex-1
                bg-transparent
                text-[15px]
                text-white
                outline-none
                placeholder:text-[#73767c]
              "
            />
          </div>
        </div>

        {/* Send OTP */}
        <button
          type="button"
          className="
            mt-5
            h-[54px]
            w-full
            rounded-[8px]
            bg-[#d5af42]
            text-[14px]
            font-semibold
            text-[#101010]

            sm:h-[56px]

            [@media(max-height:800px)]:mt-4
            [@media(max-height:800px)]:h-[48px]
          "
        >
          {t("auth.sendOtp")}
        </button>

        {/* Divider */}
        <div
          className="
            my-6
            flex
            items-center
            gap-4

            [@media(max-height:800px)]:my-4
          "
        >
          <div className="h-px flex-1 bg-[#2b3037]" />

          <span className="text-[11px] font-medium text-[#aaa]">
            {t("auth.or")}
          </span>

          <div className="h-px flex-1 bg-[#2b3037]" />
        </div>

        {/* OTP Section */}
        <div>
          <label
            className="
              mb-3
              block
              text-[12px]
              font-medium
              uppercase
              text-[#a4a5a8]
            "
          >
            {t("auth.enterOtp")}
          </label>

          <div className="grid grid-cols-6 gap-2.5 sm:gap-3">
            {otpBoxes.map((value, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                defaultValue={value}
                placeholder={index > 3 ? "-" : ""}
                className={`
                  h-[52px]
                  min-w-0
                  rounded-[8px]
                  bg-[#0d1117]
                  text-center
                  text-[20px]
                  font-semibold
                  text-white
                  outline-none
                  placeholder:text-[#4f5359]

                  sm:h-[56px]

                  [@media(max-height:800px)]:h-[46px]

                  ${
                    index === 3
                      ? "border-2 border-[#d5af42]"
                      : "border border-[#292f38]"
                  }
                `}
              />
            ))}
          </div>
        </div>

        {/* Verify Button */}
        <button
          type="button"
          className="
            mt-5
            h-[54px]
            w-full
            rounded-[8px]
            bg-[#d5af42]
            text-[14px]
            font-semibold
            text-[#101010]

            sm:h-[56px]

            [@media(max-height:800px)]:mt-4
            [@media(max-height:800px)]:h-[48px]
          "
        >
          {t("auth.verify")}
        </button>

        {/* Security Message */}
        <div
          className="
            mt-7
            flex
            items-center
            justify-center
            gap-2
            text-[#8c8f94]

            [@media(max-height:800px)]:mt-5
          "
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 shrink-0"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <rect x="5" y="10" width="14" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>

          <span className="text-center text-[12px] sm:text-[13px]">
            {t("auth.secureLogin")}
          </span>
        </div>

        {/* Bottom Divider */}
        <div
          className="
            my-6
            h-px
            bg-[#2b3037]

            [@media(max-height:800px)]:my-4
          "
        />

        {/* Signup */}
        <p className="text-center text-[13px] text-[#96999e] sm:text-[14px]">
          {t("auth.noAccount")}{" "}
          <button type="button" className="font-semibold text-[#d5af42]">
            {t("auth.createAccount")}
          </button>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
