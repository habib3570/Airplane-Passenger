import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-base font-bold text-navy-800">
              <span className="text-xl">✈</span>
              <span>AirplaneSystem</span>
            </div>
            <p className="mt-2 text-xs text-gray-500 leading-relaxed">
              Book flights worldwide with ease. Safe, fast and affordable.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/search", label: "Search Flights" },
                { to: "/my-bookings", label: "My Bookings" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-xs text-gray-500 hover:text-primary-600"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Account
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/login", label: "Login" },
                { to: "/register", label: "Register" },
                { to: "/profile", label: "Profile" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-xs text-gray-500 hover:text-primary-600"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Contact
            </h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li>admin@airsystem.com</li>
              <li>+1 (800) AIR-BOOK</li>
              <li>24/7 Customer Support</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          2024 AirplaneSystem. All rights reserved.
        </div>
      </div>
    </footer>
  );
}