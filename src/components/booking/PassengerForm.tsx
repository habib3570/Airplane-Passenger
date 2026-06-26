import type { PassengerRequest } from "../../types/dto";
import type { PassengerType } from "../../types/enums";

interface PassengerFormProps {
  index: number;
  type: PassengerType;
  value: PassengerRequest;
  onChange: (index: number, value: PassengerRequest) => void;
}

export default function PassengerForm({
  index,
  type,
  value,
  onChange,
}: PassengerFormProps) {
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    onChange(index, { ...value, [e.target.name]: e.target.value });
  }

  return (
    <div className="card p-5">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">
        Passenger {index + 1}{" "}
        <span className="ml-2 badge bg-primary-50 text-primary-700">
          {type}
        </span>
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="label">First Name</label>
          <input
            name="firstName"
            type="text"
            required
            value={value.firstName}
            onChange={handleChange}
            className="input-field"
            placeholder="John"
          />
        </div>
        <div>
          <label className="label">Last Name</label>
          <input
            name="lastName"
            type="text"
            required
            value={value.lastName}
            onChange={handleChange}
            className="input-field"
            placeholder="Doe"
          />
        </div>
        <div>
          <label className="label">Date of Birth</label>
          <input
            name="dateOfBirth"
            type="date"
            required
            value={value.dateOfBirth}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div>
          <label className="label">Passport Number</label>
          <input
            name="passportNumber"
            type="text"
            value={value.passportNumber ?? ""}
            onChange={handleChange}
            className="input-field"
            placeholder="AB1234567"
          />
        </div>
        <div>
          <label className="label">Passport Country</label>
          <input
            name="passportCountry"
            type="text"
            value={value.passportCountry ?? ""}
            onChange={handleChange}
            className="input-field"
            placeholder="BD"
          />
        </div>
        <div>
          <label className="label">Passport Expiry</label>
          <input
            name="passportExpiry"
            type="date"
            value={value.passportExpiry ?? ""}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div>
          <label className="label">Meal Preference</label>
          <select
            name="mealPreference"
            value={value.mealPreference ?? ""}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">No preference</option>
            <option value="Standard">Standard</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Halal">Halal</option>
            <option value="Kosher">Kosher</option>
          </select>
        </div>
        <div>
          <label className="label">Special Assistance</label>
          <input
            name="specialAssistance"
            type="text"
            value={value.specialAssistance ?? ""}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g. Wheelchair"
          />
        </div>
      </div>
    </div>
  );
}