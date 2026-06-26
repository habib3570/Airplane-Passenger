import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchOneWay, searchRoundTrip } from "../api/search.api";
import FlightSearchForm from "../components/search/FlightSearchForm";
import FlightCard from "../components/search/FlightCard";
import Spinner from "../components/ui/Spinner";
import type { FlightSearchResult } from "../types/dto";
import type { SeatClass, TripType } from "../types/enums";
import { formatCurrency } from "../lib/formatters";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const tripType = (searchParams.get("tripType") ?? "OneWay") as TripType;
  const originIata = searchParams.get("originIata") ?? "";
  const destinationIata = searchParams.get("destinationIata") ?? "";
  const departureDate = searchParams.get("departureDate") ?? "";
  const returnDate = searchParams.get("returnDate") ?? "";
  const seatClass = (searchParams.get("seatClass") ?? "Economy") as SeatClass;
  const adults = parseInt(searchParams.get("adults") ?? "1");
  const children = parseInt(searchParams.get("children") ?? "0");
  const infants = parseInt(searchParams.get("infants") ?? "0");

  const isReady =
    originIata.length === 3 &&
    destinationIata.length === 3 &&
    departureDate.length > 0;

  const oneWayQuery = useQuery({
    queryKey: [
      "search-oneway",
      originIata,
      destinationIata,
      departureDate,
      seatClass,
      adults,
      children,
      infants,
    ],
    queryFn: () =>
      searchOneWay({
        originIata,
        destinationIata,
        departureDate,
        passengers: { adults, children, infants },
        seatClass,
      }),
    enabled: isReady && tripType === "OneWay",
  });

  const roundTripQuery = useQuery({
    queryKey: [
      "search-roundtrip",
      originIata,
      destinationIata,
      departureDate,
      returnDate,
      seatClass,
      adults,
      children,
      infants,
    ],
    queryFn: () =>
      searchRoundTrip({
        originIata,
        destinationIata,
        departureDate,
        returnDate: returnDate || undefined,
        passengers: { adults, children, infants },
        seatClass,
      }),
    enabled: isReady && tripType === "RoundTrip",
  });

  function handleSelectFlight(flight: FlightSearchResult) {
    navigate(
      "/booking?" +
        new URLSearchParams({
          flightId: flight.id,
          tripType,
          seatClass,
          adults: String(adults),
          children: String(children),
          infants: String(infants),
        }).toString()
    );
  }

  const isLoading = oneWayQuery.isLoading || roundTripQuery.isLoading;
  const oneWayResults = oneWayQuery.data ?? [];
  const roundTripResults = roundTripQuery.data ?? [];

  if (!isReady) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="section-title mb-6">Search Flights</h1>
        <FlightSearchForm />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="section-title">
            {originIata} to {destinationIata}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {tripType === "RoundTrip" ? "Round Trip" : "One Way"} •{" "}
            {departureDate} • {adults + children + infants} passenger
            {adults + children + infants > 1 ? "s" : ""} • {seatClass}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-secondary h-9 text-xs"
        >
          {showForm ? "Hide Search" : "Modify Search"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <FlightSearchForm />
        </div>
      )}

      {isLoading ? (
        <Spinner />
      ) : (
        <div>
          {tripType === "OneWay" && (
            <div>
              {oneWayResults.length === 0 ? (
                <div className="card p-10 text-center">
                  <p className="text-4xl mb-3">✈</p>
                  <p className="text-sm font-medium text-gray-700">
                    No flights found for this route.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Try changing your dates or destination.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">
                    {oneWayResults.length} flight
                    {oneWayResults.length > 1 ? "s" : ""} found
                  </p>
                  {oneWayResults.map((f) => (
                    <FlightCard
                      key={f.id}
                      flight={f}
                      selectedClass={seatClass}
                      onSelect={handleSelectFlight}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {tripType === "RoundTrip" && (
            <div>
              {roundTripResults.length === 0 ? (
                <div className="card p-10 text-center">
                  <p className="text-4xl mb-3">✈</p>
                  <p className="text-sm font-medium text-gray-700">
                    No round trip flights found.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Try changing your dates or destination.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    {roundTripResults.length} combination
                    {roundTripResults.length > 1 ? "s" : ""} found
                  </p>
                  {roundTripResults.map((r, i) => (
                    <div key={i} className="card overflow-hidden">
                      <div className="border-b border-gray-100 bg-gray-50 px-5 py-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-600 uppercase">
                          Outbound
                        </span>
                        <span className="text-sm font-bold text-primary-600">
                          Total: {formatCurrency(r.totalPrice)}
                        </span>
                      </div>
                      <div className="p-4">
                        <FlightCard
                          flight={r.outboundFlight}
                          selectedClass={seatClass}
                          onSelect={() =>
                            navigate(
                              "/booking?" +
                                new URLSearchParams({
                                  outboundId: r.outboundFlight.id,
                                  returnId: r.returnFlight.id,
                                  tripType: "RoundTrip",
                                  seatClass,
                                  adults: String(adults),
                                  children: String(children),
                                  infants: String(infants),
                                }).toString()
                            )
                          }
                        />
                      </div>
                      <div className="border-t border-gray-100 bg-gray-50 px-5 py-2">
                        <span className="text-xs font-semibold text-gray-600 uppercase">
                          Return
                        </span>
                      </div>
                      <div className="p-4">
                        <FlightCard
                          flight={r.returnFlight}
                          selectedClass={seatClass}
                          onSelect={() =>
                            navigate(
                              "/booking?" +
                                new URLSearchParams({
                                  outboundId: r.outboundFlight.id,
                                  returnId: r.returnFlight.id,
                                  tripType: "RoundTrip",
                                  seatClass,
                                  adults: String(adults),
                                  children: String(children),
                                  infants: String(infants),
                                }).toString()
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}