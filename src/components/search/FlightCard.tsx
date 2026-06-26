import type { FlightSearchResult } from "../../types/dto";
import { formatTime, formatDuration, formatCurrency } from "../../lib/formatters";
import type { SeatClass } from "../../types/enums";

interface FlightCardProps {
  flight: FlightSearchResult;
  onSelect: (flight: FlightSearchResult) => void;
  selectedClass: SeatClass;
}

const classPrice: Record<SeatClass, (f: FlightSearchResult) => number> = {
  Economy: (f) => f.economyBasePrice,
  Business: (f) => f.businessBasePrice,
  First: (f) => f.firstClassBasePrice,
};

const classSeats: Record<SeatClass, (f: FlightSearchResult) => number> = {
  Economy: (f) => f.availableEconomySeats,
  Business: (f) => f.availableBusinessSeats,
  First: (f) => f.availableFirstClassSeats,
};

export default function FlightCard({
  flight,
  onSelect,
  selectedClass,
}: FlightCardProps) {
  const price = classPrice[selectedClass](flight);
  const seats = classSeats[selectedClass](flight);

  return (
    <div className="flight-card">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-lg font-bold text-primary-700">
            {flight.airlineIata?.charAt(0) ?? "A"}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {flight.airlineName}
            </p>
            <p className="text-xs text-gray-400">{flight.flightNumber}</p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center gap-4">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">
              {formatTime(flight.departureTime)}
            </p>
            <p className="text-xs font-medium text-gray-500">
              {flight.originIata}
            </p>
            <p className="text-xs text-gray-400">{flight.originCity}</p>
          </div>

          <div className="flex flex-1 flex-col items-center gap-1">
            <p className="text-xs text-gray-400">
              {formatDuration(flight.durationMinutes)}
            </p>
            <div className="relative flex w-full items-center">
              <div className="h-px flex-1 bg-gray-300" />
              <span className="mx-1 text-primary-500">✈</span>
              <div className="h-px flex-1 bg-gray-300" />
            </div>
            <p className="text-xs text-gray-400">
              {flight.stops === 0
                ? "Direct"
                : flight.stops + " stop" + (flight.stops > 1 ? "s" : "")}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">
              {formatTime(flight.arrivalTime)}
            </p>
            <p className="text-xs font-medium text-gray-500">
              {flight.destinationIata}
            </p>
            <p className="text-xs text-gray-400">{flight.destinationCity}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <p className="text-xl font-bold text-primary-600">
            {formatCurrency(price)}
          </p>
          <p className="text-xs text-gray-400">{seats} seats left</p>
          <button
            onClick={() => onSelect(flight)}
            disabled={seats === 0}
            className="btn-primary h-9 px-5 text-xs disabled:opacity-50"
          >
            {seats === 0 ? "Sold Out" : "Select"}
          </button>
        </div>
      </div>
    </div>
  );
}