import { useNavigate } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import MobileBottomNav from "./MobileBottomNav";

import { logoutUser } from "../services/expenseService";

function DashboardLayout({
  children,
  footer,
  role = "admin",
  phone = "+234 812 345 6789",
}) {
  const navigate = useNavigate();

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = async () => {
    try {
      await logoutUser();

      navigate("/login", {
        replace: true,
      });
    } catch {
      console.error("Unable to logout:");
    }
  };

  return (
    <div className="h-dvh overflow-hidden bg-[#0c1016] text-white lg:h-auto lg:min-h-dvh lg:overflow-visible">
      <div className="flex h-full min-h-0 lg:h-auto lg:min-h-dvh">

        {/* Desktop Sidebar */}
        <Sidebar
          role={role}
          onLogout={handleLogout}
        />

        {/* Main Application Area */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">

          {/* Header */}
          <Header
            role={role}
            phone={phone}
            onLogout={handleLogout}
          />

          {/* Main Content */}
          <main
            className="
              flex-1
              min-h-0
              overflow-x-hidden
              overflow-y-auto
              overscroll-y-contain
              lg:overflow-visible
              bg-[#0c1016]

              px-4
              pb-6
              pt-5

              sm:px-6
              sm:pt-6

              lg:px-10
              lg:pb-10
              lg:pt-10
            "
          >
            <div className="flex min-h-full w-full min-w-0 flex-col">
              <div className="min-w-0">{children}</div>
              {footer && (
                <div className="mt-auto w-full min-w-0 shrink-0 pt-6">
                  {footer}
                </div>
              )}
            </div>
          </main>

          {/* Keep navigation outside the scrolling content on mobile. */}
          <MobileBottomNav role={role} />
        </div>

      </div>
    </div>
  );
}

export default DashboardLayout;