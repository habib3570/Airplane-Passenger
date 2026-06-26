import { useQuery } from "@tanstack/react-query";
import { getFlightSeatMap } from "../../api/search.api";
import type { SeatClass } from "../../types/enums";

interface SeatMapProps {
  flightId: string;
  selectedSeatId?: string;
  seatClass: SeatClass;
  onSelect: (seatId: string, seatNumber: string) => void;
}

export default function SeatMap({
  flightId,
  selectedSeatId,
  seatClass,
  onSelect,
}: SeatMapProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["seatmap", flightId],
    queryFn: () => getFlightSeatMap(flightId),
  });

  const seats = (data?.seats ?? []).filter(
    (s) => s.seatClass === seatClass
  );

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-4 w-4 rounded border border-gray-300 bg-white" />
          Available
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-4 w-4 rounded bg-primary-600" />
          Selected
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-4 w-4 rounded bg-gray-200" />
          Taken
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {seats.map((seat) => (
          <button
            key={seat.id}
            disabled={!seat.isAvailable}
            onClick={() =>
              seat.isAvailable && onSelect(seat.id, seat.seatNumber ?? "")
            }
            title={
              seat.seatNumber +
              (seat.isWindowSeat ? " (Window)" : "") +
              (seat.isAisleSeat ? " (Aisle)" : "") +
              (seat.extraLegroom ? " (Extra Legroom)" : "")
            }
            className={
              "flex h-8 w-10 items-center justify-center rounded text-xs font-medium transition-all duration-150 " +
              (selectedSeatId === seat.id
                ? "bg-primary-600 text-white shadow-md"
                : seat.isAvailable
                ? "border border-gray-300 bg-white text-gray-700 hover:border-primary-400 hover:bg-primary-50"
                : "cursor-not-allowed bg-gray-200 text-gray-400")
            }
          >
            {seat.seatNumber}
          </button>
        ))}
      </div>
    </div>
  );
}