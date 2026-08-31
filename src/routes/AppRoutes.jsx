import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import ExpensesPage from "../pages/expenses/ExpensesPage";
import AccountPage from "../pages/account/AccountPage";
import GroupPage from "../pages/group/GroupPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/expenses" element={<ExpensesPage />} />

        <Route path="/account" element={<AccountPage />} />

        <Route path="/group" element={<GroupPage />} />
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
