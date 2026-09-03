import logo from "../assets/logo.png";
import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Use the same Supabase client used in your other API functions
import { supabase } from "../lib/supabase";

function LoginPage() {
  const { t } = useTranslation();

  // =====================================================
  // LOGIN LOGIC
  // =====================================================

  const navigate = useNavigate();

  const [phone, setPhone] = useState("");

  const [countryCode, setCountryCode] = useState("+225");

  const [otpBoxes, setOtpBoxes] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [focusedOtpIndex, setFocusedOtpIndex] =
    useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const otpRefs = useRef([]);

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
    // Allow numbers only
    const cleanValue = value
      .replace(/\D/g, "")
      .slice(0, 1);

    const updatedOtp = [...otpBoxes];

    updatedOtp[index] = cleanValue;

    setOtpBoxes(updatedOtp);

    // Automatically move to next OTP box
    if (
      cleanValue &&
      index < otpBoxes.length - 1
    ) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // =====================================================
  // OTP BACKSPACE
  // =====================================================

  const handleOtpKeyDown = (index, event) => {
    if (
      event.key === "Backspace" &&
      !otpBoxes[index] &&
      index > 0
    ) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // =====================================================
  // VERIFY LOGIN
  // =====================================================

  const handleVerify = async () => {
    const cleanPhone = phone.replace(/\D/g, "");

    const password = otpBoxes.join("");

    // =====================================================
    // 1. CHECK PHONE
    // =====================================================

    if (!cleanPhone) {
      alert("Please enter your phone number.");
      return;
    }

    // =====================================================
    // 2. CHECK PASSWORD
    // =====================================================

    if (password.length !== 6) {
      alert("Please enter your 6-digit password.");
      return;
    }

    // =====================================================
    // 3. BUILD FULL PHONE NUMBER
    // =====================================================

    const countryDigits =
      countryCode.replace(/\D/g, "");

    const fullPhone =
      cleanPhone.startsWith(countryDigits)
        ? `+${cleanPhone}`
        : `${countryCode}${cleanPhone}`;

    console.log("Full phone:", fullPhone);

    try {
      setIsLoading(true);

      // =====================================================
      // 4. VERIFY USER USING svc_verify_login
      // =====================================================

      const {
        data: verifyData,
        error: verifyError,
      } = await supabase.rpc(
        "svc_verify_login",
        {
          p_phone: fullPhone,
          p_password: password,
        }
      );

      console.log(
        "Verify response:",
        verifyData
      );

      console.log(
        "Verify error:",
        verifyError
      );

      // =====================================================
      // 5. CHECK VERIFICATION ERROR
      // =====================================================

      if (verifyError) {
        console.error(
          "svc_verify_login error:",
          verifyError
        );

        if (
          verifyError.message?.includes(
            "Invalid phone number or password"
          )
        ) {
          alert(
            "Invalid phone number or password."
          );
          return;
        }

        if (
          verifyError.message?.includes(
            "Authentication account is not configured"
          )
        ) {
          alert(
            "Authentication account is not configured."
          );
          return;
        }

        if (
          verifyError.message?.includes(
            "Authentication account not found"
          )
        ) {
          alert(
            "Authentication account not found."
          );
          return;
        }

        if (
          verifyError.message?.includes(
            "Authentication account phone mismatch"
          )
        ) {
          alert(
            "Authentication account phone mismatch."
          );
          return;
        }

        alert(
          verifyError.message ||
            "Unable to verify login."
        );

        return;
      }

      // =====================================================
      // 6. VERIFY SUCCESS RESPONSE
      // =====================================================

      if (
        !verifyData ||
        verifyData.success !== true ||
        verifyData.login_verified !== true
      ) {
        alert(
          "Login verification failed."
        );
        return;
      }

      console.log(
        "User verification successful:",
        verifyData
      );

      // =====================================================
      // 7. CREATE SUPABASE AUTH SESSION
      // THIS GENERATES THE JWT
      // =====================================================

      const {
        data: authData,
        error: authError,
      } =
        await supabase.auth.signInWithPassword(
          {
            phone: fullPhone,
            password: password,
          }
        );

      console.log(
        "Supabase Auth response:",
        authData
      );

      console.log(
        "Supabase Auth error:",
        authError
      );

      // =====================================================
      // 8. CHECK AUTH ERROR
      // =====================================================

      if (authError) {
        console.error(
          "Supabase Auth error:",
          authError
        );

        alert(
          "Authentication failed. Please check your phone number and password."
        );

        return;
      }

      // =====================================================
      // 9. MAKE SURE SESSION EXISTS
      // =====================================================

      if (!authData?.session) {
        console.error(
          "No authentication session returned."
        );

        alert(
          "Authentication session could not be created."
        );

        return;
      }

      // =====================================================
      // 10. JWT
      // =====================================================

      const accessToken =
        authData.session.access_token;

      const refreshToken =
        authData.session.refresh_token;

      console.log(
        "JWT generated:",
        !!accessToken
      );

      console.log(
        "Refresh token generated:",
        !!refreshToken
      );

      // Do NOT log actual JWT in production
      // console.log("JWT:", accessToken);

      // =====================================================
      // 11. CHECK AUTH USER ID MATCH
      // =====================================================

      if (
        verifyData.auth_user_id &&
        authData.user?.id !==
          verifyData.auth_user_id
      ) {
        console.error(
          "Authentication user ID mismatch"
        );

        await supabase.auth.signOut();

        alert(
          "Authentication account mismatch."
        );

        return;
      }

      // =====================================================
      // 12. SAVE USER INFORMATION
      // =====================================================

      localStorage.setItem(
        "user",
        JSON.stringify({
          user_id:
            verifyData.user_id,

          auth_user_id:
            verifyData.auth_user_id,

          phone:
            verifyData.phone,

          language:
            verifyData.language,

          plan_id:
            verifyData.plan_id,

          default_currency:
            verifyData.default_currency,
        })
      );

      // Supabase automatically stores/manages
      // the authentication session and JWT.

      console.log(
        "Login successful:",
        verifyData
      );

      // =====================================================
      // 13. REDIRECT
      // =====================================================

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Unexpected login error:",
        error
      );

      alert(
        "Something went wrong. Please try again."
      );
    } finally {
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
            {t(
              "auth.loginDescription"
            )}
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

            {/* Dynamic Country Code */}

            <select
              value={countryCode}
              onChange={(e) =>
                setCountryCode(
                  e.target.value
                )
              }
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
              {countryCodes.map(
                (country) => (
                  <option
                    key={
                      country.code
                    }
                    value={
                      country.code
                    }
                    className="bg-[#171c23] text-white"
                  >
                    {country.code}
                  </option>
                )
              )}
            </select>

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              placeholder={t(
                "auth.phonePlaceholder"
              )}
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
            {otpBoxes.map(
              (value, index) => (
                <input
                  key={index}

                  ref={(element) => {
                    otpRefs.current[
                      index
                    ] = element;
                  }}

                  type="text"

                  inputMode="numeric"

                  autoComplete="one-time-code"

                  maxLength="1"

                  value={value}

                  onChange={(e) =>
                    handleOtpChange(
                      index,
                      e.target.value
                    )
                  }

                  onKeyDown={(e) =>
                    handleOtpKeyDown(
                      index,
                      e
                    )
                  }

                  onFocus={() =>
                    setFocusedOtpIndex(
                      index
                    )
                  }

                  onBlur={() =>
                    setFocusedOtpIndex(
                      null
                    )
                  }

                  placeholder={
                    index > 3
                      ? "-"
                      : ""
                  }

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
                      focusedOtpIndex ===
                      index
                        ? "border-2 border-[#d5af42]"
                        : "border border-[#292f38]"
                    }
                  `}
                />
              )
            )}
          </div>
        </div>

        {/* Verify Button */}

        <button
          type="button"
          onClick={handleVerify}
          disabled={isLoading}
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
          {isLoading
            ? "Verifying..."
            : t("auth.verify")}
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
            <rect
              x="5"
              y="10"
              width="14"
              height="10"
              rx="2"
            />

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
            className="font-semibold text-[#d5af42]"
          >
            {t(
              "auth.createAccount"
            )}
          </button>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;