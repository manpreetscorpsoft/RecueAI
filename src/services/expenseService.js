import { supabase } from "../lib/supabase";

/* ========================================================= 
   GET USER EXPENSES 
========================================================= */

export async function getUserExpenses(userId, page = 1, search = "") {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const requestedPage = Number(page);
  if (!Number.isSafeInteger(requestedPage) || requestedPage < 1) {
    throw new Error("Page must be a positive integer");
  }

  const params = {
    p_user_id: Number(userId),
    p_page: requestedPage,
    p_search: search.trim(),
  };
  const { data, error } = await supabase.rpc("svc_get_user_expenses", params);

  if (error) {
    console.error("Get user expenses error:");
    throw error;
  }

  // RPCs may return the JSON object directly or as a single result row.
  const response = Array.isArray(data) && data.length === 1 && Array.isArray(data[0]?.expenses)
    ? data[0]
    : data;
  if (response?.success === false) {
    throw new Error("Unable to load expenses");
  }
  const expenses = response?.expenses;
  if (!Array.isArray(expenses)) {
    throw new Error("Invalid expenses response");
  }

  const totalExpense = Number(response.total_expense);
  if (response.total_expense == null || response.total_expense === "" ||
      !Number.isSafeInteger(totalExpense) || totalExpense < 0) {
    throw new Error("Invalid total expense count");
  }
  const reportedSize = Number(response.page_size);
  const pageSize = Number.isSafeInteger(reportedSize) && reportedSize > 0 ? reportedSize : 10;
  const totalPages = Math.ceil(totalExpense / pageSize);
  const reportedPage = Number(response.page_no ?? requestedPage);
  if (!Number.isSafeInteger(reportedPage) || reportedPage < 1 ||
      (requestedPage <= Math.max(1, totalPages) && reportedPage !== requestedPage)) {
    throw new Error("Expense response does not match the requested page");
  }


  const mappedExpenses = expenses.map((expense) => ({
    /* Expense ID */
    id: expense.e_id,

    /* Purchase Date */
    date: formatExpenseDate(expense.purchase_date),

    /* 
      Keep raw purchase date because 
      EditExpenseModal may require YYYY-MM-DD 
    */
    purchaseDate: expense.purchase_date || "",

    /* Submission / Creation Date */
    submissionDate: formatExpenseDate(expense.created_at),
    submissionDateRaw: expense.created_at || "",

    /* Supplier */
    supplier: expense.supplier || "-",

    /* Category */
    category: expense.category || "-",

    /* Formatted Amount */
    amount: formatExpenseAmount(expense.amount_fcfa, expense.currency_sign),

    /* Raw Amount */
    rawAmount: expense.amount_fcfa,

    /* Currency Code */
    currency: expense.currency || "",

    /* Currency Symbol */
    currencySign: expense.currency_sign || "",

    /* Description */
    description: expense.description || "",

    /* Receipt */
    receiptUrl: expense.receipt_url || null,

    receiptDriveId: expense.receipt_drive_id || null,

    receiptItemId: expense.receipt_item_id || null,

    /* Group */
    groupId: expense.group_id,

    /* User */
    userId: expense.user_id,

    /* Preserve the expense owner's phone, including country code and leading zeros. */
    phone: [expense.phone_number, expense.phone]
      .filter((value) => typeof value === "string" || typeof value === "number")
      .map((value) => String(value).trim())
      .find(Boolean) || "",
  }));

  return {
    ...response,
    expenses: mappedExpenses,
    page_no: reportedPage,
    page_size: pageSize,
    total_pages: totalPages,
    total_expense: totalExpense,
    page_elements: mappedExpenses.length,
    has_next_page: reportedPage < totalPages,
    has_previous_page: reportedPage > 1 && totalExpense > 0,
  };
}

// Fetch all search matches for local filters and CSV export.
export async function getAllUserExpenses(userId, search = "") {
  const first = await getUserExpenses(userId, 1, search);
  const expenses = [...first.expenses];
  for (let page = 2; page <= first.total_pages; page += 1) {
    const result = await getUserExpenses(userId, page, search);
    expenses.push(...result.expenses);
  }
  return { ...first, expenses };
}

/* ========================================================= 
   FORMAT DATE 
========================================================= */

function formatExpenseDate(date) {
  if (!date) {
    return "-";
  }

  /* 
    Handles:

    2026-09-05

    2026-09-05T08:25:31.123+00:00

    2026-09-05 08:25:31.123+00
  */

  const value = String(date);

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!match) {
    return value;
  }

  const [, year, month, day] = match;

  return `${day}/${month}/${year}`;
}

/* ========================================================= 
   FORMAT AMOUNT 
========================================================= */

function formatExpenseAmount(amount, currencySign) {
  if (amount === null || amount === undefined) {
    return "-";
  }

  const formattedAmount = Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  if (currencySign) {
    return `${currencySign}${formattedAmount}`;
  }

  return formattedAmount;
}

/* ========================================================= 
   UPDATE EXPENSE 
========================================================= */

export async function updateExpense({
  expenseId,
  purchaseDate,
  amount,
  category,
  supplier,
  description,
  currency,
}) {
  if (!expenseId) {
    throw new Error("Expense ID is required");
  }

  const { data, error } = await supabase.rpc("svc_update_expense", {
    p_expense_id: expenseId,

    p_purchase_date: purchaseDate,

    p_amount_fcfa: Number(amount),

    p_category: category,

    p_supplier: supplier,

    p_description: description || "",

    p_currency: currency,
  });

  if (error) {
    console.error("Update expense error:");

    throw error;
  }

  return data;
}

/* ========================================================= 
   DELETE EXPENSE 
========================================================= */

export async function deleteExpense(expenseId) {
  if (!expenseId) {
    throw new Error("Expense ID is required");
  }

  const { data, error } = await supabase.rpc("svc_delete_expense", {
    p_expense_id: expenseId,
  });


  if (error) {
    console.error("Delete expense RPC error:");
    throw error;
  }

  if (!data || data.success !== true) {
    throw new Error("Expense was not deleted");
  }

  return data;
}

/* ========================================================= 
   LOGOUT USER 
========================================================= */

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:");

    throw error;
  }

  localStorage.removeItem("user");

  return {
    success: true,
  };
}
/* =========================================================
   BULK DELETE EXPENSES
========================================================= */

export async function bulkDeleteExpenses(expenseIds) {
  if (!Array.isArray(expenseIds) || expenseIds.length === 0) {
    throw new Error("At least one expense ID is required");
  }

  const cleanExpenseIds = expenseIds
    .map((id) => Number(id))
    .filter((id) => Number.isInteger(id) && id > 0);

  if (cleanExpenseIds.length === 0) {
    throw new Error("No valid expense IDs were provided");
  }

  const { data, error } = await supabase.rpc("svc_bulk_delete_expenses", {
    p_expense_ids: cleanExpenseIds,
  });


  if (error) {
    console.error("Bulk delete RPC error:");
    throw error;
  }

  if (!data || data.success !== true) {
    throw new Error("Expenses were not deleted");
  }

  return data;
}
