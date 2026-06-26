import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AirportInput from "./AirportInput";
import type { SeatClass, TripType } from "../../types/enums";

interface SearchFormState {
  tripType: TripType;
  originIata: string;
  originLabel: string;
  destinationIata: string;
  destinationLabel: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  infants: number;
  seatClass: SeatClass;
}

export default function FlightSearchForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<SearchFormState>({
    tripType: "OneWay",
    originIata: "",
    originLabel: "",
    destinationIata: "",
    destinationLabel: "",
    departureDate: "",
    returnDate: "",
    adults: 1,
    children: 0,
    infants: 0,
    seatClass: "Economy",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.originIata || !form.destinationIata) return;
    const params = new URLSearchParams({
      tripType: form.tripType,
      originIata: form.originIata,
      destinationIata: form.destinationIata,
      departureDate: form.departureDate,
      returnDate: form.returnDate,
      adults: String(form.adults),
      children: String(form.children),
      infants: String(form.infants),
      seatClass: form.seatClass,
    });
    navigate("/search?" + params.toString());
  }

  function counter(
    field: "adults" | "children" | "infants",
    min: number,
    max: number,
    label: string,
    hint: string
  ) {
    return (
      <div>
        <label className="label">
          {label}{" "}
          <span className="text-xs font-normal text-gray-400">({hint})</span>
        </label>
        <div className="flex h-10 items-center overflow-hidden rounded-lg border border-gray-300 bg-white transition-all hover:border-primary-400 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100">
          <button
            type="button"
            onClick={() =>
              setForm((p) => ({ ...p, [field]: Math.max(min, p[field] - 1) }))
            }
            className="flex h-full w-10 shrink-0 items-center justify-center text-xl font-medium text-gray-500 hover:bg-primary-50 hover:text-primary-600"
          >
            −
          </button>
          <span className="flex-1 text-center text-sm font-bold text-gray-900">
            {form[field]}
          </span>
          <button
            type="button"
            onClick={() =>
              setForm((p) => ({ ...p, [field]: Math.min(max, p[field] + 1) }))
            }
            className="flex h-full w-10 shrink-0 items-center justify-center text-xl font-medium text-gray-500 hover:bg-primary-50 hover:text-primary-600"
          >
            +
          </button>
        </div>
      </div>
    );
  }

  const isValid =
    !!form.originIata && !!form.destinationIata && !!form.departureDate;

  return (
    <div className="card p-6 shadow-xl">
      <div className="mb-5 flex flex-wrap gap-2">
        {(
          [
            { value: "OneWay", label: "One Way" },
            { value: "RoundTrip", label: "Round Trip" },
            { value: "MultiCity", label: "Multi City" },
          ] as { value: TripType; label: string }[]
        ).map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() =>
              setForm((prev) => ({ ...prev, tripType: t.value }))
            }
            className={
              "rounded-full px-5 py-1.5 text-xs font-semibold transition-all duration-150 " +
              (form.tripType === t.value
                ? "bg-primary-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-600")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AirportInput
            label="From"
            value={form.originIata}
            displayValue={form.originLabel}
            onChange={(code, label) =>
              setForm((prev) => ({
                ...prev,
                originIata: code,
                originLabel: label,
              }))
            }
            placeholder="Search city or airport..."
          />

          <AirportInput
            label="To"
            value={form.destinationIata}
            displayValue={form.destinationLabel}
            onChange={(code, label) =>
              setForm((prev) => ({
                ...prev,
                destinationIata: code,
                destinationLabel: label,
              }))
            }
            placeholder="Search city or airport..."
          />

          <div>
            <label className="label">Departure Date</label>
            <input
              name="departureDate"
              type="date"
              required
              value={form.departureDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, departureDate: e.target.value }))
              }
              className="input-field bg-white text-gray-900"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {form.tripType === "RoundTrip" ? (
            <div>
              <label className="label">Return Date</label>
              <input
                name="returnDate"
                type="date"
                required
                value={form.returnDate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, returnDate: e.target.value }))
                }
                className="input-field bg-white text-gray-900"
                min={form.departureDate}
              />
            </div>
          ) : (
            <div>
              <label className="label">Class</label>
              <select
                value={form.seatClass}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    seatClass: e.target.value as SeatClass,
                  }))
                }
                className="input-field bg-white text-gray-900"
              >
                <option value="Economy">Economy</option>
                <option value="Business">Business</option>
                <option value="First">First Class</option>
              </select>
            </div>
          )}
        </div>

        {form.tripType === "RoundTrip" && (
          <div className="mt-4 max-w-xs">
            <label className="label">Class</label>
            <select
              value={form.seatClass}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  seatClass: e.target.value as SeatClass,
                }))
              }
              className="input-field bg-white text-gray-900"
            >
              <option value="Economy">Economy</option>
              <option value="Business">Business</option>
              <option value="First">First Class</option>
            </select>
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {counter("adults", 1, 9, "Adults", "12+")}
          {counter("children", 0, 9, "Children", "2-11")}
          {counter("infants", 0, 9, "Infants", "0-2")}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={!isValid}
            className="btn-primary px-10 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔍 Search Flights
          </button>
          {!isValid && (
            <p className="text-xs text-gray-400">
              {!form.originIata || !form.destinationIata
                ? "Please select origin and destination airports."
                : "Please select a departure date."}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}