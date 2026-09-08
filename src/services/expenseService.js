import { supabase } from "../lib/supabase";

/* ========================================================= 
   GET USER EXPENSES 
========================================================= */

export async function getUserExpenses(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  console.log("Loading expenses for user:", userId);

  const { data, error } = await supabase.rpc("svc_get_user_expenses", {
    p_user_id: Number(userId),
  });

  if (error) {
    console.error("Get user expenses error:", error);
    throw error;
  }

  /* 
    svc_get_user_expenses returns: 
 
    { 
      success: true, 
      user_id: ..., 
      expenses: [...] 
    } 
  */

  const expenses = Array.isArray(data) ? data : data?.expenses || [];

  if (!Array.isArray(expenses)) {
    console.error("Expenses response is not an array:", expenses);

    return [];
  }

  return expenses.map((expense) => ({
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
  }));
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
    console.error("Update expense error:", error);

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

  console.log("Delete expense response:", data);
  console.log("Delete expense error:", error);

  if (error) {
    console.error("Delete expense RPC error:", error);
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
    console.error("Logout error:", error);

    throw error;
  }

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

  console.log("Bulk delete response:", data);
  console.log("Bulk delete error:", error);

  if (error) {
    console.error("Bulk delete RPC error:", error);
    throw error;
  }

  if (!data || data.success !== true) {
    throw new Error("Expenses were not deleted");
  }

  return data;
}
