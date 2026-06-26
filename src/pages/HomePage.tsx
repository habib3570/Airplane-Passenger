import { Link } from "react-router-dom";
import FlightSearchForm from "../components/search/FlightSearchForm";

const features = [
  {
    icon: "🔍",
    title: "Smart Search",
    desc: "Search one-way, round-trip or multi-city flights in seconds.",
  },
  {
    icon: "💺",
    title: "Seat Selection",
    desc: "Pick your preferred seat — window, aisle or extra legroom.",
  },
  {
    icon: "💳",
    title: "Secure Payment",
    desc: "Pay safely with Stripe. Your data is always protected.",
  },
  {
    icon: "📱",
    title: "Digital Tickets",
    desc: "Download your ticket and boarding pass anytime, anywhere.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-primary-700 py-16 px-4 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Fly Anywhere,{" "}
            <span className="text-primary-300">Anytime</span>
          </h1>
          <p className="mt-4 text-base text-navy-200">
            Search and book flights worldwide at the best prices.
          </p>
        </div>
        <div className="mx-auto mt-8 max-w-4xl">
          <FlightSearchForm />
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-10">
            Why Choose AirplaneSystem?
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="card-hover p-5 text-center"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary-50">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Ready to take off?
          </h2>
          <p className="mt-3 text-sm text-gray-500">
            Join thousands of travelers who book with AirplaneSystem every day.
          </p>
          <Link to="/search" className="btn-primary mt-6 h-11 px-8 text-base">
            Book a Flight Now
          </Link>
        </div>
      </section>
    </div>
  );
}