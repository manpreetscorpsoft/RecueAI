import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ExpensesPage from "../pages/expenses/ExpensesPage";
import AccountPage from "../pages/account/AccountPage";
import GroupPage from "../pages/group/GroupPage";
import AuthGuard from "../components/auth/AuthGuard";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route element={<AuthGuard />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/group" element={<GroupPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
