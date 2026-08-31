import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function EditExpenseModal({ expense, onClose, onUpdate, updating = false }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    supplier: "",
    category: "",
    amount: "",
    description: "",
    purchaseDate: "",
  });

  useEffect(() => {
    if (!expense) return;

    setForm({
      supplier: expense.supplier || "",
      category: expense.category || "",
      amount: expense.rawAmount ?? "",
      description: expense.description || "",
      purchaseDate: formatDateForDisplay(expense.purchaseDate),
    });
  }, [expense]);

  if (!expense) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onUpdate({
      expenseId: expense.id,
      supplier: form.supplier.trim(),
      category: form.category,
      amount: form.amount,
      description: form.description.trim(),
      purchaseDate: formatDateForApi(form.purchaseDate),

      // Do not use currencySign here.
      currency: expense.currency,
    });
  };

  const categories = [
    ...new Set([
      expense.category,
      "Fuel",
      "Groceries",
      "Utilities",
      "Transport",
      "Food & Dining",
      "Meals",
      "Shopping",
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
              <path d="M7 7l10 10M17 7 7 17" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-7">
          {/* Supplier */}
          <FormLabel>{t("editExpense.supplier")}</FormLabel>

          <input
            name="supplier"
            value={form.supplier}
            onChange={handleChange}
            type="text"
            className={inputClass}
          />

          {/* Category */}
          <div className="mt-5">
            <FormLabel>{t("editExpense.category")}</FormLabel>

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
                  <option key={category} value={category}>
                    {translateCategory(t, category)}
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

          {/* Amount */}
          <div className="mt-5">
            <FormLabel>{t("editExpense.amount")}</FormLabel>

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
              {expense.currencySign && (
                <span className="mr-3 text-[14px] font-medium text-[#d5af42]">
                  {expense.currencySign}
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
          <div className="mt-5">
            <FormLabel>{t("editExpense.description")}</FormLabel>

            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              type="text"
              className={inputClass}
            />
          </div>

          {/* Purchase Date */}
          <div className="mt-5">
            <FormLabel>{t("editExpense.purchaseDate")}</FormLabel>

            <div className="relative">
              <input
                name="purchaseDate"
                value={form.purchaseDate}
                onChange={handleChange}
                type="text"
                placeholder={t("editExpense.datePlaceholder")}
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
                <rect x="4" y="5" width="16" height="15" rx="2" />

                <path d="M8 3v4M16 3v4M4 9h16" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Buttons */}
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
              {updating ? t("editExpense.updating") : t("editExpense.update")}
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

function FormLabel({ children }) {
  return (
    <label className="mb-2 block text-[13px] text-[#a4a5a8]">{children}</label>
  );
}

function formatDateForDisplay(date) {
  if (!date) return "";

  const parts = date.split("-");

  if (parts.length !== 3) {
    return date;
  }

  const [year, month, day] = parts;

  return `${day}/${month}/${year}`;
}

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
