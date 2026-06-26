import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBookingById } from "../api/bookings.api";
import { getTicketsByBooking } from "../api/tickets.api";
import Spinner from "../components/ui/Spinner";
import { formatDateTime, formatCurrency } from "../lib/formatters";

export default function BookingConfirmationPage() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId") ?? "";

  const { data: booking, isLoading: bookingLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBookingById(bookingId),
    enabled: !!bookingId,
  });

  const { data: tickets, isLoading: ticketsLoading } = useQuery({
    queryKey: ["tickets", bookingId],
    queryFn: () => getTicketsByBooking(bookingId),
    enabled: !!bookingId,
  });

  if (bookingLoading || ticketsLoading) return <Spinner />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900">
          Booking Confirmed!
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Your booking reference is{" "}
          <strong className="text-primary-600 text-base">
            {booking?.bookingReference}
          </strong>
        </p>
      </div>

      <div className="card p-5 mb-5">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">
          Booking Details
        </h2>
        <div className="space-y-3">
          {booking?.segments?.map((seg, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {seg.originIata} to {seg.destinationIata}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDateTime(seg.departureTime)} •{" "}
                  {seg.seatClass}
                </p>
              </div>
              <p className="text-sm font-semibold text-primary-600">
                {formatCurrency(seg.segmentTotal)}
              </p>
            </div>
          ))}
          <div className="flex justify-between border-t border-gray-100 pt-3">
            <span className="text-sm font-semibold">Total Paid</span>
            <span className="text-base font-bold text-primary-600">
              {formatCurrency(booking?.totalAmount ?? 0)}
            </span>
          </div>
        </div>
      </div>

      {tickets && tickets.length > 0 && (
        <div className="card p-5 mb-5">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">
            Your Tickets
          </h2>
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {ticket.passengerName}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Ticket: {ticket.ticketNumber} •{" "}
                    {ticket.seatNumber
                      ? "Seat " + ticket.seatNumber
                      : "No seat assigned"}
                  </p>
                </div>
                <Link
                  to={"/tickets/" + ticket.ticketNumber}
                  className="btn-outline h-8 px-3 text-xs"
                >
                  View Ticket
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link to="/my-bookings" className="btn-primary flex-1 text-center">
          View All Bookings
        </Link>
        <Link to="/" className="btn-secondary flex-1 text-center">
          Back to Home
        </Link>
      </div>
    </div>
  );
}