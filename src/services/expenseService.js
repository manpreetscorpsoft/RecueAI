import { supabase } from "../lib/supabase";

export async function getUserExpenses(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data, error } = await supabase.rpc("svc_get_user_expenses", {
    p_user_id: userId,
  });
  if (error) {
    console.error("Get user expenses error:", error);
    throw error;
  }

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((expense) => ({
    id: expense.e_id,

    date: formatExpenseDate(expense.purchase_date),
    purchaseDate: expense.purchase_date,

    supplier: expense.supplier || "-",
    category: expense.category || "-",

    amount: formatExpenseAmount(expense.amount_fcfa, expense.currency_sign),

    rawAmount: expense.amount_fcfa,

    currency: expense.currency || "",
    currencySign: expense.currency_sign || "",

    description: expense.description || "",

    receiptUrl: expense.receipt_url || null,
    receiptDriveId: expense.receipt_drive_id || null,
    receiptItemId: expense.receipt_item_id || null,

    groupId: expense.group_id,
    userId: expense.user_id,
  }));
}

function formatExpenseDate(date) {
  if (!date) return "-";

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}/${year}`;
}

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

export async function deleteExpense(expenseId) {
  if (!expenseId) {
    throw new Error("Expense ID is required");
  }

  const { data, error } = await supabase.rpc("svc_delete_expense", {
    p_expense_id: expenseId,
  });

  if (error) {
    console.error("Delete expense error:", error);
    throw error;
  }

  return data;
}
