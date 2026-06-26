import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getMyBookings, cancelBooking } from "../api/bookings.api";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { getErrorMessage } from "../lib/errors";
import { formatDateTime, formatCurrency } from "../lib/formatters";
import Spinner from "../components/ui/Spinner";
import type { BookingStatus } from "../types/enums";

const statusConfig: Record<BookingStatus, { label: string; color: string }> = {
  Confirmed: { label: "Confirmed", color: "bg-green-100 text-green-700" },
  PendingPayment: {
    label: "Pending Payment",
    color: "bg-amber-100 text-amber-700",
  },
  Cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
  Expired: { label: "Expired", color: "bg-gray-100 text-gray-600" },
  Refunded: { label: "Refunded", color: "bg-blue-100 text-blue-700" },
};

export default function AgentPage() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["agent-bookings", page, search],
    queryFn: () =>
      getMyBookings({
        PageNumber: page,
        PageSize: 15,
        SearchTerm: search,
      }),
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelBooking(cancelId!, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["agent-bookings"] });
      setCancelId(null);
      setReason("");
      toast.success("Booking cancelled.");
    },
    onError: (err: unknown) => toast.error(getErrorMessage(err)),
  });

  if (user?.role !== "Agent") {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-4xl mb-4">🚫</p>
        <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
        <p className="mt-2 text-sm text-gray-500">
          This page is for agents only.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Agent Panel</h1>
          <span className="badge bg-primary-100 text-primary-700">
            Agent
          </span>
        </div>
        <p className="text-sm text-gray-500">
          Welcome, {user?.fullName}. Manage passenger bookings below.
        </p>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-primary-600">
            {data?.totalCount ?? 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Bookings</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {data?.items?.filter((b) => b.status === "Confirmed").length ?? 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">Confirmed</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">
            {data?.items?.filter((b) => b.status === "PendingPayment")
              .length ?? 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">Pending Payment</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
          <h2 className="text-sm font-semibold text-gray-900">
            All Bookings
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search bookings..."
                className="input-field h-8 pl-9 w-48 text-xs"
              />
            </div>
            <button
              onClick={() => navigate("/search")}
              className="btn-primary h-8 px-3 text-xs"
            >
              + New Booking
            </button>
          </div>
        </div>

        {isLoading ? (
          <Spinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-th">Reference</th>
                  <th className="table-th">Route</th>
                  <th className="table-th">Passengers</th>
                  <th className="table-th">Amount</th>
                  <th className="table-th">Status</th>
                  <th className="table-th">Booked</th>
                  <th className="table-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.items?.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="table-td text-center text-gray-400 py-10"
                    >
                      No bookings found.
                    </td>
                  </tr>
                )}
                {data?.items?.map((b) => (
                  <tr
                    key={b.id}
                    className="table-row-hover"
                  >
                    <td className="table-td font-medium text-primary-600">
                      {b.bookingReference}
                    </td>
                    <td className="table-td">
                      {b.segments?.map((s, i) => (
                        <span key={i} className="block text-xs">
                          {s.originIata} to {s.destinationIata}
                        </span>
                      ))}
                    </td>
                    <td className="table-td text-center">
                      {b.passengers?.length ?? 0}
                    </td>
                    <td className="table-td font-medium">
                      {formatCurrency(
                        b.totalAmount,
                        b.currencyCode ?? "USD"
                      )}
                    </td>
                    <td className="table-td">
                      <span
                        className={
                          "badge " + statusConfig[b.status].color
                        }
                      >
                        {statusConfig[b.status].label}
                      </span>
                    </td>
                    <td className="table-td text-gray-400 text-xs">
                      {formatDateTime(b.createdAt)}
                    </td>
                    <td className="table-td">
                      <div className="flex gap-2">
                        {b.status === "PendingPayment" && (
                          <button
                            onClick={() =>
                              navigate("/payment?bookingId=" + b.id)
                            }
                            className="text-xs text-primary-600 hover:underline"
                          >
                            Pay
                          </button>
                        )}
                        {b.status === "Confirmed" && (
                          <button
                            onClick={() =>
                              navigate(
                                "/booking-confirmation?bookingId=" + b.id
                              )
                            }
                            className="text-xs text-primary-600 hover:underline"
                          >
                            Tickets
                          </button>
                        )}
                        {(b.status === "Confirmed" ||
                          b.status === "PendingPayment") && (
                          <button
                            onClick={() => setCancelId(b.id)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {(data?.totalPages ?? 1) > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
                <p className="text-xs text-gray-500">
                  Page {data?.pageNumber} of {data?.totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={!data?.hasPreviousPage}
                    className="btn-secondary h-7 px-3 text-xs disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!data?.hasNextPage}
                    className="btn-secondary h-7 px-3 text-xs disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

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
                placeholder="e.g. Passenger request"
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
                Keep
              </button>
              <button
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {cancelMutation.isPending ? "Cancelling..." : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}