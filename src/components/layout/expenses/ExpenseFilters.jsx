import { useTranslation } from "react-i18next";

function ExpenseFilters({
  variant = "expenses",
  filters = {
    search: "",
    category: "all",
    fromDate: "",
    toDate: "",
    sortDate: "",
    sortPrice: "",
  },
  categories = [],
  onFilterChange = () => {},
  onExport,
}) {
  const isDashboard = variant === "dashboard";

  const updateFilter = (name, value) => {
    onFilterChange(name, value);
  };

  return (
    <div
      className={`
        w-full
        ${isDashboard ? "hidden lg:block" : "block"}
      `}
    >
      {/* =========================
          DASHBOARD DESKTOP
      ========================== */}

      {isDashboard && (
        <div className="hidden lg:block">
          <div
            className="
              grid
              grid-cols-[minmax(240px,1.7fr)_minmax(170px,1fr)_minmax(150px,1fr)_minmax(150px,1fr)_minmax(150px,1fr)]
              gap-4
            "
          >
            <SearchField
              value={filters.search}
              onChange={(value) => updateFilter("search", value)}
            />

            <CategoryField
              value={filters.category}
              categories={categories}
              onChange={(value) => updateFilter("category", value)}
            />

            <DateField
              value={filters.fromDate}
              onChange={(value) => updateFilter("fromDate", value)}
              label="From Date"
            />

            <DateField
              value={filters.toDate}
              onChange={(value) => updateFilter("toDate", value)}
              label="To Date"
            />

            <DateSortField
              value={filters.sortDate}
              onChange={(value) => updateFilter("sortDate", value)}
            />
          </div>

          <div className="mt-4 w-[200px]">
            <PriceSortField
              value={filters.sortPrice}
              onChange={(value) => updateFilter("sortPrice", value)}
            />
          </div>
        </div>
      )}

      {/* =========================
          EXPENSE PAGE
      ========================== */}

      {!isDashboard && (
        <>
          {/* Mobile */}
          <div className="space-y-3 lg:hidden">
            <SearchField
              value={filters.search}
              onChange={(value) => updateFilter("search", value)}
            />

            <CategoryField
              value={filters.category}
              categories={categories}
              onChange={(value) => updateFilter("category", value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <DateField
                value={filters.fromDate}
                onChange={(value) => updateFilter("fromDate", value)}
                label="From Date"
              />

              <DateField
                value={filters.toDate}
                onChange={(value) => updateFilter("toDate", value)}
                label="To Date"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <DateSortField
                value={filters.sortDate}
                onChange={(value) => updateFilter("sortDate", value)}
              />

              <PriceSortField
                value={filters.sortPrice}
                onChange={(value) => updateFilter("sortPrice", value)}
              />
            </div>

            <ExportButton onExport={onExport} />
          </div>

          {/* Desktop */}
          <div className="hidden lg:block">
            <div
              className="
                grid
                grid-cols-[minmax(260px,1.7fr)_minmax(180px,1fr)_minmax(165px,1fr)_minmax(165px,1fr)_145px]
                gap-4
              "
            >
              <SearchField
                value={filters.search}
                onChange={(value) => updateFilter("search", value)}
              />

              <CategoryField
                value={filters.category}
                categories={categories}
                onChange={(value) => updateFilter("category", value)}
              />

              <DateField
                value={filters.fromDate}
                onChange={(value) => updateFilter("fromDate", value)}
                label="From Date"
              />

              <DateField
                value={filters.toDate}
                onChange={(value) => updateFilter("toDate", value)}
                label="To Date"
              />

              <ExportButton onExport={onExport} />
            </div>

            <div
              className="
                mt-4
                grid
                max-w-[400px]
                grid-cols-2
                gap-4
              "
            >
              <PriceSortField
                value={filters.sortPrice}
                onChange={(value) => updateFilter("sortPrice", value)}
              />

              <DateSortField
                value={filters.sortDate}
                onChange={(value) => updateFilter("sortDate", value)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SearchField({ value, onChange }) {
  const { t } = useTranslation();
  return (
    <div
      className="
        flex
        h-[44px]
        w-full
        items-center
        rounded-[8px]
        border
        border-[#3a3f45]
        bg-[#171c22]
        px-4
      "
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-[17px] w-[17px] shrink-0 text-[#81858a]"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="6" />
        <path d="m16 16 4 4" strokeLinecap="round" />
      </svg>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t("filters.searchSupplier")}
        className="
          ml-3
          min-w-0
          flex-1
          bg-transparent
          text-[13px]
          text-[#f4f0e9]
          outline-none
          placeholder:text-[#777b81]
        "
      />
    </div>
  );
}

function CategoryField({ value, categories, onChange }) {
  const { t } = useTranslation();
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="
        h-[44px]
        w-full
        rounded-[8px]
        border
        border-[#3a3f45]
        bg-[#171c22]
        px-4
        text-[13px]
        text-[#999ca1]
        outline-none
      "
    >
      <option value="all">{t("filters.allCategories")}</option>

      {categories.map((category) => (
        <option key={category} value={category}>
          {translateCategory(t, category)}
        </option>
      ))}
    </select>
  );
}

function DateField({ value, onChange, label }) {
  const { t } = useTranslation();
  const labelKey =
    label === "From Date" ? "filters.fromDate" : "filters.toDate";
  return (
    <div className="relative">
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={t(labelKey)}
        className="
        date-filter-input
          h-[44px]
          w-full
          rounded-[8px]
          border
          border-[#3a3f45]
          bg-[#171c22]
          px-4
          text-[12px]
          text-[#999ca1]
          outline-none
        "
      />
    </div>
  );
}

function DateSortField({ value, onChange }) {
  const { t } = useTranslation();
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="
        h-[44px]
        w-full
        rounded-[8px]
        border
        border-[#3a3f45]
        bg-[#171c22]
        px-4
        text-[13px]
        text-[#999ca1]
        outline-none
      "
    >
      <option value="">{t("filters.sortByDate")}</option>

      <option value="newest">{t("filters.newestFirst")}</option>

      <option value="oldest">{t("filters.oldestFirst")}</option>
    </select>
  );
}

function PriceSortField({ value, onChange }) {
  const { t } = useTranslation();
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="
        h-[44px]
        w-full
        rounded-[8px]
        border
        border-[#3a3f45]
        bg-[#171c22]
        px-4
        text-[13px]
        text-[#999ca1]
        outline-none
      "
    >
      <option value="">{t("filters.sortByPrice")}</option>

      <option value="low-high">{t("filters.lowToHigh")}</option>

      <option value="high-low">{t("filters.highToLow")}</option>
    </select>
  );
}

function ExportButton({ onExport }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onExport}
      className="
        flex
        h-[44px]
        w-full
        items-center
        justify-center
        gap-2
        rounded-[8px]
        bg-[#d5af42]
        px-4
        text-[13px]
        font-semibold
        text-[#111418]
      "
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-[17px] w-[17px]"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 3v11" strokeLinecap="round" />

        <path d="m8 10 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />

        <path d="M5 18v2h14v-2" strokeLinecap="round" />
      </svg>
      {t("filters.exportCsv")}
    </button>
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

export default ExpenseFilters;
