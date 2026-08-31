import { useTranslation } from "react-i18next";

function DeleteExpenseModal({ expense, onClose, onConfirm, deleting = false }) {
  const { t } = useTranslation();
  if (!expense) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[110]
        flex
        items-center
        justify-center
        bg-black/80
        px-4
        py-6
      "
    >
      <div
        className="
          relative
          w-full
          max-w-[470px]
          rounded-[15px]
          border
          border-[#403a28]
          bg-[#171c22]
          p-6
          shadow-[0_30px_80px_rgba(0,0,0,0.55)]

          sm:p-7

          lg:max-w-[475px]
          lg:p-8
        "
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-5">
          <div>
            <h2 className="text-[22px] font-semibold text-[#f5f0e8]">
              {t("deleteExpense.title")}
            </h2>

            <p className="mt-1 text-[13px] text-[#999ca1]">
              {t("deleteExpense.subtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            aria-label={t("auth.closeDelete")}
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#d5af42]
              text-[#171717]

              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="2.4"
            >
              <path d="M7 7l10 10M17 7 7 17" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Message */}
        <div
          className="
            mt-7
            rounded-[10px]
            border
            border-[#403a28]
            bg-[#0d1117]
            px-4
            py-4
          "
        >
          <p className="text-[14px] leading-6 text-[#d6d2cb]">
            {t("deleteExpense.confirmation")}
          </p>

          <div className="mt-4 border-t border-[#30353b] pt-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] text-[#999ca1]">
                {t("editExpense.supplier")}
              </span>

              <span className="text-right text-[13px] font-medium text-[#f5f0e8]">
                {expense.supplier || "-"}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-[13px] text-[#999ca1]">
                {t("editExpense.amount")}
              </span>

              <span className="text-right text-[13px] font-medium text-[#d5af42]">
                {expense.amount || "-"}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-[13px] text-[#999ca1]">
                {t("expenseList.date")}
              </span>

              <span className="text-right text-[13px] font-medium text-[#f5f0e8]">
                {expense.date || "-"}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-[12px] leading-5 text-[#999ca1]">
          {t("deleteExpense.warning")}
        </p>

        {/* Buttons */}
        <div
          className="
            mt-7
            flex
            flex-col
            gap-3

            lg:flex-row-reverse
          "
        >
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="
              h-[48px]
              min-h-[48px]
              w-full
              shrink-0
              rounded-[8px]
              bg-[#d5af42]
              text-[13px]
              font-semibold
              text-[#111418]

              disabled:cursor-not-allowed
              disabled:opacity-60

              lg:w-auto
              lg:flex-1
            "
          >
            {deleting ? t("deleteExpense.deleting") : t("deleteExpense.delete")}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="
              h-[48px]
              min-h-[48px]
              w-full
              shrink-0
              rounded-[8px]
              border
              border-[#403a28]
              bg-[#0d1117]
              text-[13px]
              font-medium
              text-[#a4a5a8]

              disabled:cursor-not-allowed
              disabled:opacity-60

              lg:w-auto
              lg:flex-1
            "
          >
            {t("common.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteExpenseModal;
