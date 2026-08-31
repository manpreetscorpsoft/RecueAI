import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import MobileBottomNav from "./MobileBottomNav";

function DashboardLayout({
  children,
  role = "admin",
  phone = "+234 812 345 6789",
}) {
  return (
    <div className="min-h-dvh bg-[#0c1016] text-white">
      <div className="flex min-h-dvh">
        {/* Desktop Sidebar */}
        <Sidebar role={role} />

        {/* Main Application Area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <Header role={role} phone={phone} />

          {/* Main Content */}
          <main
            className="
              flex-1
              overflow-x-hidden
              bg-[#0c1016]

              px-4
              pb-24
              pt-5

              sm:px-6
              sm:pt-6

              lg:px-10
              lg:pb-10
              lg:pt-10
            "
          >
            <div className="w-full">{children}</div>
          </main>
        </div>

        {/* Mobile Navigation */}
        <MobileBottomNav role={role} />
      </div>
    </div>
  );
}

export default DashboardLayout;
