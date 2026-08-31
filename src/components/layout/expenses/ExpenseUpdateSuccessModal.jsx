import { useTranslation } from "react-i18next";

function ExpenseUpdateSuccessModal({ onClose }) {
  const { t } = useTranslation();
  return (
    <div
      className="
        fixed
        inset-0
        z-[120]
        flex
        items-center
        justify-center
        bg-black/80
        px-[22px]
        py-6
      "
    >
      <div
        className="
          w-full
          max-w-[342px]
          rounded-[14px]
          border
          border-[#403a28]
          bg-[#171c22]
          px-6
          py-10
          text-center
          shadow-[0_30px_80px_rgba(0,0,0,0.55)]

          sm:max-w-[400px]
          sm:px-8
          sm:py-9
        "
      >
        {/* Success Icon */}
        <div
          className="
            mx-auto
            flex
            h-[64px]
            w-[64px]
            items-center
            justify-center
            rounded-full
            border-2
            border-[#3fb950]
            text-[#3fb950]

            sm:h-[62px]
            sm:w-[62px]
          "
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-8 w-8"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              d="m6 12 4 4 8-8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Heading */}
        <h2
          className="
            mt-7
            text-[21px]
            font-semibold
            leading-[27px]
            text-[#f5f0e8]

            sm:text-[20px]
          "
        >
          {t("editExpense.successTitle")}
        </h2>

        {/* Description */}
        <p
          className="
            mx-auto
            mt-3
            max-w-[280px]
            text-[14px]
            leading-[20px]
            text-[#999ca1]
          "
        >
          {t("editExpense.successDescription")}
        </p>

        {/* Great Button */}
        <button
          type="button"
          onClick={onClose}
          className="
            mt-7
            h-[46px]
            w-full
            rounded-[7px]
            bg-[#d5af42]
            text-[13px]
            font-semibold
            uppercase
            text-[#111418]
          "
        >
          {t("common.great")}
        </button>
      </div>
    </div>
  );
}

export default ExpenseUpdateSuccessModal;
