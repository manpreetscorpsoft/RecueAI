import { useTranslation } from "react-i18next";
import { translateExpenseCategory } from "../../../data/expenseCategories";

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

  // =========================================================
  // BULK DELETE
  // =========================================================
  bulkDeleteMode = false,

  onToggleBulkDelete,

  selectedCount = 0,

  onBulkDelete,

  // =========================================================
  // SELECT ALL - CURRENT PAGINATION PAGE
  // =========================================================
  allCurrentPageSelected = false,

  currentPageExpenseCount = 0,

  onToggleSelectAll,
}) {
  const isDashboard = variant === "dashboard";

  const updateFilter = (name, value) => {
    onFilterChange(name, value);
  };

  return (
    <div className="w-full min-w-0">
      {/* =====================================================
          DASHBOARD
      ====================================================== */}

      {isDashboard && (
        <div className="hidden lg:block">
          <div
            className="
              grid
              w-full
              min-w-0
              grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]
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

      {/* =====================================================
          EXPENSE PAGE
      ====================================================== */}

      {!isDashboard && (
        <>
          {/* =================================================
              MOBILE / TABLET
          ================================================== */}

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

            {/* Dates */}
            <div
              className="
                grid
                w-full
                min-w-0
                grid-cols-1
                gap-3
                sm:grid-cols-2
              "
            >
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

            {/* Sorting */}
            <div
              className="
                grid
                w-full
                grid-cols-1
                gap-3
                sm:grid-cols-2
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

            {/* Export */}
            <ExportButton onExport={onExport} />

            {/* =================================================
                MOBILE BULK DELETE AREA
            ================================================== */}

            <div
              className="
                grid
                w-full
                grid-cols-1
                gap-3
                sm:grid-cols-2
              "
            >
              {/* Select All Current Page */}
              {bulkDeleteMode && currentPageExpenseCount > 0 ? (
                <SelectAllButton
                  allSelected={allCurrentPageSelected}
                  currentPageExpenseCount={currentPageExpenseCount}
                  onToggle={onToggleSelectAll}
                />
              ) : (
                <div className="hidden sm:block" />
              )}

              {/* Bulk Delete */}
              <BulkDeleteToggle
                bulkDeleteMode={bulkDeleteMode}
                onToggle={onToggleBulkDelete}
              />
            </div>

            {/* Delete Selected */}
            {bulkDeleteMode && selectedCount > 0 && (
              <DeleteSelectedButton
                selectedCount={selectedCount}
                onBulkDelete={onBulkDelete}
              />
            )}
          </div>

          {/* =================================================
              DESKTOP
          ================================================== */}

          <div className="hidden lg:block">
            {/* =============================
                FIRST ROW
            ============================== */}

            <div
              className="
                grid
                w-full
                min-w-0
                grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_145px]
                gap-4
              "
            >
              {/* Search */}
              <div className="min-w-0">
                <SearchField
                  value={filters.search}
                  onChange={(value) => updateFilter("search", value)}
                />
              </div>

              {/* Category */}
              <div className="min-w-0">
                <CategoryField
                  value={filters.category}
                  categories={categories}
                  onChange={(value) => updateFilter("category", value)}
                />
              </div>

              {/* From Date */}
              <div className="min-w-0">
                <DateField
                  value={filters.fromDate}
                  onChange={(value) => updateFilter("fromDate", value)}
                  label="From Date"
                />
              </div>

              {/* To Date */}
              <div className="min-w-0">
                <DateField
                  value={filters.toDate}
                  onChange={(value) => updateFilter("toDate", value)}
                  label="To Date"
                />
              </div>

              {/* Export */}
              <ExportButton onExport={onExport} />
            </div>

            {/* =============================
                SECOND ROW
            ============================== */}

            <div
              className="
                mt-3
                grid
                w-full
                min-w-0
                grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_145px]
                gap-4
              "
            >
              {/* Sort Price */}
              <PriceSortField
                value={filters.sortPrice}
                onChange={(value) => updateFilter("sortPrice", value)}
              />

              {/* Sort Date */}
              <DateSortField
                value={filters.sortDate}
                onChange={(value) => updateFilter("sortDate", value)}
              />

              {/* Select All Current Page */}
              <div className="min-w-0">
                {bulkDeleteMode && currentPageExpenseCount > 0 && (
                  <SelectAllButton
                    allSelected={allCurrentPageSelected}
                    currentPageExpenseCount={currentPageExpenseCount}
                    onToggle={onToggleSelectAll}
                  />
                )}
              </div>

              {/* Delete Selected */}
              <div className="min-w-0">
                {bulkDeleteMode && selectedCount > 0 && (
                  <DeleteSelectedButton
                    selectedCount={selectedCount}
                    onBulkDelete={onBulkDelete}
                  />
                )}
              </div>

              {/* Bulk Delete */}
              <BulkDeleteToggle
                bulkDeleteMode={bulkDeleteMode}
                onToggle={onToggleBulkDelete}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* =========================================================
   SEARCH
========================================================= */

function SearchField({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <div
      className="
        flex
        h-[44px]
        w-full
        min-w-0
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
        className="
          h-[17px]
          w-[17px]
          shrink-0
          text-[#81858a]
        "
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

/* =========================================================
   CATEGORY
========================================================= */

function CategoryField({ value, categories, onChange }) {
  const { t } = useTranslation();

  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="
        h-[44px]
        w-full
        min-w-0
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
          {translateExpenseCategory(t, category)}
        </option>
      ))}
    </select>
  );
}

/* =========================================================
   DATE
========================================================= */

function DateField({ value, onChange, label }) {
  const { t } = useTranslation();

  const labelKey =
    label === "From Date" ? "filters.fromDate" : "filters.toDate";

  return (
    <div
      className="
        w-full
        min-w-0
        overflow-hidden
      "
    >
      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={t(labelKey)}
        className="
          date-filter-input
          block
          h-[44px]
          w-full
          min-w-0
          max-w-full
          box-border
          rounded-[8px]
          border
          border-[#3a3f45]
          bg-[#171c22]
          px-3
          text-[12px]
          text-[#999ca1]
          outline-none
          sm:px-4
        "
      />
    </div>
  );
}

/* =========================================================
   DATE SORT
========================================================= */

function DateSortField({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="
        h-[44px]
        w-full
        min-w-0
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

/* =========================================================
   PRICE SORT
========================================================= */

function PriceSortField({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="
        h-[44px]
        w-full
        min-w-0
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

/* =========================================================
   EXPORT CSV
========================================================= */

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
        px-3
        text-[12px]
        font-semibold
        text-[#111418]
      "
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="
          h-[17px]
          w-[17px]
          shrink-0
        "
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 3v11" strokeLinecap="round" />

        <path d="m8 10 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />

        <path d="M5 18v2h14v-2" strokeLinecap="round" />
      </svg>

      <span>{t("filters.exportCsv")}</span>
    </button>
  );
}

/* =========================================================
   SELECT ALL CURRENT PAGE
========================================================= */

function SelectAllButton({ allSelected, currentPageExpenseCount, onToggle }) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={allSelected}
      className={`
        flex
        h-[44px]
        w-full
        items-center
        justify-center
        gap-2
        rounded-[8px]
        border
        px-3
        text-[11px]
        font-semibold
        transition-colors
        duration-200

        ${
          allSelected
            ? `
              border-[#d5af42]
              bg-[#353226]
              text-[#d5af42]
            `
            : `
              border-[#403a28]
              bg-[#171c22]
              text-[#a5a7aa]
            `
        }
      `}
    >
      {/* Checkbox style indicator */}
      <span
        className={`
          flex
          h-[16px]
          w-[16px]
          shrink-0
          items-center
          justify-center
          rounded-[3px]
          border
          text-[11px]
          font-bold

          ${
            allSelected
              ? `
                border-[#d5af42]
                bg-[#d5af42]
                text-[#111418]
              `
              : `
                border-[#777b81]
                bg-transparent
                text-transparent
              `
          }
        `}
      >
        ✓
      </span>

      <span>
        {allSelected
          ? t("filters.unselectAll", { count: currentPageExpenseCount })
          : t("filters.selectAll", { count: currentPageExpenseCount })}
      </span>
    </button>
  );
}

/* =========================================================
   DELETE SELECTED BUTTON
========================================================= */

function DeleteSelectedButton({ selectedCount, onBulkDelete }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onBulkDelete}
      className="
        flex
        h-[44px]
        w-full
        items-center
        justify-center
        rounded-[8px]
        bg-[#a93e3e]
        px-3
        text-[11px]
        font-semibold
        text-white
        transition-colors
        duration-200
        hover:bg-[#963636]
      "
    >
      {t("filters.deleteSelected", { count: selectedCount })}
    </button>
  );
}

/* =========================================================
   BULK DELETE TOGGLE
========================================================= */

function BulkDeleteToggle({ bulkDeleteMode, onToggle }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={bulkDeleteMode}
      className="
        flex
        h-[44px]
        w-full
        items-center
        justify-center
        gap-2
        rounded-[8px]
        border
        border-[#403a28]
        bg-[#171c22]
        px-2
        text-[11px]
        font-medium
        text-[#a5a7aa]
      "
    >
      <span>{t("filters.bulkDelete")}</span>

      <span
        className={`
          relative
          inline-flex
          h-[20px]
          w-[38px]
          shrink-0
          rounded-full
          transition-colors
          duration-200

          ${bulkDeleteMode ? "bg-[#d5af42]" : "bg-[#44494e]"}
        `}
      >
        <span
          className={`
            absolute
            top-[2px]
            h-[16px]
            w-[16px]
            rounded-full
            bg-white
            shadow
            transition-transform
            duration-200

            ${bulkDeleteMode ? "translate-x-[20px]" : "translate-x-[2px]"}
          `}
        />
      </span>
    </button>
  );
}

export default ExpenseFilters;
