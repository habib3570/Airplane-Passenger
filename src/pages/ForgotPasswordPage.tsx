import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/auth.api";
import { useToast } from "../hooks/useToast";
import { getErrorMessage } from "../lib/errors";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const toast = useToast();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await forgotPassword(email);
      setSent(true);
      toast.success("Reset link sent! Check your email.");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-2xl font-bold text-navy-800"
          >
            <span>✈</span>
            <span>AirplaneSystem</span>
          </Link>
          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Forgot your password?
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter your email and we will send you a reset link.
          </p>
        </div>

        <div className="card p-6">
          {sent ? (
            <div className="text-center">
              <div className="text-4xl mb-4">📧</div>
              <h2 className="text-base font-semibold text-gray-900">
                Check your inbox
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                We sent a password reset link to{" "}
                <strong>{email}</strong>.
              </p>
              <Link to="/login" className="btn-primary mt-5 w-full">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
              <div className="text-center text-sm text-gray-500">
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}