import recuai from "../assets/recuai.png";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { formatLoginPhone, requestEmailOtp, verifyEmailOtp } from "../services/authService";
import CreateAccountModal from "../components/auth/CreateAccountModal";
import DashboardContact from "../components/layout/DashboardContact";

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
  const [createAccountMessage, setCreateAccountMessage] = useState("");

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
    setResendSeconds(0);
    setOtpPhone("");
    setOtpBoxes(["", "", "", "", "", ""]);
    setLoginError("");
  };

  // =====================================================
  // COUNTRY CODES
  // =====================================================

  const countryCodes = [
  {
    code: "+93",
    name: "Afghanistan",
  },
  {
    code: "+355",
    name: "Albania",
  },
  {
    code: "+213",
    name: "Algeria",
  },
  {
    code: "+1684",
    name: "American Samoa",
  },
  {
    code: "+376",
    name: "Andorra",
  },
  {
    code: "+244",
    name: "Angola",
  },
  {
    code: "+1264",
    name: "Anguilla",
  },
  {
    code: "+1268",
    name: "Antigua and Barbuda",
  },
  {
    code: "+54",
    name: "Argentina",
  },
  {
    code: "+374",
    name: "Armenia",
  },
  {
    code: "+297",
    name: "Aruba",
  },
  {
    code: "+247",
    name: "Ascension Island",
  },
  {
    code: "+61",
    name: "Australia",
  },
  {
    code: "+43",
    name: "Austria",
  },
  {
    code: "+994",
    name: "Azerbaijan",
  },
  {
    code: "+358",
    name: "Åland Islands",
  },

  {
    code: "+1242",
    name: "Bahamas",
  },
  {
    code: "+973",
    name: "Bahrain",
  },
  {
    code: "+880",
    name: "Bangladesh",
  },
  {
    code: "+1246",
    name: "Barbados",
  },
  {
    code: "+375",
    name: "Belarus",
  },
  {
    code: "+32",
    name: "Belgium",
  },
  {
    code: "+501",
    name: "Belize",
  },
  {
    code: "+229",
    name: "Benin",
  },
  {
    code: "+1441",
    name: "Bermuda",
  },
  {
    code: "+975",
    name: "Bhutan",
  },
  {
    code: "+591",
    name: "Bolivia",
  },
  {
    code: "+599",
    name: "Bonaire, Sint Eustatius and Saba",
  },
  {
    code: "+387",
    name: "Bosnia and Herzegovina",
  },
  {
    code: "+267",
    name: "Botswana",
  },
  {
    code: "+55",
    name: "Brazil",
  },
  {
    code: "+246",
    name: "British Indian Ocean Territory",
  },
  {
    code: "+1284",
    name: "British Virgin Islands",
  },
  {
    code: "+673",
    name: "Brunei",
  },
  {
    code: "+359",
    name: "Bulgaria",
  },
  {
    code: "+226",
    name: "Burkina Faso",
  },
  {
    code: "+257",
    name: "Burundi",
  },

  {
    code: "+238",
    name: "Cabo Verde",
  },
  {
    code: "+855",
    name: "Cambodia",
  },
  {
    code: "+237",
    name: "Cameroon",
  },
  {
    code: "+1",
    name: "Canada",
  },
  {
    code: "+1345",
    name: "Cayman Islands",
  },
  {
    code: "+236",
    name: "Central African Republic",
  },
  {
    code: "+235",
    name: "Chad",
  },
  {
    code: "+56",
    name: "Chile",
  },
  {
    code: "+86",
    name: "China",
  },
  {
    code: "+61",
    name: "Christmas Island",
  },
  {
    code: "+61",
    name: "Cocos (Keeling) Islands",
  },
  {
    code: "+57",
    name: "Colombia",
  },
  {
    code: "+269",
    name: "Comoros",
  },
  {
    code: "+242",
    name: "Republic of the Congo",
  },
  {
    code: "+243",
    name: "Democratic Republic of the Congo",
  },
  {
    code: "+682",
    name: "Cook Islands",
  },
  {
    code: "+506",
    name: "Costa Rica",
  },
  {
    code: "+225",
    name: "Côte d'Ivoire",
  },
  {
    code: "+385",
    name: "Croatia",
  },
  {
    code: "+53",
    name: "Cuba",
  },
  {
    code: "+599",
    name: "Curaçao",
  },
  {
    code: "+357",
    name: "Cyprus",
  },
  {
    code: "+420",
    name: "Czech Republic",
  },

  {
    code: "+45",
    name: "Denmark",
  },
  {
    code: "+253",
    name: "Djibouti",
  },
  {
    code: "+1767",
    name: "Dominica",
  },
  {
    code: "+1809",
    name: "Dominican Republic",
  },
  {
    code: "+1829",
    name: "Dominican Republic",
  },
  {
    code: "+1849",
    name: "Dominican Republic",
  },

  {
    code: "+593",
    name: "Ecuador",
  },
  {
    code: "+20",
    name: "Egypt",
  },
  {
    code: "+503",
    name: "El Salvador",
  },
  {
    code: "+240",
    name: "Equatorial Guinea",
  },
  {
    code: "+291",
    name: "Eritrea",
  },
  {
    code: "+372",
    name: "Estonia",
  },
  {
    code: "+268",
    name: "Eswatini",
  },
  {
    code: "+251",
    name: "Ethiopia",
  },

  {
    code: "+500",
    name: "Falkland Islands",
  },
  {
    code: "+298",
    name: "Faroe Islands",
  },
  {
    code: "+679",
    name: "Fiji",
  },
  {
    code: "+358",
    name: "Finland",
  },
  {
    code: "+33",
    name: "France",
  },
  {
    code: "+594",
    name: "French Guiana",
  },
  {
    code: "+689",
    name: "French Polynesia",
  },

  {
    code: "+241",
    name: "Gabon",
  },
  {
    code: "+220",
    name: "Gambia",
  },
  {
    code: "+995",
    name: "Georgia",
  },
  {
    code: "+49",
    name: "Germany",
  },
  {
    code: "+233",
    name: "Ghana",
  },
  {
    code: "+350",
    name: "Gibraltar",
  },
  {
    code: "+30",
    name: "Greece",
  },
  {
    code: "+299",
    name: "Greenland",
  },
  {
    code: "+1473",
    name: "Grenada",
  },
  {
    code: "+590",
    name: "Guadeloupe",
  },
  {
    code: "+1671",
    name: "Guam",
  },
  {
    code: "+502",
    name: "Guatemala",
  },
  {
    code: "+44",
    name: "Guernsey",
  },
  {
    code: "+224",
    name: "Guinea",
  },
  {
    code: "+245",
    name: "Guinea-Bissau",
  },
  {
    code: "+592",
    name: "Guyana",
  },

  {
    code: "+509",
    name: "Haiti",
  },
  {
    code: "+504",
    name: "Honduras",
  },
  {
    code: "+852",
    name: "Hong Kong",
  },
  {
    code: "+36",
    name: "Hungary",
  },

  {
    code: "+354",
    name: "Iceland",
  },
  {
    code: "+91",
    name: "India",
  },
  {
    code: "+62",
    name: "Indonesia",
  },
  {
    code: "+98",
    name: "Iran",
  },
  {
    code: "+964",
    name: "Iraq",
  },
  {
    code: "+353",
    name: "Ireland",
  },
  {
    code: "+44",
    name: "Isle of Man",
  },
  {
    code: "+972",
    name: "Israel",
  },
  {
    code: "+39",
    name: "Italy",
  },

  {
    code: "+1876",
    name: "Jamaica",
  },
  {
    code: "+1658",
    name: "Jamaica",
  },
  {
    code: "+81",
    name: "Japan",
  },
  {
    code: "+44",
    name: "Jersey",
  },
  {
    code: "+962",
    name: "Jordan",
  },

  {
    code: "+7",
    name: "Kazakhstan",
  },
  {
    code: "+254",
    name: "Kenya",
  },
  {
    code: "+686",
    name: "Kiribati",
  },
  {
    code: "+383",
    name: "Kosovo",
  },
  {
    code: "+965",
    name: "Kuwait",
  },
  {
    code: "+996",
    name: "Kyrgyzstan",
  },

  {
    code: "+856",
    name: "Laos",
  },
  {
    code: "+371",
    name: "Latvia",
  },
  {
    code: "+961",
    name: "Lebanon",
  },
  {
    code: "+266",
    name: "Lesotho",
  },
  {
    code: "+231",
    name: "Liberia",
  },
  {
    code: "+218",
    name: "Libya",
  },
  {
    code: "+423",
    name: "Liechtenstein",
  },
  {
    code: "+370",
    name: "Lithuania",
  },
  {
    code: "+352",
    name: "Luxembourg",
  },

  {
    code: "+853",
    name: "Macau",
  },
  {
    code: "+261",
    name: "Madagascar",
  },
  {
    code: "+265",
    name: "Malawi",
  },
  {
    code: "+60",
    name: "Malaysia",
  },
  {
    code: "+960",
    name: "Maldives",
  },
  {
    code: "+223",
    name: "Mali",
  },
  {
    code: "+356",
    name: "Malta",
  },
  {
    code: "+692",
    name: "Marshall Islands",
  },
  {
    code: "+596",
    name: "Martinique",
  },
  {
    code: "+222",
    name: "Mauritania",
  },
  {
    code: "+230",
    name: "Mauritius",
  },
  {
    code: "+262",
    name: "Mayotte",
  },
  {
    code: "+52",
    name: "Mexico",
  },
  {
    code: "+691",
    name: "Micronesia",
  },
  {
    code: "+373",
    name: "Moldova",
  },
  {
    code: "+377",
    name: "Monaco",
  },
  {
    code: "+976",
    name: "Mongolia",
  },
  {
    code: "+382",
    name: "Montenegro",
  },
  {
    code: "+1664",
    name: "Montserrat",
  },
  {
    code: "+212",
    name: "Morocco",
  },
  {
    code: "+258",
    name: "Mozambique",
  },
  {
    code: "+95",
    name: "Myanmar",
  },

  {
    code: "+264",
    name: "Namibia",
  },
  {
    code: "+674",
    name: "Nauru",
  },
  {
    code: "+977",
    name: "Nepal",
  },
  {
    code: "+31",
    name: "Netherlands",
  },
  {
    code: "+687",
    name: "New Caledonia",
  },
  {
    code: "+64",
    name: "New Zealand",
  },
  {
    code: "+505",
    name: "Nicaragua",
  },
  {
    code: "+227",
    name: "Niger",
  },
  {
    code: "+234",
    name: "Nigeria",
  },
  {
    code: "+683",
    name: "Niue",
  },
  {
    code: "+850",
    name: "North Korea",
  },
  {
    code: "+389",
    name: "North Macedonia",
  },
  {
    code: "+1670",
    name: "Northern Mariana Islands",
  },
  {
    code: "+47",
    name: "Norway",
  },
  {
    code: "+672",
    name: "Norfolk Island",
  },

  {
    code: "+968",
    name: "Oman",
  },

  {
    code: "+92",
    name: "Pakistan",
  },
  {
    code: "+680",
    name: "Palau",
  },
  {
    code: "+970",
    name: "Palestine",
  },
  {
    code: "+507",
    name: "Panama",
  },
  {
    code: "+675",
    name: "Papua New Guinea",
  },
  {
    code: "+595",
    name: "Paraguay",
  },
  {
    code: "+51",
    name: "Peru",
  },
  {
    code: "+63",
    name: "Philippines",
  },
  {
    code: "+48",
    name: "Poland",
  },
  {
    code: "+351",
    name: "Portugal",
  },
  {
    code: "+1787",
    name: "Puerto Rico",
  },
  {
    code: "+1939",
    name: "Puerto Rico",
  },

  {
    code: "+974",
    name: "Qatar",
  },

  {
    code: "+262",
    name: "Réunion",
  },
  {
    code: "+40",
    name: "Romania",
  },
  {
    code: "+7",
    name: "Russia",
  },
  {
    code: "+250",
    name: "Rwanda",
  },

  {
    code: "+590",
    name: "Saint Barthélemy",
  },
  {
    code: "+290",
    name: "Saint Helena",
  },
  {
    code: "+1869",
    name: "Saint Kitts and Nevis",
  },
  {
    code: "+1758",
    name: "Saint Lucia",
  },
  {
    code: "+590",
    name: "Saint Martin",
  },
  {
    code: "+508",
    name: "Saint Pierre and Miquelon",
  },
  {
    code: "+1784",
    name: "Saint Vincent and the Grenadines",
  },
  {
    code: "+685",
    name: "Samoa",
  },
  {
    code: "+378",
    name: "San Marino",
  },
  {
    code: "+239",
    name: "São Tomé and Príncipe",
  },
  {
    code: "+966",
    name: "Saudi Arabia",
  },
  {
    code: "+221",
    name: "Senegal",
  },
  {
    code: "+381",
    name: "Serbia",
  },
  {
    code: "+248",
    name: "Seychelles",
  },
  {
    code: "+232",
    name: "Sierra Leone",
  },
  {
    code: "+65",
    name: "Singapore",
  },
  {
    code: "+1721",
    name: "Sint Maarten",
  },
  {
    code: "+421",
    name: "Slovakia",
  },
  {
    code: "+386",
    name: "Slovenia",
  },
  {
    code: "+677",
    name: "Solomon Islands",
  },
  {
    code: "+252",
    name: "Somalia",
  },
  {
    code: "+27",
    name: "South Africa",
  },
  {
    code: "+82",
    name: "South Korea",
  },
  {
    code: "+211",
    name: "South Sudan",
  },
  {
    code: "+34",
    name: "Spain",
  },
  {
    code: "+94",
    name: "Sri Lanka",
  },
  {
    code: "+249",
    name: "Sudan",
  },
  {
    code: "+597",
    name: "Suriname",
  },
  {
    code: "+46",
    name: "Sweden",
  },
  {
    code: "+41",
    name: "Switzerland",
  },
  {
    code: "+963",
    name: "Syria",
  },

  {
    code: "+886",
    name: "Taiwan",
  },
  {
    code: "+992",
    name: "Tajikistan",
  },
  {
    code: "+255",
    name: "Tanzania",
  },
  {
    code: "+66",
    name: "Thailand",
  },
  {
    code: "+670",
    name: "Timor-Leste",
  },
  {
    code: "+228",
    name: "Togo",
  },
  {
    code: "+690",
    name: "Tokelau",
  },
  {
    code: "+676",
    name: "Tonga",
  },
  {
    code: "+1868",
    name: "Trinidad and Tobago",
  },
  {
    code: "+290",
    name: "Tristan da Cunha",
  },
  {
    code: "+216",
    name: "Tunisia",
  },
  {
    code: "+90",
    name: "Turkey",
  },
  {
    code: "+993",
    name: "Turkmenistan",
  },
  {
    code: "+1649",
    name: "Turks and Caicos Islands",
  },
  {
    code: "+688",
    name: "Tuvalu",
  },

  {
    code: "+256",
    name: "Uganda",
  },
  {
    code: "+380",
    name: "Ukraine",
  },
  {
    code: "+971",
    name: "United Arab Emirates",
  },
  {
    code: "+44",
    name: "United Kingdom",
  },
  {
    code: "+1",
    name: "United States",
  },
  {
    code: "+1340",
    name: "U.S. Virgin Islands",
  },
  {
    code: "+598",
    name: "Uruguay",
  },
  {
    code: "+998",
    name: "Uzbekistan",
  },

  {
    code: "+678",
    name: "Vanuatu",
  },
  {
    code: "+39",
    name: "Vatican City",
  },
  {
    code: "+58",
    name: "Venezuela",
  },
  {
    code: "+84",
    name: "Vietnam",
  },

  {
    code: "+681",
    name: "Wallis and Futuna",
  },
  {
    code: "+212",
    name: "Western Sahara",
  },

  {
    code: "+967",
    name: "Yemen",
  },

  {
    code: "+260",
    name: "Zambia",
  },
  {
    code: "+263",
    name: "Zimbabwe",
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
      if (error.message === "auth.accountNotRegistered") {
        resetOtp();
        setResendSeconds(0);
        setCreateAccountMessage("auth.accountNotRegistered");
        setIsCreateAccountOpen(true);
      } else {
        setLoginError(error.message?.startsWith("auth.") ? error.message : "auth.sendOtpError");
      }
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
          px-8
          py-7
          shadow-[0_24px_70px_rgba(0,0,0,0.48)]
          
          sm:px-10
          sm:py-8

          lg:max-w-[520px]

          [@media(max-height:800px)]:max-w-[470px]
          sm:[@media(max-height:800px)]:px-6
          [@media(max-height:800px)]:py-5
        "
      >
        {/* Logo */}

        <div className="flex min-w-0 flex-wrap items-center gap-2 justify-center sm:gap-3">
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

            {/* <select
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
            </select> */}

<select
  value={countryCode}
  disabled={isLoading}
  aria-label={t("auth.countryCode")}
  onChange={(e) => {
    setCountryCode(e.target.value);
    resetOtp();
  }}
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
      key={`${country.name}-${country.code}`}
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

          <div className="grid grid-cols-6 gap-1.5 min-[375px]:gap-2.5 sm:gap-3">
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
            onClick={() => { setCreateAccountMessage(""); setIsCreateAccountOpen(true); }}
            className="font-semibold text-[#d5af42]"
          >
            {t("auth.createAccount")}
          </button>
        </p>
        <a
          href="http://ivnexus.com/"
          className="mt-4 flex min-h-11 items-center justify-center rounded text-[13px] text-[#d5af42] transition-colors hover:text-[#f5f0e8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d5af42] sm:text-[14px]"
        >
          {t("dashboard.backToHomepage")}
        </a>
        <div className="mt-4">
          <DashboardContact showHomeLink={false} />
        </div>
      </section>

      {isCreateAccountOpen && (
        <CreateAccountModal
          message={createAccountMessage ? t(createAccountMessage) : ""}
          onClose={() => setIsCreateAccountOpen(false)}
          onEnglish={() => openWhatsAppGroup("en")}
          onFrench={() => openWhatsAppGroup("fr")}
        />
      )}
    </main>
  );
}

export default LoginPage;
