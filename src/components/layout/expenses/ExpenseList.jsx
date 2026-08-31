import { useTranslation } from "react-i18next";

function ExpenseList({
  expenses = [],
  showPagination = true,
  totalExpenses,
  onEdit,
  onDelete,
  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 10,
  onPageChange,
}) {
  const { t } = useTranslation();
  const displayTotal = totalExpenses ?? expenses.length;
  const startItem =
    displayTotal === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endItem = Math.min(currentPage * itemsPerPage, displayTotal);
  const categoryStyles = {
    Fuel: "border-[#5f5330] bg-[#373424] text-[#d5af42]",
    Groceries: "border-[#226c39] bg-[#10371f] text-[#48d36c]",
    Utilities: "border-[#51555b] bg-[#30343a] text-[#b4b6ba]",
    Transport: "border-[#51555b] bg-[#30343a] text-[#b4b6ba]",
    "Food & Dining": "border-[#51555b] bg-[#30343a] text-[#b4b6ba]",
    Shopping: "border-[#51555b] bg-[#30343a] text-[#b4b6ba]",
  };

  const getCategoryStyle = (category) =>
    categoryStyles[category] ?? "border-[#51555b] bg-[#30343a] text-[#b4b6ba]";

  const ReceiptIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="m9.5 12.5 5.8-5.8a3 3 0 0 1 4.2 4.2l-8.3 8.3a5 5 0 0 1-7.1-7.1l8-8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const EditIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px]"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M4 20h4l11-11-4-4L4 16v4Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m13.5 6.5 4 4" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px]"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 7h16" strokeLinecap="round" />
      <path d="M9 4h6l1 3H8l1-3Z" strokeLinejoin="round" />
      <path d="M7 7l1 13h8l1-13" strokeLinejoin="round" />
      <path d="M10 11v5M14 11v5" strokeLinecap="round" />
    </svg>
  );

  return (
    <>
      {/* =========================================
          DESKTOP TABLE
      ========================================== */}
      <div
        className="
          hidden
          overflow-hidden
          rounded-[14px]
          border
          border-[#403a28]
          bg-[#171c22]
          lg:block
        "
      >
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-[#2a2f34]">
            <tr className="h-[52px] text-left text-[11px] font-medium uppercase text-[#a5a7aa]">
              <th className="w-[13%] px-6">{t("expenseList.date")}</th>

              <th className="w-[34%] px-4">{t("expenseList.supplier")}</th>

              <th className="w-[16%] px-4">{t("expenseList.category")}</th>

              <th className="w-[15%] px-4">{t("expenseList.amount")}</th>

              <th className="w-[15%] px-4">{t("expenseList.receipt")}</th>

              <th className="w-[7%] px-4">{t("expenseList.actions")}</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="
                  h-[62px]
                  border-t
                  border-[#403a28]
                  text-[14px]
                "
              >
                <td className="px-6 text-[#9a9da2]">{expense.date}</td>

                <td className="px-4 font-medium text-[#f1eee8]">
                  {expense.supplier}
                </td>

                <td className="px-4">
                  <span
                    className={`
                      inline-flex
                      rounded-[6px]
                      border
                      px-2
                      py-1
                      text-[11px]
                      ${getCategoryStyle(expense.category)}
                    `}
                  >
                    {translateCategory(t, expense.category)}
                  </span>
                </td>

                <td className="px-4 font-medium text-[#f5f1e9]">
                  {expense.amount}
                </td>

                <td className="px-4">
                  {expense.receiptUrl && (
                    <a
                      href={expense.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
        inline-flex
        items-center
        gap-1.5
        text-[13px]
        text-[#d5af42]
        underline
        underline-offset-2
      "
                    >
                      <ReceiptIcon />
                      {t("expenseList.viewReceipt")}
                    </a>
                  )}
                </td>

                <td className="px-4">
                  <div className="flex items-center justify-end gap-3 text-[#d5af42]">
                    <button
                      type="button"
                      onClick={() => onEdit?.(expense)}
                      aria-label={`${t("expenseList.edit")} ${expense.supplier}`}
                    >
                      <EditIcon />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete?.(expense)}
                      aria-label={`${t("expenseList.delete")} ${expense.supplier}`}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showPagination && (
          <div
            className="
              flex
              min-h-[68px]
              items-center
              justify-between
              border-t
              border-[#403a28]
              px-5
            "
          >
            <p className="text-[12px] text-[#8f9297]">
              {t("expenseList.showing", {
                start: startItem,
                end: endItem,
                total: displayTotal,
              })}{" "}
            </p>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>

      {/* =========================================
          MOBILE EXPENSE CARDS
      ========================================== */}
      <div className="space-y-3 lg:hidden">
        {expenses.map((expense) => (
          <article
            key={expense.id}
            className="
              rounded-[12px]
              border
              border-[#403a28]
              bg-[#171c22]
              px-3
              py-3
            "
          >
            {/* Date + category */}
            <div className="flex items-start justify-between gap-3">
              <span className="text-[12px] text-[#85888e]">{expense.date}</span>

              <span
                className={`
                  inline-flex
                  max-w-[135px]
                  rounded-[5px]
                  border
                  px-2
                  py-[3px]
                  text-[10px]
                  leading-tight
                  ${getCategoryStyle(expense.category)}
                `}
              >
                {translateCategory(t, expense.category)}
              </span>
            </div>

            {/* Supplier + amount */}
            <div className="mt-3 flex items-center justify-between gap-4">
              <h3 className="min-w-0 truncate text-[16px] font-semibold text-[#f4f0e9]">
                {expense.supplier}
              </h3>

              <span className="shrink-0 text-[14px] font-medium text-[#d5af42]">
                {expense.amount}
              </span>
            </div>

            {/* Divider */}
            <div className="my-3 h-px bg-[#30353b]" />

            {/* Receipt / actions */}
            <div className="flex items-center justify-between">
              {expense.receiptUrl && (
                <a
                  href={expense.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
      ml-5
      inline-flex
      items-center
      gap-1.5
      text-[13px]
      text-[#d5af42]
      underline
      underline-offset-2
    "
                >
                  <ReceiptIcon />
                  <span>{t("expenseList.viewReceipt")}</span>
                </a>
              )}

              <div className="ml-auto flex items-center gap-3 text-[#d5af42]">
                <button
                  type="button"
                  onClick={() => onEdit?.(expense)}
                  aria-label={`${t("expenseList.edit")} ${expense.supplier}`}
                >
                  <EditIcon />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete?.(expense)}
                  aria-label={`${t("expenseList.delete")} ${expense.supplier}`}
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>
          </article>
        ))}

        {showPagination && (
          <div className="pt-5">
            <p className="text-center text-[12px] text-[#8f9297]">
              {t("expenseList.showing", {
                start: startItem,
                end: endItem,
                total: displayTotal,
              })}
            </p>

            <div className="mt-4 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  const { t } = useTranslation();
  const getVisiblePages = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 2) {
      return [1, 2, 3];
    }

    if (currentPage >= totalPages - 1) {
      return [totalPages - 2, totalPages - 1, totalPages];
    }

    return [currentPage - 1, currentPage, currentPage + 1];
  };

  const visiblePages = getVisiblePages();

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    onPageChange?.(page);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Previous */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-[6px]
          border
          border-[#484337]
          bg-[#282d31]
          text-[#a4a6aa]

          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <span aria-label={t("expenseList.previous")}>‹</span>
      </button>

      {/* Page Numbers */}
      {visiblePages.map((page) => {
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => goToPage(page)}
            className={`
              flex
              h-8
              min-w-8
              items-center
              justify-center
              rounded-[6px]
              border
              px-2
              text-[12px]

              ${
                isActive
                  ? `
                    border-[#5b4d24]
                    bg-[#353226]
                    text-[#d5af42]
                  `
                  : `
                    border-[#3c4146]
                    bg-transparent
                    text-[#979a9f]
                  `
              }
            `}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-[6px]
          border
          border-[#484337]
          bg-[#282d31]
          text-[#a4a6aa]

          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <span aria-label={t("expenseList.next")}>›</span>
      </button>
    </div>
  );
}

function translateCategory(t, category) {
  const keys = {
    Fuel: "categories.fuel",
    Groceries: "categories.groceries",
    Utilities: "categories.utilities",
    Transport: "categories.transport",
    "Food & Dining": "categories.foodDining",
    Meals: "categories.meals",
    Shopping: "categories.shopping",
  };
  return keys[category] ? t(keys[category]) : category;
}

export default ExpenseList;
