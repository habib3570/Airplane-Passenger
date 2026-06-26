import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getBookingById,
  createPaymentIntent,
  confirmPayment,
} from "../api/bookings.api";
import Spinner from "../components/ui/Spinner";
import { useToast } from "../hooks/useToast";
import { getErrorMessage } from "../lib/errors";
import { formatCurrency } from "../lib/formatters";

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const bookingId = searchParams.get("bookingId") ?? "";

  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const { data: booking, isLoading: bookingLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBookingById(bookingId),
    enabled: !!bookingId,
  });

  const intentMutation = useMutation({
    mutationFn: () => createPaymentIntent(bookingId),
    onSuccess: (result) => {
      setPaymentIntentId(result.paymentIntentId);
      toast.info("Payment session ready.");
    },
    onError: (err: unknown) => toast.error(getErrorMessage(err)),
  });

  useEffect(() => {
    if (booking && booking.status === "PendingPayment") {
      intentMutation.mutate();
    }
  }, [booking]);

  const confirmMutation = useMutation({
    mutationFn: () => confirmPayment(paymentIntentId),
    onSuccess: () => {
      toast.success("Payment successful! Your booking is confirmed.");
      navigate("/booking-confirmation?bookingId=" + bookingId);
    },
    onError: (err: unknown) => toast.error(getErrorMessage(err)),
  });

  function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!paymentIntentId) {
      toast.error("Payment session not ready. Please wait.");
      return;
    }
    confirmMutation.mutate();
  }

  if (!bookingId) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-sm text-gray-500">No booking found.</p>
      </div>
    );
  }

  if (bookingLoading) return <Spinner />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="section-title mb-2">Complete Payment</h1>
      <p className="mb-6 text-sm text-gray-500">
        Booking Ref:{" "}
        <strong className="text-gray-900">
          {booking?.bookingReference}
        </strong>
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">
            Order Summary
          </h2>
          <div className="space-y-3">
            {booking?.segments?.map((seg, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {seg.originIata} to {seg.destinationIata}
                  <span className="ml-1 text-xs text-gray-400">
                    ({seg.seatClass})
                  </span>
                </span>
                <span className="font-medium">
                  {formatCurrency(seg.segmentTotal)}
                </span>
              </div>
            ))}
            {booking && booking.discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Discount</span>
                <span className="font-medium text-green-600">
                  -{formatCurrency(booking.discountAmount)}
                </span>
              </div>
            )}
            <div className="border-t border-gray-100 pt-3 flex justify-between">
              <span className="text-sm font-semibold text-gray-900">
                Total
              </span>
              <span className="text-lg font-bold text-primary-600">
                {formatCurrency(booking?.totalAmount ?? 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">
            Card Details
          </h2>
          {intentMutation.isPending ? (
            <Spinner />
          ) : (
            <form onSubmit={handlePay} className="space-y-3">
              <div>
                <label className="label">Name on Card</label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="label">Card Number</label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) =>
                    setCardNumber(
                      e.target.value
                        .replace(/\D/g, "")
                        .replace(/(\d{4})/g, "$1 ")
                        .trim()
                        .slice(0, 19)
                    )
                  }
                  className="input-field font-mono"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Expiry</label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "");
                      setExpiry(
                        v.length >= 2 ? v.slice(0, 2) + "/" + v.slice(2, 4) : v
                      );
                    }}
                    className="input-field font-mono"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="label">CVV</label>
                  <input
                    type="password"
                    required
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    className="input-field font-mono"
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
                This is a demo payment form. No real charges will be made.
              </div>
              <button
                type="submit"
                disabled={
                  confirmMutation.isPending || !paymentIntentId
                }
                className="btn-primary w-full"
              >
                {confirmMutation.isPending
                  ? "Processing..."
                  : "Pay " + formatCurrency(booking?.totalAmount ?? 0)}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}