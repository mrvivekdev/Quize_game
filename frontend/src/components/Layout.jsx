import { Outlet, useLocation, NavLink } from "react-router-dom";
import Header from "./Header";
import { Home, Search, User } from "lucide-react";

export default function Layout() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";
  const isSuccessPage = location.pathname === "/success";
  const isHideHeader = isLandingPage || isSuccessPage;
  const isHideFooter = isLandingPage || isSuccessPage;

  return (
    <div className="min-h-screen bg-[#eaebff] flex justify-center font-sans text-[#2d2747] overflow-x-hidden">
      <div
        className={`w-full max-w-[450px] bg-[#6a5ae0] min-h-screen shadow-2xl flex flex-col relative ${!isHideFooter ? "pb-16" : ""}`}
        style={{
          backgroundImage: 'url("https://images.thopquiz.com/thq/bodyBg.png")',
          backgroundRepeat: "repeat-y",
          backgroundSize: "100% auto",
        }}
      >
        {!isHideHeader && <Header />}
        <main
          className={`flex-grow w-full px-4 ${isHideHeader ? "py-8" : "py-4"}`}
        >
          <Outlet />
        </main>

        {/* Bottom Navigation */}
        {!isHideFooter && (
          <nav className="fixed bottom-0 w-full max-w-[450px] bg-[#6a5ae0] border-t border-white/10 flex justify-around items-center py-2 z-50 shadow-[0_-4px_15px_rgba(0,0,0,0.1)]">
            <NavLink
              to="/explore"
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 ${isActive ? "text-white" : "text-white/60"}`
              }
            >
              <Home className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Home
              </span>
            </NavLink>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 ${isActive ? "text-white" : "text-white/60"}`
              }
            >
              <div className={`rounded-lg p-1.5 shadow-lg -mt-8 mb-1 border-4 border-[#6a5ae0] transition-colors ${location.pathname === "/search" ? "bg-white text-[#6a5ae0]" : "bg-white text-gray-400"}`}>
                <Search className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Search
              </span>
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 ${isActive ? "text-white" : "text-white/60"}`
              }
            >
              <User className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Profile
              </span>
            </NavLink>
          </nav>
        )}
      </div>
    </div>
  );
}
