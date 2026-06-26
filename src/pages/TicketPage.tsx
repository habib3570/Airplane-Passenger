import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getTicketByNumber,
  downloadTicket,
  downloadBoardingPass,
  checkIn,
} from "../api/tickets.api";
import Spinner from "../components/ui/Spinner";
import { useToast } from "../hooks/useToast";
import { getErrorMessage } from "../lib/errors";
import { formatDateTime } from "../lib/formatters";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function TicketPage() {
  const { ticketNumber } = useParams<{ ticketNumber: string }>();
  const toast = useToast();

  const { data: ticket, isLoading, refetch } = useQuery({
    queryKey: ["ticket", ticketNumber],
    queryFn: () => getTicketByNumber(ticketNumber!),
    enabled: !!ticketNumber,
  });

  const downloadMutation = useMutation({
    mutationFn: () => downloadTicket(ticketNumber!),
    onSuccess: (blob) => {
      downloadBlob(blob, "ticket-" + ticketNumber + ".pdf");
      toast.success("Ticket downloaded!");
    },
    onError: (err: unknown) => toast.error(getErrorMessage(err)),
  });

  const boardingPassMutation = useMutation({
    mutationFn: () => downloadBoardingPass(ticketNumber!),
    onSuccess: (blob) => {
      downloadBlob(blob, "boarding-pass-" + ticketNumber + ".pdf");
      toast.success("Boarding pass downloaded!");
    },
    onError: (err: unknown) => toast.error(getErrorMessage(err)),
  });

  const checkInMutation = useMutation({
    mutationFn: () => checkIn(ticketNumber!),
    onSuccess: () => {
      toast.success("Check-in successful!");
      void refetch();
    },
    onError: (err: unknown) => toast.error(getErrorMessage(err)),
  });

  if (isLoading) return <Spinner />;

  if (!ticket) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-sm text-gray-500">Ticket not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <div className="card overflow-hidden">
        <div className="bg-gradient-to-r from-navy-800 to-primary-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-navy-300">Ticket Number</p>
              <p className="text-lg font-bold">{ticket.ticketNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-navy-300">Booking Ref</p>
              <p className="text-base font-bold">
                {ticket.bookingReference}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">
                {ticket.originIata}
              </p>
              <p className="text-xs text-gray-400 mt-1">Origin</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-primary-500 text-2xl">✈</p>
              <p className="text-xs text-gray-400">{ticket.flightNumber}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">
                {ticket.destinationIata}
              </p>
              <p className="text-xs text-gray-400 mt-1">Destination</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-dashed border-gray-200 pt-5">
            <div>
              <p className="text-xs text-gray-400">Passenger</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {ticket.passengerName}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Class</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {ticket.seatClass}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Departure</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {formatDateTime(ticket.departureTime)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Arrival</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {formatDateTime(ticket.arrivalTime)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Seat</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {ticket.seatNumber ?? "Not assigned"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Airline</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {ticket.airlineName}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Check-in Status</p>
              <p className="mt-0.5">
                <span
                  className={
                    "badge " +
                    (ticket.isCheckedIn
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600")
                  }
                >
                  {ticket.isCheckedIn ? "Checked In" : "Not Checked In"}
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Issued At</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {formatDateTime(ticket.issuedAt)}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            {!ticket.isCheckedIn && (
              <button
                onClick={() => checkInMutation.mutate()}
                disabled={checkInMutation.isPending}
                className="btn-primary w-full"
              >
                {checkInMutation.isPending
                  ? "Checking in..."
                  : "Check In Now"}
              </button>
            )}
            <button
              onClick={() => downloadMutation.mutate()}
              disabled={downloadMutation.isPending}
              className="btn-secondary w-full"
            >
              {downloadMutation.isPending
                ? "Downloading..."
                : "Download Ticket (PDF)"}
            </button>
            <button
              onClick={() => boardingPassMutation.mutate()}
              disabled={boardingPassMutation.isPending}
              className="btn-outline w-full"
            >
              {boardingPassMutation.isPending
                ? "Downloading..."
                : "Download Boarding Pass"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}