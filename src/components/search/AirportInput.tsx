import { useState, useRef, useEffect } from "react";
import { searchAirports } from "../../api/airports.api";
import type { AirportDto } from "../../api/airports.api";

interface AirportInputProps {
  label: string;
  value: string;
  displayValue: string;
  onChange: (iataCode: string, label: string) => void;
  placeholder?: string;
}

function useOutsideClick(
  ref: React.RefObject<HTMLDivElement | null>,
  callback: () => void
) {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, callback]);
}

export default function AirportInput({
  label,
  value,
  displayValue,
  onChange,
  placeholder = "Search city or airport...",
}: AirportInputProps) {
  const [results, setResults] = useState<AirportDto[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const query = displayValue;

  useOutsideClick(wrapperRef, () => {
    setOpen(false);
    if (!value) onChange("", "");
  });

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    onChange("", val);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const airports = await searchAirports(val);
        setResults(airports);
        setOpen(airports.length > 0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }

  function handleSelect(airport: AirportDto) {
    const displayText =
      (airport.iataCode ?? "") +
      " — " +
      (airport.city ?? "") +
      ", " +
      (airport.country ?? "");
    onChange(airport.iataCode ?? "", displayText);
    setOpen(false);
    setResults([]);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label className="label">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
          className={
            "input-field bg-white text-gray-900 pr-8 " +
            (value ? "border-primary-400" : "")
          }
          placeholder={placeholder}
          autoComplete="off"
        />
        {loading ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            ⟳
          </span>
        ) : value ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-green-500">
            ✓
          </span>
        ) : null}
      </div>

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
          {results.map((airport) => (
            <button
              key={airport.id}
              type="button"
              onClick={() => handleSelect(airport)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-100 hover:bg-primary-50 first:rounded-t-xl last:rounded-b-xl"
            >
              <span className="flex h-9 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-100 text-sm font-bold text-primary-700">
                {airport.iataCode}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {airport.name}
                </p>
                <p className="text-xs text-gray-400">
                  {airport.city}, {airport.country}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}