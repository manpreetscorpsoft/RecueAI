import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/layout/StatCard";
import ExpenseList from "../../components/layout/expenses/ExpenseList";
import EditExpenseModal from "../../components/layout/expenses/EditExpenseModal";
import ExpenseUpdateSuccessModal from "../../components/layout/expenses/ExpenseUpdateSuccessModal";
import {
  getUserExpenses,
  updateExpense,
  deleteExpense,
} from "../../services/expenseService";
import { getUserFullDetails } from "../../services/userService";
import ExpenseFilters from "../../components/layout/expenses/ExpenseFilters";
import { useEffect, useMemo, useState } from "react";
import DeleteExpenseModal from "../../components/layout/expenses/DeleteExpenseModal";
import ExpenseDeleteSuccessModal from "../../components/layout/expenses/ExpenseDeleteSuccessModal";
import { applyUserLanguage } from "../../i18n/i18n";
import { useTranslation } from "react-i18next";
function DashboardPage() {
  const { t } = useTranslation();
  const userId = 250;

  const [expenses, setExpenses] = useState([]);
  const [expensesLoading, setExpensesLoading] = useState(true);
  const [expensesError, setExpensesError] = useState("");
  const [accountData, setAccountData] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [updating, setUpdating] = useState(false);

  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const layoutRole = accountData?.layoutRole || "admin";
  const dashboardData = useMemo(() => {
    const expenseLimit = accountData?.expenseLimit ?? 0;
    const expensesUsed = accountData?.expensesUsed ?? 0;
    const totalExpenses = expenses.reduce(
      (total, expense) => total + Number(expense.rawAmount || 0),
      0,
    );
    const percentageUsed = expenseLimit
      ? Math.min(100, Math.round((expensesUsed / expenseLimit) * 100))
      : 0;
    const firstExpense = expenses.find(
      (expense) => expense.currencySign || expense.currency,
    );

    return {
      currentPlan: accountData?.currentPlan || "-",
      expensesUsed,
      expenseLimit,
      totalExpenses,
      currencySign: firstExpense?.currencySign || accountData?.currency || "",
      subscriptionStatus: accountData?.subscriptionStatus || "-",
      planExpiry: accountData?.planExpires || "-",
      percentageUsed,
    };
  }, [accountData, expenses]);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    fromDate: "",
    toDate: "",
    sortDate: "",
    sortPrice: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const CrownIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px]"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M4 7l4 4 4-6 4 6 4-4-2 10H6L4 7Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const DocumentIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px]"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 3v5h5" />
      <path d="M9 12h6M9 16h6" strokeLinecap="round" />
    </svg>
  );

  const WalletIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px]"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v2" strokeLinecap="round" />
      <rect x="4" y="7" width="16" height="12" rx="2" />
      <path
        d="M16 11h4v4h-4a2 2 0 1 1 0-4Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const CalendarIcon = () => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px]"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 9h16" strokeLinecap="round" />
    </svg>
  );
  const loadAccountDetails = async () => {
    try {
      const data = await getUserFullDetails(userId);

      if (!data?.success || !data?.user) {
        throw new Error("User account details were not returned.");
      }
      applyUserLanguage(data.user.language);
      const group = data.group || null;
      const isGroupAccount = data.account_type === "group";
      const groupRole = group?.current_user?.role || group?.role || null;

      setAccountData({
        phone: cleanText(data.user.phone),
        language: cleanText(data.user.language),

        currentPlan: cleanText(data.user.plan_name),
        expensesUsed: data.user.used_limit ?? 0,
        expenseLimit: data.user.total_expense_limit ?? 0,
        planExpires: formatAccountDate(data.user.plan_expires_at),
        currency: cleanText(data.user.currency),
        subscriptionStatus: cleanText(data.user.subscription_status),

        layoutRole:
          isGroupAccount && groupRole === "member" ? "member" : "admin",
      });
    } catch (err) {
      console.error("Unable to load dashboard account details:", err);
    }
  };

  const loadExpenses = async () => {
    try {
      setExpensesLoading(true);
      setExpensesError("");

      const data = await getUserExpenses(userId);

      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Unable to load dashboard expenses:", err);

      setExpensesError("dashboard.unableToLoadExpenses");
    } finally {
      setExpensesLoading(false);
    }
  };

  useEffect(() => {
    loadAccountDetails();
    loadExpenses();
  }, []);
  const handleUpdateExpense = async (values) => {
    try {
      setUpdating(true);

      if (!values.currency) {
        throw new Error("Currency code is missing for this expense.");
      }

      await updateExpense(values);

      // Close edit modal
      setSelectedExpense(null);

      // Refresh dashboard expense grid
      await loadExpenses();

      // Show success popup
      setShowUpdateSuccess(true);
    } catch (err) {
      console.error("Unable to update expense:", err);
    } finally {
      setUpdating(false);
    }
  };
  const handleDeleteExpense = async () => {
    if (!expenseToDelete?.id) {
      return;
    }

    try {
      setDeleting(true);

      await deleteExpense(expenseToDelete.id);

      // Close confirmation popup
      setExpenseToDelete(null);

      // Reload dashboard expenses
      await loadExpenses();

      // Show success popup
      setShowDeleteSuccess(true);
    } catch (err) {
      console.error("Unable to delete expense:", err);
    } finally {
      setDeleting(false);
    }
  };
  const categories = useMemo(() => {
    return [
      ...new Set(expenses.map((expense) => expense.category).filter(Boolean)),
    ].sort();
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // Search supplier
    if (filters.search.trim()) {
      const searchValue = filters.search.trim().toLowerCase();

      result = result.filter((expense) =>
        String(expense.supplier || "")
          .toLowerCase()
          .includes(searchValue),
      );
    }

    // Category
    if (filters.category !== "all") {
      result = result.filter(
        (expense) => expense.category === filters.category,
      );
    }

    // From date
    if (filters.fromDate) {
      result = result.filter(
        (expense) =>
          expense.purchaseDate && expense.purchaseDate >= filters.fromDate,
      );
    }

    // To date
    if (filters.toDate) {
      result = result.filter(
        (expense) =>
          expense.purchaseDate && expense.purchaseDate <= filters.toDate,
      );
    }

    // Price low → high
    if (filters.sortPrice === "low-high") {
      result.sort(
        (a, b) => Number(a.rawAmount || 0) - Number(b.rawAmount || 0),
      );
    }

    // Price high → low
    if (filters.sortPrice === "high-low") {
      result.sort(
        (a, b) => Number(b.rawAmount || 0) - Number(a.rawAmount || 0),
      );
    }

    // Newest first
    if (filters.sortDate === "newest") {
      result.sort(
        (a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate),
      );
    }

    // Oldest first
    if (filters.sortDate === "oldest") {
      result.sort(
        (a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate),
      );
    }

    return result;
  }, [expenses, filters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredExpenses.length / itemsPerPage),
  );

  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return filteredExpenses.slice(startIndex, endIndex);
  }, [filteredExpenses, currentPage]);

  const handleFilterChange = (name, value) => {
    setFilters((current) => {
      const updated = {
        ...current,
        [name]: value,
      };

      if (name === "sortDate" && value) {
        updated.sortPrice = "";
      }

      if (name === "sortPrice" && value) {
        updated.sortDate = "";
      }

      return updated;
    });

    // Always return to page 1 after changing a filter
    setCurrentPage(1);
  };

  return (
    <DashboardLayout role={layoutRole} phone={accountData?.phone || ""}>
      {/* Page Heading */}
      <div>
        <h1
          className="
            text-[26px]
            font-semibold
            leading-tight
            text-[#f5f0e8]

            sm:text-[28px]
            lg:text-[30px]
          "
        >
          {t("dashboard.title")}
        </h1>

        <p
          className="
            mt-1.5
            text-[13px]
            text-[#999ca1]

            sm:text-[14px]
          "
        >
          {t("dashboard.overview")}
        </p>
      </div>

      {/* =========================
          STAT CARDS
      ========================== */}
      <div
        className="
          mt-6
          grid
          grid-cols-2
          gap-3

          sm:gap-4

          lg:mt-7
          lg:grid-cols-4
          lg:gap-5
        "
      >
        {/* Current Plan

            Desktop order: 1
            Mobile order: 2
        */}
        <div className="order-2 lg:order-1">
          <StatCard
            title={t("dashboard.currentPlan")}
            value={
              <span className="text-[#d5af42]">
                {translatePlan(t, dashboardData.currentPlan)}
              </span>
            }
            icon={<CrownIcon />}
          >
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3fb950]" />

              <span className="text-[11px] text-[#8f9297] sm:text-[12px]">
                {translateStatus(t, dashboardData.subscriptionStatus)}
              </span>
            </div>
          </StatCard>
        </div>

        {/* Expenses Used

            Desktop order: 2
            Mobile order: 1
        */}
        <div className="order-1 lg:order-2">
          <StatCard
            title={t("dashboard.expensesUsed")}
            value={
              <>
                {dashboardData.expensesUsed.toLocaleString()} /{" "}
                {dashboardData.expenseLimit.toLocaleString()}
              </>
            }
            icon={<DocumentIcon />}
          >
            <div>
              <div className="h-[6px] w-full overflow-hidden rounded-full bg-[#2b3036]">
                <div
                  className="h-full rounded-full bg-[#d5af42]"
                  style={{
                    width: `${dashboardData.percentageUsed}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-[11px] text-[#85888d] sm:text-[12px]">
                {t("dashboard.quotaUtilized", {
                  percentage: dashboardData.percentageUsed,
                })}
              </p>
            </div>
          </StatCard>
        </div>

        {/* Total Expenses */}
        <div className="order-3">
          <StatCard
            title={t("dashboard.totalExpenses")}
            value={`${dashboardData.currencySign}${dashboardData.totalExpenses.toLocaleString()}`}
            icon={<WalletIcon />}
          >
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[11px] font-medium text-[#3fb950] sm:text-[12px]">
                ↗ +14.3%
              </span>

              <span className="text-[11px] text-[#85888d]">
                {t("dashboard.sinceLastMonth")}
              </span>
            </div>
          </StatCard>
        </div>

        {/* Plan Expiry */}
        <div className="order-4">
          <StatCard
            title={t("dashboard.planExpiry")}
            value={dashboardData.planExpiry}
            icon={<CalendarIcon />}
          >
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[11px] font-medium text-[#d5af42] sm:text-[12px]">
                ◷ {t("dashboard.renewable")}
              </span>

              <span className="text-[11px] text-[#85888d]">
                {t("dashboard.inTwelveMonths")}
              </span>
            </div>
          </StatCard>
        </div>
      </div>

      {/* =========================
    EXPENSES SECTION
========================== */}
      <section className="mt-7 lg:mt-9">
        <div>
          <h2 className="text-[20px] font-semibold text-[#f5f0e8] lg:text-[24px]">
            <span className="lg:hidden">{t("dashboard.recentExpenses")}</span>

            <span className="hidden lg:inline">{t("dashboard.expenses")}</span>
          </h2>

          <p className="mt-1 hidden text-[13px] text-[#999ca1] lg:block">
            {t("dashboard.expensesDescription")}
          </p>
        </div>

        {/* Desktop Dashboard filters only */}
        <div className="mt-6">
          <ExpenseFilters
            variant="dashboard"
            filters={filters}
            categories={categories}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Shared expense list */}
        <div className="mt-5">
          {expensesLoading && (
            <div className="mt-5 text-[14px] text-[#999ca1]">
              {t("dashboard.loadingExpenses")}
            </div>
          )}

          {!expensesLoading && expensesError && (
            <div className="mt-5 text-[14px] text-red-400">
              {t(expensesError)}
            </div>
          )}

          {!expensesLoading && !expensesError && (
            <div className="mt-4 lg:mt-5">
              <ExpenseList
                expenses={paginatedExpenses}
                totalExpenses={filteredExpenses.length}
                showPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onEdit={(expense) => {
                  setSelectedExpense(expense);
                }}
                onDelete={(expense) => {
                  setExpenseToDelete(expense);
                }}
              />
            </div>
          )}
        </div>
      </section>
      {selectedExpense && (
        <EditExpenseModal
          expense={selectedExpense}
          updating={updating}
          onClose={() => {
            if (!updating) {
              setSelectedExpense(null);
            }
          }}
          onUpdate={handleUpdateExpense}
        />
      )}
      {showUpdateSuccess && (
        <ExpenseUpdateSuccessModal
          onClose={() => {
            setShowUpdateSuccess(false);
          }}
        />
      )}
      {expenseToDelete && (
        <DeleteExpenseModal
          expense={expenseToDelete}
          deleting={deleting}
          onClose={() => {
            if (!deleting) {
              setExpenseToDelete(null);
            }
          }}
          onConfirm={handleDeleteExpense}
        />
      )}
      {showDeleteSuccess && (
        <ExpenseDeleteSuccessModal
          onClose={() => {
            setShowDeleteSuccess(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}

function formatAccountDate(date) {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function cleanText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function translateStatus(t, value) {
  const key = String(value || "")
    .trim()
    .toLowerCase();
  const keys = {
    active: "status.active",
    inactive: "status.inactive",
    plan_expired: "status.planExpired",
    banned: "status.banned",
  };
  return keys[key] ? t(keys[key]) : value || "-";
}

function translatePlan(t, value) {
  const key = String(value || "")
    .trim()
    .toLowerCase();
  const keys = {
    free: "plans.free",
    standard: "plans.standard",
    pro: "plans.pro",
  };
  return keys[key] ? t(keys[key]) : value || "-";
}

export default DashboardPage;
