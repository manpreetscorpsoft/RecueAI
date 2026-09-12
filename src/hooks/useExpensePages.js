import { useCallback, useEffect, useRef, useState } from "react";
import { getAllUserExpenses, getUserExpenses } from "../services/expenseService";

export default function useExpensePages(userId, currentPage, setCurrentPage, localFiltering, errorKey, search = "") {
  const [data, setData] = useState({ expenses: [], total_expense: 0, total_pages: 1, page_size: 10 });
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestId = useRef(0);
  const [settledRequest, setSettledRequest] = useState(null);
  // Local filtering paginates the complete dataset without refetching each page.
  const requestedPage = localFiltering ? 1 : currentPage;

  const searchValue = search.trim();
  const requestKey = JSON.stringify([userId, requestedPage, localFiltering, searchValue]);

  const loadExpenses = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    setError("");
    try {
      const result = localFiltering
        ? await getAllUserExpenses(userId, searchValue)
        : await getUserExpenses(userId, requestedPage, searchValue);
      if (id !== requestId.current) return;
      const lastPage = Math.max(1, result.total_pages);
      if (!localFiltering && requestedPage > lastPage) {
        setCurrentPage(lastPage);
        return;
      }
      setData(result);
      setHasLoaded(true);
    } catch {
      if (id !== requestId.current) return;
      console.error("Unable to load expenses:");
      setError(errorKey);
    } finally {
      if (id === requestId.current) {
        setSettledRequest(requestKey);
        setLoading(false);
      }
    }
  }, [userId, requestedPage, localFiltering, setCurrentPage, errorKey, requestKey, searchValue]);

  useEffect(() => {
    // Schedule the fetch and invalidate responses after navigation/unmount.
    const timer = setTimeout(() => { void loadExpenses(); }, searchValue ? 300 : 0);
    return () => {
      clearTimeout(timer);
      requestId.current += 1;
    };
  }, [loadExpenses, searchValue]);

  return { hasLoaded, expenses: data.expenses, metadata: data, loading: loading || settledRequest !== requestKey, error, loadExpenses };
}
