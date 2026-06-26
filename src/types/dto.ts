import type {
  UserRole,
  BookingStatus,
  FlightStatus,
  SeatClass,
  PaymentStatus,
  RefundStatus,
  TripType,
  PassengerType,
} from "./enums";

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
}

export interface UserInfo {
  id: string;
  fullName?: string;
  email?: string;
  role?: string;
  isEmailVerified: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: UserInfo;
}

export interface UserDto {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  dateOfBirth: string;
  nationality?: string;
  profilePictureUrl?: string;
  createdAt: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  dateOfBirth: string;
  nationality?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface PassengerCount {
  adults: number;
  children: number;
  infants: number;
  total?: number;
}

export interface FlightSearchRequest {
  originIata: string;
  destinationIata: string;
  departureDate: string;
  returnDate?: string;
  passengers: PassengerCount;
  seatClass: SeatClass;
  maxStops?: number;
  sortBy?: string;
  sortDescending?: boolean;
  maxPrice?: number;
}

export interface FlightLeg {
  originIata: string;
  destinationIata: string;
  departureDate: string;
}

export interface MultiCitySearchRequest {
  legs: FlightLeg[];
  passengers: PassengerCount;
  seatClass: SeatClass;
}

export interface FlightSearchResult {
  id: string;
  flightNumber?: string;
  airlineName?: string;
  airlineIata?: string;
  airlineLogoUrl?: string;
  aircraftModel?: string;
  originIata?: string;
  originCity?: string;
  originCountry?: string;
  destinationIata?: string;
  destinationCity?: string;
  destinationCountry?: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  status: FlightStatus;
  economyBasePrice: number;
  businessBasePrice: number;
  firstClassBasePrice: number;
  airportFee: number;
  taxPercentage: number;
  availableEconomySeats: number;
  availableBusinessSeats: number;
  availableFirstClassSeats: number;
  gateNumber?: string;
  totalPrice: number;
  requestedClass: SeatClass;
  stops: number;
}

export interface RoundTripResult {
  outboundFlight: FlightSearchResult;
  returnFlight: FlightSearchResult;
  totalPrice: number;
}

export interface MultiCityResult {
  flights: FlightSearchResult[];
  totalPrice: number;
}

export interface SeatDto {
  id: string;
  seatNumber?: string;
  seatClass: SeatClass;
  isAvailable: boolean;
  isWindowSeat: boolean;
  isAisleSeat: boolean;
  isExitRow: boolean;
  extraLegroom: boolean;
}

export interface SeatMapDto {
  flightId: string;
  flightNumber?: string;
  seats: SeatDto[];
}

export interface PassengerRequest {
  firstName: string;
  lastName: string;
  passengerType: PassengerType;
  dateOfBirth: string;
  passportNumber?: string;
  passportExpiry?: string;
  passportCountry?: string;
  seatId?: string;
  mealPreference?: string;
  specialAssistance?: string;
}

export interface BookingSegmentRequest {
  flightId: string;
  seatClass: SeatClass;
}

export interface CreateBookingRequest {
  tripType: TripType;
  segments: BookingSegmentRequest[];
  passengers: PassengerRequest[];
  promoCode?: string;
}

export interface BookingPassengerDto {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  passengerType: PassengerType;
  dateOfBirth: string;
  seatNumber?: string;
  mealPreference?: string;
}

export interface BookingSegmentDto {
  id: string;
  segmentOrder: number;
  seatClass: SeatClass;
  baseFare: number;
  taxes: number;
  fees: number;
  segmentTotal: number;
  flightNumber?: string;
  originIata?: string;
  destinationIata?: string;
  departureTime: string;
  arrivalTime: string;
}

export interface PaymentSummaryDto {
  id: string;
  status: PaymentStatus;
  amount: number;
  paidAt?: string;
  receiptUrl?: string;
}

export interface BookingDto {
  id: string;
  bookingReference?: string;
  status: BookingStatus;
  tripType: TripType;
  totalAmount: number;
  discountAmount: number;
  currencyCode?: string;
  holdExpiresAt?: string;
  confirmedAt?: string;
  createdAt: string;
  segments: BookingSegmentDto[];
  passengers: BookingPassengerDto[];
  payment?: PaymentSummaryDto;
}

export interface PaymentIntentResult {
  paymentIntentId: string;
  clientSecret: string;
  amount: number;
  currency: string;
}

export interface PaymentDto {
  id: string;
  bookingId: string;
  bookingReference?: string;
  stripePaymentIntentId?: string;
  amount: number;
  currencyCode?: string;
  status: PaymentStatus;
  paidAt?: string;
  receiptUrl?: string;
}

export interface PromoValidationResult {
  isValid: boolean;
  message?: string;
  discountAmount: number;
  finalAmount: number;
  code?: string;
}

export interface TicketDto {
  id: string;
  ticketNumber?: string;
  bookingId: string;
  bookingReference?: string;
  passengerName?: string;
  flightNumber?: string;
  airlineName?: string;
  originIata?: string;
  destinationIata?: string;
  departureTime: string;
  arrivalTime: string;
  seatClass?: string;
  seatNumber?: string;
  issuedAt: string;
  isCheckedIn: boolean;
  checkedInAt?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
}

export interface PassportDto {
  passportNumber?: string;
  issuingCountry?: string;
  issuedDate: string;
  expiryDate: string;
}

export interface RefundDto {
  id: string;
  bookingId: string;
  amount: number;
  status: RefundStatus;
  reason?: string;
  requestedAt: string;
  processedAt?: string;
}