import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyBookings, cancelBooking } from "../api/bookings.api";
import { useToast } from "../hooks/useToast";
import { getErrorMessage } from "../lib/errors";
import { formatDateTime, formatCurrency } from "../lib/formatters";
import Spinner from "../components/ui/Spinner";
import type { BookingStatus } from "../types/enums";

interface StatusInfo {
  label: string;
  color: string;
}

const statusConfig: Record<BookingStatus, StatusInfo> = {
  Confirmed: {
    label: "Confirmed",
    color: "bg-green-100 text-green-700",
  },
  PendingPayment: {
    label: "Pending Payment",
    color: "bg-amber-100 text-amber-700",
  },
  Cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
  },
  Expired: {
    label: "Expired",
    color: "bg-gray-100 text-gray-600",
  },
  Refunded: {
    label: "Refunded",
    color: "bg-blue-100 text-blue-700",
  },
};

export default function MyBookingsPage() {
  const [page, setPage] = useState(1);
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();
  const toast = useToast();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["my-bookings", page],
    queryFn: () => getMyBookings({ PageNumber: page, PageSize: 10 }),
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelBooking(cancelId!, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      setCancelId(null);
      setReason("");
      toast.success("Booking cancelled successfully.");
    },
    onError: (err: unknown) => toast.error(getErrorMessage(err)),
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage your flight bookings
        </p>
      </div>

      {data?.items?.length === 0 ? (
        <div className="card p-16 text-center">
          <p className="text-5xl mb-4">✈</p>
          <h2 className="text-lg font-semibold text-gray-900">
            No bookings yet
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            You have not made any flight bookings.
          </p>
          <Link to="/search" className="btn-primary mt-6">
            Search Flights
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {data?.items?.map((booking) => (
            <div
              key={booking.id}
              className="card p-5 hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-base font-bold text-primary-600">
                      {booking.bookingReference}
                    </span>
                    <span
                      className={
                        "badge " +
                        statusConfig[booking.status].color
                      }
                    >
                      {statusConfig[booking.status].label}
                    </span>
                    <span className="badge bg-gray-100 text-gray-600">
                      {booking.tripType}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {booking.segments?.map((seg, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <span className="font-medium text-gray-900">
                          {seg.originIata}
                        </span>
                        <span className="text-gray-400">✈</span>
                        <span className="font-medium text-gray-900">
                          {seg.destinationIata}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {formatDateTime(seg.departureTime)}
                        </span>
                        <span className="badge bg-primary-50 text-primary-700">
                          {seg.seatClass}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>
                      {booking.passengers?.length ?? 0} passenger
                      {(booking.passengers?.length ?? 0) > 1 ? "s" : ""}
                    </span>
                    <span>Booked {formatDateTime(booking.createdAt)}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <p className="text-lg font-bold text-primary-600">
                    {formatCurrency(
                      booking.totalAmount,
                      booking.currencyCode ?? "USD"
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {booking.status === "PendingPayment" && (
                      <button
                        onClick={() =>
                          navigate("/payment?bookingId=" + booking.id)
                        }
                        className="btn-primary h-8 px-3 text-xs"
                      >
                        Pay Now
                      </button>
                    )}
                    {booking.status === "Confirmed" && (
                      <Link
                        to={
                          "/booking-confirmation?bookingId=" + booking.id
                        }
                        className="btn-outline h-8 px-3 text-xs"
                      >
                        View Tickets
                      </Link>
                    )}
                    {(booking.status === "Confirmed" ||
                      booking.status === "PendingPayment") && (
                      <button
                        onClick={() => setCancelId(booking.id)}
                        className="h-8 rounded-lg border border-red-200 px-3 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(data?.totalPages ?? 1) > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {data?.pageNumber} of {data?.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={!data?.hasPreviousPage}
              className="btn-secondary h-8 px-3 text-xs disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data?.hasNextPage}
              className="btn-secondary h-8 px-3 text-xs disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {cancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="card w-full max-w-sm p-6">
            <h2 className="text-base font-semibold text-gray-900">
              Cancel Booking?
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              This action cannot be undone.
            </p>
            <div className="mt-4">
              <label className="label">Reason (optional)</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="input-field"
                placeholder="e.g. Change of plans"
              />
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => {
                  setCancelId(null);
                  setReason("");
                }}
                className="btn-secondary"
              >
                Keep Booking
              </button>
              <button
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {cancelMutation.isPending ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}