export type UserRole = "Passenger" | "Agent" | "Admin";

export type BookingStatus =
  | "PendingPayment"
  | "Confirmed"
  | "Cancelled"
  | "Expired"
  | "Refunded";

export type FlightStatus =
  | "Scheduled"
  | "Delayed"
  | "Cancelled"
  | "Boarding"
  | "Departed"
  | "Arrived";

export type SeatClass = "Economy" | "Business" | "First";

export type PaymentStatus =
  | "Pending"
  | "Succeeded"
  | "Failed"
  | "Cancelled"
  | "Refunded";

export type RefundStatus = "Pending" | "Processed" | "Denied";

export type TripType = "OneWay" | "RoundTrip" | "MultiCity";

export type PassengerType = "Adult" | "Child" | "Infant";