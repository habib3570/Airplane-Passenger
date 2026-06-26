import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <p className="text-7xl font-bold text-primary-100">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-gray-500 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to Home
      </Link>
    </div>
  );
}