import recuai from "../assets/recuai.png";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { formatLoginPhone, requestEmailOtp, verifyEmailOtp } from "../services/authService";
import CreateAccountModal from "../components/auth/CreateAccountModal";

function LoginPage() {
  const { t } = useTranslation();

  // =====================================================
  // LOGIN LOGIC
  // =====================================================

  const navigate = useNavigate();
  const location = useLocation();

  const [phone, setPhone] = useState("");

  const [countryCode, setCountryCode] = useState("+225");

  const [otpBoxes, setOtpBoxes] = useState(["", "", "", "", "", ""]);

  const [focusedOtpIndex, setFocusedOtpIndex] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);

  const otpRefs = useRef([]);
  const busyRef = useRef(false);
  const [otpPhone, setOtpPhone] = useState("");
  const [loginError, setLoginError] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);

  useEffect(() => {
    if (!resendSeconds) return;
    const timer = setTimeout(() => setResendSeconds((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => clearTimeout(timer);
  }, [resendSeconds]);

  useEffect(() => {
    if (otpPhone) otpRefs.current[0]?.focus();
  }, [otpPhone]);

  const resetOtp = () => {
    setOtpPhone("");
    setOtpBoxes(["", "", "", "", "", ""]);
    setLoginError("");
  };

  // =====================================================
  // COUNTRY CODES
  // =====================================================

  const countryCodes = [
    {
      code: "+225",
      name: "Côte d'Ivoire",
    },
    {
      code: "+91",
      name: "India",
    },
    {
      code: "+33",
      name: "France",
    },
    {
      code: "+221",
      name: "Senegal",
    },
    {
      code: "+237",
      name: "Cameroon",
    },
    {
      code: "+229",
      name: "Benin",
    },
    {
      code: "+226",
      name: "Burkina Faso",
    },
    {
      code: "+223",
      name: "Mali",
    },
    {
      code: "+228",
      name: "Togo",
    },
    {
      code: "+224",
      name: "Guinea",
    },
    {
      code: "+234",
      name: "Nigeria",
    },
    {
      code: "+233",
      name: "Ghana",
    },
    {
      code: "+242",
      name: "Congo",
    },
    {
      code: "+243",
      name: "DR Congo",
    },
    {
      code: "+212",
      name: "Morocco",
    },
    {
      code: "+213",
      name: "Algeria",
    },
    {
      code: "+216",
      name: "Tunisia",
    },
    {
      code: "+1",
      name: "USA / Canada",
    },
    {
      code: "+44",
      name: "United Kingdom",
    },
  ];

  // =====================================================
  // OTP CHANGE
  // =====================================================

  const handleOtpChange = (index, value) => {
    const digits = value.replace(/\D/g, "").slice(0, 6);
    const start = digits.length === 6 ? 0 : index;
    const updated = [...otpBoxes];
    if (!digits) updated[index] = "";
    [...digits].forEach((digit, offset) => {
      if (start + offset < 6) updated[start + offset] = digit;
    });
    setOtpBoxes(updated);
    setLoginError("");
    if (digits) otpRefs.current[Math.min(start + digits.length, 5)]?.focus();
  };

  // =====================================================
  // OTP BACKSPACE
  // =====================================================

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otpBoxes[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const openWhatsAppGroup = (language) => {
    const joinCode = language === "fr" ? "JOINFR" : "JOINEN";
    const whatsappUrl = "https://wa.me/2250711097879?text=" + joinCode;

    setIsCreateAccountOpen(false);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // =====================================================
  // VERIFY LOGIN
  // =====================================================

  const handleRequestOtp = async () => {
    if (busyRef.current || resendSeconds > 0) return;
    busyRef.current = true;
    setIsLoading(true);
    setLoginError("");
    try {
      const fullPhone = formatLoginPhone(phone, countryCode);
      await requestEmailOtp(fullPhone);
      setOtpBoxes(["", "", "", "", "", ""]);
      setOtpPhone(fullPhone);
      setResendSeconds(60);
      otpRefs.current[0]?.focus();
    } catch (error) {
      setLoginError(error.message?.startsWith("auth.") ? error.message : "auth.sendOtpError");
    } finally {
      busyRef.current = false;
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (busyRef.current || !otpPhone) return;
    const otp = otpBoxes.join("");
    if (!/^\d{6}$/.test(otp)) {
      setLoginError("auth.invalidOtp");
      return;
    }
    busyRef.current = true;
    setIsLoading(true);
    setLoginError("");
    try {
      const user = await verifyEmailOtp(otpPhone, otp);
      localStorage.setItem("user", JSON.stringify(user));
      const returnTo = location.state?.returnTo;
      const destination = typeof returnTo === "string" && returnTo.startsWith("/") &&
        !returnTo.startsWith("//") && !returnTo.includes("\\")
        ? returnTo : "/dashboard";
      navigate(destination, { replace: true });
    } catch (error) {
      setLoginError(error.message?.startsWith("auth.") ? error.message : "auth.verifyOtpError");
    } finally {
      busyRef.current = false;
      setIsLoading(false);
    }
  };

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

        <div className="flex flex items-center gap-3 justify-center">
          <img
            src={recuai}
            alt="Ivory Nexus Solutions"
            className="
              w-[140px]
              object-contain

              sm:w-[160px]

              [@media(max-height:800px)]:w-[125px]
            "
          />

          <span className="text-[32px] font-semibold text-[#d4ad3f]">
            RecuAi
          </span>
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

        <form onSubmit={(event) => {
          event.preventDefault();
          if (otpPhone) void handleVerify();
          else void handleRequestOtp();
        }}>
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

            {/* Dynamic Country Code */}

            <select
              value={countryCode}
              disabled={isLoading}
              aria-label={t("auth.countryCode")}
              onChange={(e) => { setCountryCode(e.target.value); resetOtp(); }}
              className="
                shrink-0
                cursor-pointer
                bg-transparent
                text-[15px]
                font-medium
                text-[#f2f2f2]
                outline-none
              "
            >
              {countryCodes.map((country) => (
                <option
                  key={country.code}
                  value={country.code}
                  className="bg-[#171c23] text-white"
                >
                  {country.code}
                </option>
              ))}
            </select>

            <input
              type="tel"
              value={phone}
              disabled={isLoading}
              autoComplete="tel-national"
              aria-label={t("auth.phoneLabel")}
              onChange={(e) => { setPhone(e.target.value); resetOtp(); }}
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

        {loginError && <p role="alert" className="mt-4 text-sm text-red-400">{t(loginError)}</p>}
        {/* Send OTP */}

        <button
          type={otpPhone ? "button" : "submit"}
          onClick={otpPhone ? handleRequestOtp : undefined}
          disabled={isLoading || resendSeconds > 0}
          className="
            mt-5
            h-[54px]
            w-full
            rounded-[8px]
            bg-[#d5af42]
            disabled:cursor-not-allowed
            disabled:opacity-50
            text-[14px]
            font-semibold
            text-[#101010]

            sm:h-[56px]

            [@media(max-height:800px)]:mt-4
            [@media(max-height:800px)]:h-[48px]
          "
        >
          {resendSeconds > 0 ? t("auth.resendCountdown", { seconds: resendSeconds })
            : isLoading && !otpPhone ? t("auth.sendingOtp")
            : t(otpPhone ? "auth.resendOtp" : "auth.sendOtp")}
        </button>

        {otpPhone && (
          <>
            <p role="status" className="my-4 text-sm text-[#b0b3b8]">{t("auth.otpSentEmail")}</p>
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
                ref={(element) => {
                  otpRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                disabled={isLoading}
                aria-label={t("auth.otpDigit", { digit: index + 1 })}
                onPaste={(event) => {
                  event.preventDefault();
                  handleOtpChange(index, event.clipboardData.getData("text"));
                }}
                value={value}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                onFocus={() => setFocusedOtpIndex(index)}
                onBlur={() => setFocusedOtpIndex(null)}
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
                      focusedOtpIndex === index
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
          type="submit"
          disabled={isLoading || otpBoxes.some((digit) => !digit)}
          className="
            mt-5
            h-[54px]
            w-full
            rounded-[8px]
            bg-[#d5af42]
            disabled:cursor-not-allowed
            disabled:opacity-50
            text-[14px]
            font-semibold
            text-[#101010]

            sm:h-[56px]

            [@media(max-height:800px)]:mt-4
            [@media(max-height:800px)]:h-[48px]
          "
        >
          {isLoading ? t("auth.verifyingOtp") : t("auth.verify")}
        </button>

          </>
        )}
        </form>

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
          <button
            type="button"
            onClick={() => setIsCreateAccountOpen(true)}
            className="font-semibold text-[#d5af42]"
          >
            {t("auth.createAccount")}
          </button>
        </p>
      </section>

      {isCreateAccountOpen && (
        <CreateAccountModal
          onClose={() => setIsCreateAccountOpen(false)}
          onEnglish={() => openWhatsAppGroup("en")}
          onFrench={() => openWhatsAppGroup("fr")}
        />
      )}
    </main>
  );
}

export default LoginPage;
