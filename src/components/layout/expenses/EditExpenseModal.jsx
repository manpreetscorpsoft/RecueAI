import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  EXPENSE_CATEGORIES,
  normalizeExpenseCategory,
  translateExpenseCategory,
} from "../../../data/expenseCategories";

// IMPORTANT:
// Is path ko apni actual service file ke according set karna
import { getCurrencies } from "../../../services/expenseService";

function EditExpenseModal({
  expense,
  onClose,
  onUpdate,
  updating = false,
}) {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    supplier: "",
    category: "",
    amount: "",
    description: "",
    purchaseDate: "",

    // Currency code
    currency: "",

    // Currency symbol
    currencySign: "",
  });

  const [currencyOpen, setCurrencyOpen] = useState(false);

  const [currencySearch, setCurrencySearch] = useState("");

  const [currencies, setCurrencies] = useState([]);

  const [currencyLoading, setCurrencyLoading] = useState(false);

  /*
  ========================================
  SET CURRENT EXPENSE DATA
  ========================================
  */

  useEffect(() => {
    if (!expense) return;

    setForm({
      supplier: expense.supplier || "",

      category: normalizeExpenseCategory(
        expense.category,
        t,
      ),

      amount: expense.rawAmount ?? "",

      description: expense.description || "",

      purchaseDate: formatDateForDisplay(
        expense.purchaseDate,
      ),

      // Existing currency
      currency: expense.currency || "",

      // Existing currency sign
      currencySign: expense.currencySign || "",
    });

    setCurrencySearch("");
    setCurrencies([]);
    setCurrencyOpen(false);
  }, [expense, t]);

  /*
  ========================================
  CURRENCY API SEARCH
  ========================================

  Dropdown open hone ke baad API call hogi.

  Search example:
  korea
  india
  usd
  eur
  */

  useEffect(() => {
    if (!currencyOpen) {
      return;
    }

    let ignore = false;

    const timer = setTimeout(async () => {
      try {
        setCurrencyLoading(true);

        const response = await getCurrencies(
          currencySearch.trim(),
        );

        if (ignore) {
          return;
        }

        if (
          response?.success &&
          Array.isArray(response.currencies)
        ) {
          setCurrencies(response.currencies);
        } else {
          setCurrencies([]);
        }
      } catch (error) {
        if (!ignore) {
          console.error(
            "Currency search failed:",
            error,
          );

          setCurrencies([]);
        }
      } finally {
        if (!ignore) {
          setCurrencyLoading(false);
        }
      }
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [currencySearch, currencyOpen]);

  if (!expense) {
    return null;
  }

  /*
  ========================================
  NORMAL FORM CHANGE
  ========================================
  */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /*
  ========================================
  SELECT CURRENCY
  ========================================
  */

  const handleCurrencySelect = (currency) => {
    setForm((current) => ({
      ...current,

      // Example: EUR
      currency: currency.currency_code,

      // Example: €
      currencySign: currency.currency_sign,
    }));

    setCurrencySearch("");

    setCurrencyOpen(false);
  };

  /*
  ========================================
  SUBMIT UPDATE
  ========================================
  */

  const handleSubmit = (event) => {
    event.preventDefault();

    onUpdate({
      expenseId: expense.id,

      supplier: form.supplier.trim(),

      category: form.category,

      amount: form.amount,

      description: form.description.trim(),

      purchaseDate: formatDateForApi(
        form.purchaseDate,
      ),

      // IMPORTANT
      // Selected currency jayegi
      currency: form.currency,
    });
  };

  /*
  ========================================
  CATEGORIES
  ========================================
  */

  const normalizedCurrentCategory =
    normalizeExpenseCategory(
      expense.category,
      t,
    );

  const categories = [
    ...new Set([
      normalizedCurrentCategory,
      ...EXPENSE_CATEGORIES,
    ]),
  ].filter(Boolean);

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
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
              {t("editExpense.title")}
            </h2>

            <p className="mt-1 text-[13px] text-[#999ca1]">
              {t("editExpense.subtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t("auth.closeEdit")}
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
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              stroke="currentColor"
              strokeWidth="2.4"
            >
              <path
                d="M7 7l10 10M17 7 7 17"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-5
          grid
          grid-cols-[minmax(0,1fr)_minmax(0,1fr)]
          gap-x-[10px]
          gap-y-0
          "
        >
          {/* Supplier */}
          <div className="mt-5 col-start-1 col-end-3">
                <FormLabel>
            {t("editExpense.supplier")}
          </FormLabel>

          <input
            name="supplier"
            value={form.supplier}
            onChange={handleChange}
            type="text"
            className={inputClass}
          />

          </div>
          

          {/* Category */}

          <div className="mt-5">
            <FormLabel>
              {t("editExpense.category")}
            </FormLabel>

            <div className="relative">
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`
                  ${inputClass}
                  appearance-none
                  pr-12
                `}
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {translateExpenseCategory(
                      t,
                      category,
                    )}
                  </option>
                ))}
              </select>

              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="
                  pointer-events-none
                  absolute
                  right-4
                  top-1/2
                  h-[18px]
                  w-[18px]
                  -translate-y-1/2
                  text-[#a0a3a7]
                "
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="m7 9 5 5 5-5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* =================================== */}
          {/* Currency */}
          {/* =================================== */}

          <div className="mt-5">
            <FormLabel>
              Curre{t("editExpense.currency")}
            </FormLabel>

            <div className="relative">
              {/* Selected currency field */}

              <button
                type="button"
                onClick={() => {
                  setCurrencyOpen(
                    (current) => !current,
                  );

                  setCurrencySearch("");
                }}
                className="
                  flex
                  h-[46px]
                  w-full
                  items-center
                  rounded-[8px]
                  border
                  border-[#403a28]
                  bg-[#0d1117]
                  px-4
                  text-left
                  outline-none
                  focus:border-[#d5af42]
                "
              >
                {/* Currency sign */}

                {form.currencySign && (
                  <span
                    className="
                      mr-3
                      flex
                      min-w-[34px]
                      items-center
                      justify-center
                      rounded-[5px]
                      bg-[#171c22]
                      px-2
                      py-1
                      text-[14px]
                      font-semibold
                      text-[#d5af42]
                    "
                  >
                    {form.currencySign}
                  </span>
                )}

                {/* Currency code */}

                <span className="mr-3 text-[14px] font-semibold text-[#f5f0e8]">
                  {form.currency || t("editExpense.selectCurrency")}
                </span>

                {/* Text */}

                <span className="min-w-0 flex-1 truncate text-[13px] text-[#999ca1]">
                  {form.currency
                    ? t("editExpense.changeCurrency")
                    : t("editExpense.selectCurrency")}
                </span>

                {/* Arrow */}

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`
                    h-[18px]
                    w-[18px]
                    shrink-0
                    text-[#a0a3a7]
                    transition-transform

                    ${
                      currencyOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="m7 9 5 5 5-5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* =================================== */}
              {/* Currency Dropdown */}
              {/* =================================== */}

              {currencyOpen && (
                <div
                  className="
                    absolute
                    left-0
                    right-0
                    top-[52px]
                    z-[200]
                    overflow-hidden
                    rounded-[8px]
                    border
                    border-[#403a28]
                    bg-[#171c22]
                    shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                  "
                >
                  {/* Search */}

                  <div className="border-b border-[#403a28] p-3">
                    <div className="relative">
                      {/* Search Icon */}

                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="
                          pointer-events-none
                          absolute
                          left-3
                          top-1/2
                          h-[17px]
                          w-[17px]
                          -translate-y-1/2
                          text-[#81858b]
                        "
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle
                          cx="11"
                          cy="11"
                          r="7"
                        />

                        <path
                          d="m20 20-3.5-3.5"
                          strokeLinecap="round"
                        />
                      </svg>

                      <input
                        type="text"
                        value={currencySearch}
                        onChange={(event) =>
                          setCurrencySearch(
                            event.target.value,
                          )
                        }
                        placeholder={t("editExpense.searchCurrencyPlaceholder")}
                        autoFocus
                        className="
                          h-[42px]
                          w-full
                          rounded-[7px]
                          border
                          border-[#403a28]
                          bg-[#0d1117]
                          pl-10
                          pr-4
                          text-[13px]
                          text-[#f5f0e8]
                          outline-none
                          placeholder:text-[#696d73]
                          focus:border-[#d5af42]
                        "
                      />
                    </div>
                  </div>

                  {/* =================================== */}
                  {/* API Results */}
                  {/* =================================== */}

                  <div className="max-h-[220px] overflow-y-auto">
                    {currencyLoading ? (
                      <div className="px-4 py-5 text-center text-[12px] text-[#777b80]">
                        {t("editExpense.loadingCurrencies")}
                      </div>
                    ) : currencies.length > 0 ? (
                      currencies.map(
                        (currency) => {
                          const isSelected =
                            String(
                              currency.currency_code,
                            ).toUpperCase() ===
                            String(
                              form.currency,
                            ).toUpperCase();

                          return (
                            <button
                              key={`${currency.country_name}-${currency.currency_code}`}
                              type="button"
                              onClick={() =>
                                handleCurrencySelect(
                                  currency,
                                )
                              }
                              className={`
                                flex
                                w-full
                                items-center
                                px-4
                                py-3
                                text-left
                                transition

                                ${
                                  isSelected
                                    ? "bg-[#d5af42]/10"
                                    : "hover:bg-[#20262e]"
                                }
                              `}
                            >
                              {/* Currency Sign */}

                              <span
                                className="
                                  mr-3
                                  flex
                                  min-w-[38px]
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-[5px]
                                  bg-[#0d1117]
                                  px-2
                                  py-1
                                  text-[13px]
                                  font-semibold
                                  text-[#d5af42]
                                "
                              >
                                {currency.currency_sign}
                              </span>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  {/* Currency Code */}

                                  <span
                                    className={`
                                      text-[13px]
                                      font-semibold

                                      ${
                                        isSelected
                                          ? "text-[#d5af42]"
                                          : "text-[#f5f0e8]"
                                      }
                                    `}
                                  >
                                    {
                                      currency.currency_code
                                    }
                                  </span>
                                </div>

                                {/* Country */}

                                <p className="mt-[2px] truncate text-[11px] text-[#777b80]">
                                  {
                                    currency.country_name
                                  }
                                </p>
                              </div>

                              {/* Selected Tick */}

                              {isSelected && (
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  className="
                                    h-[18px]
                                    w-[18px]
                                    text-[#d5af42]
                                  "
                                  stroke="currentColor"
                                  strokeWidth="2.2"
                                >
                                  <path
                                    d="m5 12 4 4L19 6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </button>
                          );
                        },
                      )
                    ) : (
                      <div className="px-4 py-5 text-center text-[12px] text-[#777b80]">
                        {t("editExpense.noCurrencyFound")}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* =================================== */}
          {/* Amount */}
          {/* =================================== */}

          <div className="mt-5">
            <FormLabel>
              {t("editExpense.amount")}
            </FormLabel>

            <div
              className="
                flex
                h-[46px]
                items-center
                rounded-[8px]
                border
                border-[#403a28]
                bg-[#0d1117]
                px-4
              "
            >
              {/* IMPORTANT:
                  Selected currency ka latest sign
                  yahan automatically show hoga
              */}

              {form.currencySign && (
                <span className="mr-3 text-[14px] font-medium text-[#d5af42]">
                  {form.currencySign}
                </span>
              )}

              <input
                name="amount"
                value={form.amount}
                onChange={handleChange}
                type="number"
                step="0.01"
                min="0"
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  text-[14px]
                  text-[#f5f0e8]
                  outline-none
                "
              />
            </div>
          </div>

          {/* Description */}

          <div className="mt-5 col-start-1 col-end-3">
            <FormLabel>
              {t("editExpense.description")}
            </FormLabel>

            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              type="text"
              className={inputClass}
            />
          </div>

          {/* Purchase Date */}

          <div className="mt-5 row-start-2 row-end-3 col-start-2 col-end-3">
            <FormLabel>
              {t("editExpense.purchaseDate")}
            </FormLabel>

            <div className="relative">
              <input
                name="purchaseDate"
                value={form.purchaseDate}
                onChange={handleChange}
                type="text"
                placeholder={t(
                  "editExpense.datePlaceholder",
                )}
                className={`${inputClass} pr-12`}
              />

              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="
                  pointer-events-none
                  absolute
                  right-4
                  top-1/2
                  h-[18px]
                  w-[18px]
                  -translate-y-1/2
                  text-[#9a9da2]
                "
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect
                  x="4"
                  y="5"
                  width="16"
                  height="15"
                  rx="2"
                />

                <path
                  d="M8 3v4M16 3v4M4 9h16"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Buttons */}

          <div
            className="
              mt-7
              flex
              flex-col
              gap-3

              lg:flex-row-reverse
              col-start-1
              col-end-3
            "
          >
            <button
              type="submit"
              disabled={updating}
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
              {updating
                ? t("editExpense.updating")
                : t("editExpense.update")}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={updating}
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

                lg:w-auto
                lg:flex-1
              "
            >
              {t("common.cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/*
========================================
INPUT CLASS
========================================
*/

const inputClass = `
  h-[46px]
  w-full
  rounded-[8px]
  border
  border-[#403a28]
  bg-[#0d1117]
  px-4
  text-[14px]
  text-[#f5f0e8]
  outline-none
  focus:border-[#d5af42]
`;

/*
========================================
LABEL
========================================
*/

function FormLabel({ children }) {
  return (
    <label className="mb-2 block text-[13px] text-[#a4a5a8]">
      {children}
    </label>
  );
}

/*
========================================
DATE DISPLAY
========================================
*/

function formatDateForDisplay(date) {
  if (!date) return "";

  const parts = date.split("-");

  if (parts.length !== 3) {
    return date;
  }

  const [year, month, day] = parts;

  return `${day}/${month}/${year}`;
}

/*
========================================
DATE API FORMAT
========================================
*/

function formatDateForApi(date) {
  if (!date) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  const parts = date.split("/");

  if (parts.length !== 3) {
    return date;
  }

  const [day, month, year] = parts;

  return `${year}-${month}-${day}`;
}

export default EditExpenseModal;