import { useTranslation } from "react-i18next";
import { translateExpenseCategory } from "../../../data/expenseCategories";

function ExpenseList({
  expenses = [],
  loading = false,
  showPagination = true,
  totalExpenses,
  onEdit,
  onDelete,

  // =========================================================
  // BULK DELETE
  // =========================================================
  bulkDeleteMode = false,
  selectedExpenseIds = [],
  onToggleExpenseSelection,

  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 10,
  onPageChange,
}) {
  const { t } = useTranslation();

  const displayTotal = totalExpenses ?? expenses.length;

  const startItem =
    displayTotal === 0 || expenses.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endItem = startItem === 0 ? 0 : Math.min(startItem + expenses.length - 1, displayTotal);

  /* =========================================================
     CATEGORY STYLES
  ========================================================= */

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

  /* =========================================================
     ICONS
  ========================================================= */

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
    <div className="relative" aria-busy={loading}>
      {loading && (
        <>
          <div className="absolute inset-x-0 top-0 z-10 h-0.5 animate-pulse rounded-full bg-[#d5af42]" />
          <span role="status" className="sr-only">{t("expenses.loading")}</span>
        </>
      )}
      <div inert={loading} className={loading ? "opacity-70 transition-opacity" : "transition-opacity"}>
      {/* =========================================
          DESKTOP TABLE
      ========================================== */}

      <div
        className="
          hidden
          lg:block
          overflow-hidden
          rounded-[14px]
          border
          border-[#403a28]
          bg-[#171c22]
          
          
        "
      >
        <table className="w-full table-fixed border-collapse">
          {/* =========================
              TABLE HEADING
          ========================== */}

          <thead className="bg-[#2a2f34]">
            <tr
              className="
                h-[52px]
                text-left
                text-[11px]
                font-medium
                uppercase
                text-[#a5a7aa]
              "
            >
              {/* Submission Date */}
              <th className="w-[15%] px-5">
                {t("expenseList.submissionDate")}
              </th>

              {/* Purchase Date */}
              <th className="w-[11%] px-4">{t("expenseList.date")}</th>

              {/* Supplier */}
              <th className="w-[22%] px-4">{t("expenseList.supplier")}</th>

              {/* Category */}
              <th className="w-[16%] px-4">{t("expenseList.category")}</th>

              {/* Amount */}
              <th className="w-[13%] px-4">{t("expenseList.amount")}</th>

              {/* Receipt */}
              <th className="w-[14%] px-4">{t("expenseList.receipt")}</th>

              {/* Actions */}
              <th className="w-[9%] px-4 text-right">
                {t("expenseList.actions")}
              </th>
            </tr>
          </thead>

          {/* =========================
              TABLE DATA
          ========================== */}

          <tbody>
            {expenses.map((expense) => {
              const isSelected = selectedExpenseIds.includes(expense.id);

              return (
                <tr
                  key={expense.id}
                  className={`
                    h-[62px]
                    border-t
                    border-[#403a28]
                    text-[14px]

                    ${isSelected ? "bg-[#25261f]" : ""}
                  `}
                >
                  {/* Submission Date */}
                  <td className="px-5 text-[#9a9da2]">
                    {expense.submissionDate || "-"}
                  </td>

                  {/* Purchase Date */}
                  <td className="px-4 text-[#9a9da2]">{expense.date || "-"}</td>

                  {/* Supplier */}
                  <td
                    className="
                      overflow-hidden
                      px-4
                      font-medium
                      text-[#f1eee8]
                    "
                  >
                    <div className="truncate">{expense.supplier || "-"}</div>
                  </td>

                  {/* Category */}
                  <td className="px-4">
                    <span
                      className={`
                        inline-flex
                        max-w-full
                        rounded-[6px]
                        border
                        px-1 sm:px-2
                        py-1
                        text-[11px]
                        leading-tight

                        ${getCategoryStyle(expense.category)}
                      `}
                    >
                      <span className="truncate">
                        {translateExpenseCategory(t, expense.category)}
                      </span>
                    </span>
                  </td>

                  {/* Amount */}
                  <td
                    className="
                      px-4
                      font-medium
                      text-[#f5f1e9]
                    "
                  >
                    {expense.amount || "-"}
                  </td>

                  {/* Receipt */}
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

                        <span>{t("expenseList.viewReceipt")}</span>
                      </a>
                    )}
                  </td>

                  {/* =================================================
                      ACTIONS
                  ================================================== */}

                  <td className="px-4">
                    <div
                      className="
                        flex
                        items-center
                        justify-end
                        gap-3
                      "
                    >
                      {/* BULK DELETE CHECKBOX */}
                      {bulkDeleteMode && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            onToggleExpenseSelection?.(expense.id)
                          }
                          aria-label={`Select ${expense.supplier}`}
                          className="
                            h-4
                            w-4
                            shrink-0
                            cursor-pointer
                            accent-[#d5af42]
                          "
                        />
                      )}

                      {/* EXISTING ACTIONS */}
                      <div
                        className="
                          flex
                          items-center
                          gap-3
                          text-[#d5af42]
                        "
                      >
                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => onEdit?.(expense)}
                          aria-label={`${t("expenseList.edit")} ${
                            expense.supplier
                          }`}
                        >
                          <EditIcon />
                        </button>

                        {/* Single Delete */}
                        <button
                          type="button"
                          onClick={() => onDelete?.(expense)}
                          aria-label={`${t("expenseList.delete")} ${
                            expense.supplier
                          }`}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* =========================================
            DESKTOP PAGINATION
        ========================================== */}

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
              })}
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
        {expenses.map((expense) => {
          const isSelected = selectedExpenseIds.includes(expense.id);

          return (
            <article
              key={expense.id}
              className={`
                rounded-[12px]
                border
                border-[#403a28]
                px-3
                py-3

                ${isSelected ? "bg-[#25261f]" : "bg-[#171c22]"}
              `}
            >
              {/* =========================
                  BULK DELETE CHECKBOX
              ========================== */}

              {bulkDeleteMode && (
                <div className="mb-3 flex justify-end">
                  <label
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-2
                      text-[11px]
                      text-[#a5a7aa]
                    "
                  >
                    <span>Select</span>

                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleExpenseSelection?.(expense.id)}
                      className="
                        h-4
                        w-4
                        cursor-pointer
                        accent-[#d5af42]
                      "
                    />
                  </label>
                </div>
              )}

              {/* =========================
                  PURCHASE DATE + CATEGORY
              ========================== */}

              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-3
                "
              >
                <div>
                  <span
                    className="
                      block
                      text-[10px]
                      text-[#6f7378]
                    "
                  >
                    {t("expenseList.date")}
                  </span>

                  <span
                    className="
                      mt-0.5
                      block
                      text-[12px]
                      text-[#85888e]
                    "
                  >
                    {expense.date || "-"}
                  </span>
                </div>

                <span
                  className={`
                    inline-flex
                    max-w-[145px]
                    rounded-[5px]
                    border
                    px-1 sm:px-2
                    py-[3px]
                    text-[10px]
                    leading-tight

                    ${getCategoryStyle(expense.category)}
                  `}
                >
                  {translateExpenseCategory(t, expense.category)}
                </span>
              </div>

              {/* =========================
                  SUPPLIER + AMOUNT
              ========================== */}

              <div
                className="
                  mt-3
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >
                <h3
                  className="
                    min-w-0
                    truncate
                    text-[16px]
                    font-semibold
                    text-[#f4f0e9]
                  "
                >
                  {expense.supplier || "-"}
                </h3>

                <span
                  className="
                    shrink-0
                    text-[14px]
                    font-medium
                    text-[#d5af42]
                  "
                >
                  {expense.amount || "-"}
                </span>
              </div>

              {/* =========================
                  SUBMISSION DATE
              ========================== */}

              <div className="mt-3">
                <span
                  className="
                    block
                    text-[10px]
                    uppercase
                    tracking-wide
                    text-[#6f7378]
                  "
                >
                  {t("expenseList.submissionDate", {
                    defaultValue: "Submission Date",
                  })}
                </span>

                <span
                  className="
                    mt-1
                    block
                    text-[12px]
                    text-[#9a9da2]
                  "
                >
                  {expense.submissionDate || "-"}
                </span>
              </div>

              {/* Divider */}
              <div className="my-3 h-px bg-[#30353b]" />

              {/* =========================
                  RECEIPT / ACTIONS
              ========================== */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >
                {expense.receiptUrl ? (
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

                    <span>{t("expenseList.viewReceipt")}</span>
                  </a>
                ) : (
                  <span />
                )}

                {/* EXISTING ACTIONS */}
                <div
                  className="
                    ml-auto
                    flex
                    items-center
                    gap-3
                    text-[#d5af42]
                  "
                >
                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => onEdit?.(expense)}
                    aria-label={`${t("expenseList.edit")} ${expense.supplier}`}
                  >
                    <EditIcon />
                  </button>

                  {/* Single Delete */}
                  <button
                    type="button"
                    onClick={() => onDelete?.(expense)}
                    aria-label={`${t("expenseList.delete")} ${
                      expense.supplier
                    }`}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {/* =========================================
            MOBILE PAGINATION
        ========================================== */}

        {showPagination && (
          <div className="pt-5">
            <p
              className="
                text-center
                text-[12px]
                text-[#8f9297]
              "
            >
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
      </div>
    </div>
  );
}

/* =========================================================
   PAGINATION
========================================================= */

function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  const { t } = useTranslation();

  const pages = totalPages <= 5
    ? Array.from({ length: totalPages }, (_, index) => index + 1)
    : [...new Set([1, 2, currentPage, currentPage + 1, totalPages - 1, totalPages])]
        .filter((page) => page >= 1 && page <= totalPages)
        .sort((a, b) => a - b);
  const visiblePages = [];
  pages.forEach((page, index) => {
    if (index > 0 && page - pages[index - 1] > 1) {
      visiblePages.push(`gap-${page}`);
    }
    visiblePages.push(page);
  });

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    onPageChange?.(page);
  };

  return (
    <div className="flex max-w-full items-center gap-1 sm:gap-2">
      {/* Previous */}

      <button
        type="button"
        disabled={currentPage <= 1}
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
        <span aria-label={t("expenseList.previous")}>&#8249;</span>
      </button>

      {/* Page Numbers */}

      {visiblePages.map((page) => {
        if (typeof page === "string") {
          return <span key={page} className="flex h-8 w-5 shrink-0 items-center justify-center text-[#979a9f]" aria-hidden="true">...</span>;
        }
        const isActive = page === currentPage;
        const isNextPage = page === currentPage + 1;

        return (
          <button
            key={page}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => goToPage(page)}
            className={`
                flex
                h-8
                min-w-7 sm:min-w-8
                items-center
                justify-center
                rounded-[6px]
                border
                px-1 sm:px-2
                text-[12px]
                transition-colors
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-[#d5af42]

                ${
                  isActive
                    ? `
                      border-[#5b4d24]
                      bg-[#353226]
                      text-[#d5af42]
                    `
                    : isNextPage
                      ? `
                        border-[#3c4146]
                        bg-[#22272c]
                        text-[#92969d]
                        hover:border-[#5b4d24]
                        hover:text-[#d5af42]
                      `
                      : `
                        border-[#3c4146]
                        bg-transparent
                        text-[#b0b3b8]
                        hover:border-[#5b4d24]
                        hover:text-[#d5af42]
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
        disabled={currentPage >= totalPages}
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
        <span aria-label={t("expenseList.next")}>&#8250;</span>
      </button>
    </div>
  );
}

export default ExpenseList;
