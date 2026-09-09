import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ExpenseFilters from "../../components/layout/expenses/ExpenseFilters";
import ExpenseList from "../../components/layout/expenses/ExpenseList";
import EditExpenseModal from "../../components/layout/expenses/EditExpenseModal";
import ExpenseUpdateSuccessModal from "../../components/layout/expenses/ExpenseUpdateSuccessModal";
import BulkDeleteConfirmModal from "../../components/layout/expenses/BulkDeleteConfirmModal";
import {
  getUserExpenses,
  updateExpense,
  deleteExpense,
  bulkDeleteExpenses,
} from "../../services/expenseService";

import { getUserFullDetails } from "../../services/userService";
import DeleteExpenseModal from "../../components/layout/expenses/DeleteExpenseModal";
import ExpenseDeleteSuccessModal from "../../components/layout/expenses/ExpenseDeleteSuccessModal";
import { applyUserLanguage } from "../../i18n/i18n";
import { useTranslation } from "react-i18next";

function ExpensesPage() {
  const { t } = useTranslation();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const userId = storedUser.user_id;

  /* =====================================================
     STATE
  ===================================================== */

  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [accountData, setAccountData] = useState(null);

  const [selectedExpense, setSelectedExpense] = useState(null);

  const [updating, setUpdating] = useState(false);

  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const [deleting, setDeleting] = useState(false);

  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  const [bulkDeleting, setBulkDeleting] = useState(false);

  /* =====================================================
     BULK DELETE STATE
  ===================================================== */

  const [bulkDeleteMode, setBulkDeleteMode] = useState(false);

  const [selectedExpenseIds, setSelectedExpenseIds] = useState([]);

  const layoutRole = accountData?.layoutRole || "admin";

  /* =====================================================
     FILTER STATE
  ===================================================== */

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    fromDate: "",
    toDate: "",
    sortDate: "",
    sortPrice: "",
  });

  /* =====================================================
     CATEGORIES
  ===================================================== */

  const categories = useMemo(() => {
    return [
      ...new Set(expenses.map((expense) => expense.category).filter(Boolean)),
    ].sort();
  }, [expenses]);

  /* =====================================================
     FILTER EXPENSES
  ===================================================== */

  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // =========================
    // SEARCH SUPPLIER
    // =========================

    if (filters.search.trim()) {
      const searchValue = filters.search.trim().toLowerCase();

      result = result.filter((expense) =>
        String(expense.supplier || "")
          .toLowerCase()
          .includes(searchValue),
      );
    }

    // =========================
    // CATEGORY
    // =========================

    if (filters.category !== "all") {
      result = result.filter(
        (expense) => expense.category === filters.category,
      );
    }

    // =========================
    // FROM DATE
    // =========================

    if (filters.fromDate) {
      result = result.filter(
        (expense) =>
          expense.purchaseDate && expense.purchaseDate >= filters.fromDate,
      );
    }

    // =========================
    // TO DATE
    // =========================

    if (filters.toDate) {
      result = result.filter(
        (expense) =>
          expense.purchaseDate && expense.purchaseDate <= filters.toDate,
      );
    }

    // Show the latest submitted expense first unless a date sort is selected.
    if (!filters.sortDate) {
      result.sort(
        (a, b) =>
          new Date(b.submissionDateRaw || b.purchaseDate).getTime() -
          new Date(a.submissionDateRaw || a.purchaseDate).getTime(),
      );
    }

    // =========================
    // PRICE SORT
    // =========================

    if (filters.sortPrice === "low-high") {
      result.sort(
        (a, b) => Number(a.rawAmount || 0) - Number(b.rawAmount || 0),
      );
    }

    if (filters.sortPrice === "high-low") {
      result.sort(
        (a, b) => Number(b.rawAmount || 0) - Number(a.rawAmount || 0),
      );
    }

    // =========================
    // DATE SORT
    // =========================

    if (filters.sortDate === "newest") {
      result.sort(
        (a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate),
      );
    }

    if (filters.sortDate === "oldest") {
      result.sort(
        (a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate),
      );
    }

    return result;
  }, [expenses, filters]);

  /* =====================================================
     BULK DELETE TOGGLE
  ===================================================== */

  const handleToggleBulkDelete = () => {
    console.log("Bulk delete toggle clicked");

    setBulkDeleteMode((current) => {
      const next = !current;

      console.log("Bulk delete mode:", next);

      if (!next) {
        setSelectedExpenseIds([]);
      }

      return next;
    });
  };

  /* =====================================================
     BULK EXPENSE SELECTION
  ===================================================== */

  const handleToggleExpenseSelection = (expenseId) => {
    console.log("Expense checkbox clicked:", expenseId);

    setSelectedExpenseIds((current) => {
      if (current.includes(expenseId)) {
        return current.filter((id) => id !== expenseId);
      }

      return [...current, expenseId];
    });
  };

  /* =====================================================
     BULK DELETE
  ===================================================== */

  const handleBulkDeleteExpenses = () => {
    if (selectedExpenseIds.length === 0) {
      return;
    }

    setShowBulkDeleteConfirm(true);
  };

  const handleConfirmBulkDeleteExpenses = async () => {
    if (selectedExpenseIds.length === 0) {
      return;
    }

    try {
      setBulkDeleting(true);

      console.log("Bulk deleting expense IDs:", selectedExpenseIds);

      const result = await bulkDeleteExpenses(selectedExpenseIds);

      console.log("Bulk delete result:", result);

      if (result?.success) {
        // Close confirmation popup
        setShowBulkDeleteConfirm(false);

        // Clear selected expenses
        setSelectedExpenseIds([]);

        // Turn bulk-delete mode off
        setBulkDeleteMode(false);

        // Reload latest expenses
        await loadExpenses();
      }
    } catch (err) {
      console.error("Unable to bulk delete expenses:", err);
    } finally {
      setBulkDeleting(false);
    }
  };

  /* =====================================================
     PAGINATION
  ===================================================== */

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredExpenses.length / itemsPerPage),
  );

  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    const endIndex = startIndex + itemsPerPage;

    return filteredExpenses.slice(startIndex, endIndex);
  }, [filteredExpenses, currentPage]);

  const currentPageExpenseIds = paginatedExpenses
    .map((expense) => expense.id)
    .filter((id) => id !== null && id !== undefined);

  const allCurrentPageSelected =
    currentPageExpenseIds.length > 0 &&
    currentPageExpenseIds.every((id) => selectedExpenseIds.includes(id));
  /* =====================================================
     FILTER CHANGE
  ===================================================== */

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

    setCurrentPage(1);
  };

  /* =====================================================
     LOAD EXPENSES
  ===================================================== */

  const loadExpenses = async () => {
    try {
      setLoading(true);

      setError("");

      const data = await getUserExpenses(userId);

      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Unable to load expenses:", err);

      setError("expenses.loadError");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOAD ACCOUNT DETAILS
  ===================================================== */

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

        layoutRole:
          isGroupAccount && groupRole === "member" ? "member" : "admin",
      });
    } catch (err) {
      console.error("Unable to load account details:", err);
    }
  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    loadAccountDetails();

    loadExpenses();
  }, []);

  /* =====================================================
     UPDATE EXPENSE
  ===================================================== */

  const handleUpdateExpense = async (values) => {
    try {
      setUpdating(true);

      if (!values.currency) {
        throw new Error("Currency code is missing for this expense.");
      }

      await updateExpense(values);

      // Close Edit Expense modal
      setSelectedExpense(null);

      // Reload latest data from Supabase
      await loadExpenses();

      // Show success popup
      setShowUpdateSuccess(true);
    } catch (err) {
      console.error("Unable to update expense:", err);
    } finally {
      setUpdating(false);
    }
  };

  /* =====================================================
     EXPORT CSV
  ===================================================== */

  const handleExportCsv = () => {
    if (filteredExpenses.length === 0) {
      return;
    }

    const headers = [
      "Date",
      "Supplier",
      "Category",
      "Amount",
      "Currency",
      "Description",
      "Receipt URL",
    ];

    const rows = filteredExpenses.map((expense) => [
      expense.purchaseDate || "",

      expense.supplier || "",

      expense.category || "",

      expense.rawAmount ?? "",

      expense.currencySign || "",

      expense.description || "",

      expense.receiptUrl
        ? `=HYPERLINK("${String(expense.receiptUrl).replace(
            /"/g,
            '""',
          )}","View receipt")`
        : "",
    ]);

    const escapeCsvValue = (value, allowFormula = false) => {
      let text = String(value ?? "");

      // Prevent spreadsheet formula execution
      if (!allowFormula && /^[=+@]/.test(text)) {
        text = `'${text}`;
      }

      text = text.replace(/"/g, '""');

      return `"${text}"`;
    };

    const csvContent = [
      headers.map(escapeCsvValue).join(","),

      ...rows.map((row) =>
        row.map((value, index) => escapeCsvValue(value, index === 6)).join(","),
      ),
    ].join("\n");

    // UTF-8 BOM helps Excel display special characters correctly
    const blob = new Blob(["\uFEFF", csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    const today = new Date().toISOString().split("T")[0];

    link.href = url;

    link.download = `expenses_${today}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /* =====================================================
     SINGLE DELETE EXPENSE
  ===================================================== */

  const handleDeleteExpense = async () => {
    if (!expenseToDelete?.id) {
      return;
    }

    try {
      setDeleting(true);

      await deleteExpense(expenseToDelete.id);

      setExpenseToDelete(null);

      await loadExpenses();

      setShowDeleteSuccess(true);
    } catch (err) {
      console.error("Unable to delete expense:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleSelectAll = () => {
    if (currentPageExpenseIds.length === 0) {
      return;
    }

    setSelectedExpenseIds((current) => {
      const allSelected = currentPageExpenseIds.every((id) =>
        current.includes(id),
      );

      // Unselect only current page
      if (allSelected) {
        return current.filter((id) => !currentPageExpenseIds.includes(id));
      }

      // Select all current-page expenses
      // and preserve selections from other pages
      return [...new Set([...current, ...currentPageExpenseIds])];
    });
  };

  return (
    <DashboardLayout role={layoutRole} phone={accountData?.phone || ""}>
      {/* =========================
          PAGE HEADING
      ========================== */}

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
          {t("expenses.title")}
        </h1>

        <p
          className="
            mt-1.5
            text-[13px]
            text-[#999ca1]

            sm:text-[14px]
          "
        >
          {t("expenses.description")}
        </p>
      </div>

      {/* =========================
          FILTERS
      ========================== */}

      <div className="mt-6 lg:mt-10">
        <ExpenseFilters
          variant="expenses"
          filters={filters}
          categories={categories}
          onFilterChange={handleFilterChange}
          onExport={handleExportCsv}
          bulkDeleteMode={bulkDeleteMode}
          onToggleBulkDelete={handleToggleBulkDelete}
          selectedCount={selectedExpenseIds.length}
          onBulkDelete={handleBulkDeleteExpenses}
          allCurrentPageSelected={allCurrentPageSelected}
          currentPageExpenseCount={currentPageExpenseIds.length}
          onToggleSelectAll={handleToggleSelectAll}
        />
      </div>

      {/* =========================
          LOADING
      ========================== */}

      {loading && (
        <div className="mt-6 text-[14px] text-[#999ca1]">
          {t("expenses.loading")}
        </div>
      )}

      {/* =========================
          ERROR
      ========================== */}

      {!loading && error && (
        <div className="mt-6 text-[14px] text-red-400">{t(error)}</div>
      )}

      {/* =========================
          EXPENSE LIST
      ========================== */}

      {!loading && !error && (
        <div className="mt-5 lg:mt-10">
          <ExpenseList
            expenses={paginatedExpenses}
            totalExpenses={filteredExpenses.length}
            showPagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onEdit={(expense) => {
              setSelectedExpense(expense);
            }}
            onDelete={(expense) => {
              setExpenseToDelete(expense);
            }}
            /* =========================
                 BULK DELETE
              ========================== */

            bulkDeleteMode={bulkDeleteMode}
            selectedExpenseIds={selectedExpenseIds}
            onToggleExpenseSelection={handleToggleExpenseSelection}
          />
        </div>
      )}

      {/* =========================
          EDIT EXPENSE MODAL
      ========================== */}

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

      {/* =========================
          UPDATE SUCCESS MODAL
      ========================== */}

      {showUpdateSuccess && (
        <ExpenseUpdateSuccessModal
          onClose={() => {
            setShowUpdateSuccess(false);
          }}
        />
      )}

      {/* =========================
          DELETE CONFIRMATION MODAL
      ========================== */}

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

      {/* =========================
          DELETE SUCCESS MODAL
      ========================== */}

      {showDeleteSuccess && (
        <ExpenseDeleteSuccessModal
          onClose={() => {
            setShowDeleteSuccess(false);
          }}
        />
      )}

      {/* =========================
    BULK DELETE CONFIRMATION
========================== */}

      {showBulkDeleteConfirm && (
        <BulkDeleteConfirmModal
          count={selectedExpenseIds.length}
          deleting={bulkDeleting}
          onClose={() => {
            if (!bulkDeleting) {
              setShowBulkDeleteConfirm(false);
            }
          }}
          onConfirm={handleConfirmBulkDeleteExpenses}
        />
      )}
    </DashboardLayout>
  );
}

/* =========================================================
   CLEAN TEXT
========================================================= */

function cleanText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

export default ExpensesPage;
