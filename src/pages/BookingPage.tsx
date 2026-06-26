import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createBooking, validatePromo } from "../api/bookings.api";
import PassengerForm from "../components/booking/PassengerForm";
import SeatMap from "../components/booking/SeatMap";

import { useToast } from "../hooks/useToast";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../lib/errors";
import { formatCurrency } from "../lib/formatters";
import type { PassengerRequest } from "../types/dto";
import type { SeatClass, PassengerType } from "../types/enums";

const STEPS = ["Passengers", "Seats", "Review & Pay"];

interface SelectedSeat {
  seatId: string;
  seatNumber: string;
}

interface PromoResult {
  discount: number;
  message: string;
  valid: boolean;
}

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useAuth();

  const flightId = searchParams.get("flightId") ?? "";
  const seatClass = (searchParams.get("seatClass") ?? "Economy") as SeatClass;
  const adults = parseInt(searchParams.get("adults") ?? "1");
  const children = parseInt(searchParams.get("children") ?? "0");
  const infants = parseInt(searchParams.get("infants") ?? "0");
  const totalPassengers = adults + children + infants;

  const [step, setStep] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [promoResult, setPromoResult] = useState<PromoResult | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Record<number, SelectedSeat>>({});

  const passengerTypes: PassengerType[] = [
    ...Array(adults).fill("Adult"),
    ...Array(children).fill("Child"),
    ...Array(infants).fill("Infant"),
  ];

  const emptyPassenger = (type: PassengerType): PassengerRequest => ({
    firstName: "",
    lastName: "",
    passengerType: type,
    dateOfBirth: "",
    passportNumber: "",
    passportExpiry: "",
    passportCountry: "",
    mealPreference: "",
    specialAssistance: "",
  });

  const [passengers, setPassengers] = useState<PassengerRequest[]>(
    passengerTypes.map((type) => emptyPassenger(type))
  );

  const promoMutation = useMutation({
    mutationFn: ({ code, total }: { code: string; total: number }) =>
      validatePromo(code, total),
    onSuccess: (result) => {
      if (result.isValid) {
        setPromoResult({
          discount: result.discountAmount,
          message: result.message ?? "Promo applied!",
          valid: true,
        });
        toast.success("Promo code applied!");
      } else {
        setPromoResult({
          discount: 0,
          message: result.message ?? "Invalid promo code.",
          valid: false,
        });
        toast.error(result.message ?? "Invalid promo code.");
      }
    },
  });

  const bookingMutation = useMutation({
    mutationFn: () =>
      createBooking({
        tripType: "OneWay",
        segments: [{ flightId, seatClass }],
        passengers: passengers.map((p, i) => ({
          ...p,
          seatId: selectedSeats[i]?.seatId,
        })),
        promoCode: promoResult?.valid ? promoCode : undefined,
      }),
    onSuccess: (booking) => {
      toast.success("Booking created! Proceeding to payment...");
      navigate("/payment?bookingId=" + booking.id);
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });

  function updatePassenger(index: number, value: PassengerRequest) {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }

  function handleSeatSelect(
    passengerIndex: number,
    seatId: string,
    seatNumber: string
  ) {
    setSelectedSeats((prev) => ({
      ...prev,
      [passengerIndex]: { seatId, seatNumber },
    }));
  }

  function validateStep0() {
    for (const p of passengers) {
      if (!p.firstName || !p.lastName || !p.dateOfBirth) {
        toast.error("Please fill in all required passenger fields.");
        return false;
      }
    }
    return true;
  }

  function handleNext() {
    if (step === 0 && !validateStep0()) return;
    setStep((s) => s + 1);
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-4xl mb-4">🔒</p>
        <h2 className="text-xl font-bold text-gray-900">Login Required</h2>
        <p className="mt-2 text-sm text-gray-500">
          You need to be logged in to book a flight.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="btn-primary mt-6"
        >
          Login to Continue
        </button>
      </div>
    );
  }

  if (!flightId) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-sm text-gray-500">No flight selected.</p>
        <button
          onClick={() => navigate("/search")}
          className="btn-primary mt-4"
        >
          Search Flights
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Complete Your Booking
      </h1>
      <p className="mb-6 text-sm text-gray-500">
        {seatClass} class - {totalPassengers} passenger
        {totalPassengers > 1 ? "s" : ""}
      </p>

      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 " +
                (i < step
                  ? "bg-green-500 text-white"
                  : i === step
                  ? "bg-primary-600 text-white"
                  : "bg-gray-200 text-gray-500")
              }
            >
              {i < step ? "✓" : i + 1}
            </div>
            <span
              className={
                "text-xs font-medium " +
                (i === step ? "text-primary-600" : "text-gray-400")
              }
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={
                  "h-px w-8 " + (i < step ? "bg-green-400" : "bg-gray-200")
                }
              />
            )}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-gray-900">
            Passenger Details
          </h2>
          {passengers.map((p, i) => (
            <PassengerForm
              key={i}
              index={i}
              type={passengerTypes[i]}
              value={p}
              onChange={updatePassenger}
            />
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-base font-semibold text-gray-900">
            Select Seats (Optional)
          </h2>
          {passengers.map((p, i) => (
            <div key={i} className="card p-5">
              <h3 className="mb-3 text-sm font-medium text-gray-700">
                {p.firstName} {p.lastName}
                {selectedSeats[i] && (
                  <span className="ml-2 text-primary-600 font-semibold">
                    - Seat {selectedSeats[i].seatNumber}
                  </span>
                )}
              </h3>
              <SeatMap
                flightId={flightId}
                seatClass={seatClass}
                selectedSeatId={selectedSeats[i]?.seatId}
                onSelect={(seatId, seatNumber) =>
                  handleSeatSelect(i, seatId, seatNumber)
                }
              />
            </div>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-base font-semibold text-gray-900">
            Review Your Booking
          </h2>

          <div className="card p-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              Passengers
            </h3>
            <div className="space-y-2">
              {passengers.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700">
                    {p.firstName} {p.lastName}
                    <span className="ml-2 text-xs text-gray-400">
                      ({passengerTypes[i]})
                    </span>
                  </span>
                  {selectedSeats[i] && (
                    <span className="text-xs font-medium text-primary-600">
                      Seat {selectedSeats[i].seatNumber}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              Promo Code
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="input-field"
                placeholder="Enter promo code"
              />
              <button
                onClick={() =>
                  promoMutation.mutate({ code: promoCode, total: 0 })
                }
                disabled={!promoCode || promoMutation.isPending}
                className="btn-outline shrink-0"
              >
                {promoMutation.isPending ? "..." : "Apply"}
              </button>
            </div>
            {promoResult && (
              <p
                className={
                  "mt-2 text-xs " +
                  (promoResult.valid ? "text-green-600" : "text-red-500")
                }
              >
                {promoResult.message}
              </p>
            )}
          </div>

          {promoResult?.valid && (
            <div className="card p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-green-600">
                  -{formatCurrency(promoResult.discount)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        {step > 0 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="btn-secondary"
          >
            Back
          </button>
        ) : (
          <button onClick={() => navigate(-1)} className="btn-secondary">
            Cancel
          </button>
        )}

        {step < STEPS.length - 1 ? (
          <button onClick={handleNext} className="btn-primary">
            Continue
          </button>
        ) : (
          <button
            onClick={() => bookingMutation.mutate()}
            disabled={bookingMutation.isPending}
            className="btn-primary"
          >
            {bookingMutation.isPending
              ? "Creating Booking..."
              : "Confirm Booking"}
          </button>
        )}
      </div>
    </div>
  );
}
