import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold text-navy-800 hover:text-primary-600 transition-colors duration-150"
        >
          <span className="text-2xl">✈</span>
          <span>AirplaneSystem</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {[
            { to: "/", label: "Home", end: true },
            { to: "/search", label: "Search Flights", end: false },
            ...(isAuthenticated
              ? [{ to: "/my-bookings", label: "My Bookings", end: false }]
              : []),
            ...(user?.role === "Agent"
              ? [{ to: "/agent", label: "Agent Panel", end: false }]
              : []),
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                "px-3 py-2 rounded-lg text-sm font-medium leading-none transition-all duration-150 " +
                (isActive
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-150"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
                  {user?.fullName?.charAt(0) ?? "U"}
                </div>
                <span className="leading-none">{user?.fullName}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn-secondary h-8 px-3 text-xs"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary h-9">
                Login
              </Link>
              <Link to="/register" className="btn-primary h-9">
                Register
              </Link>
            </div>
          )}
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-150 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="text-xl text-gray-600">
            {menuOpen ? "✕" : "☰"}
          </span>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {[
              { to: "/", label: "Home" },
              { to: "/search", label: "Search Flights" },
              ...(isAuthenticated
                ? [{ to: "/my-bookings", label: "My Bookings" }]
                : []),
              ...(user?.role === "Agent"
                ? [{ to: "/agent", label: "Agent Panel" }]
                : []),
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="mt-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-150"
              >
                Logout
              </button>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  className="btn-secondary h-9 flex-1 text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary h-9 flex-1 text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}