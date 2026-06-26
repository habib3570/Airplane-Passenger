import { apiClient } from "./client";
import type {
  BookingDto,
  CreateBookingRequest,
  PagedResult,
  PaymentIntentResult,
  PaymentDto,
  PromoValidationResult,
  RefundDto,
} from "../types/dto";

export async function createBooking(
  payload: CreateBookingRequest
): Promise<BookingDto> {
  const { data } = await apiClient.post<BookingDto>("/bookings", payload);
  return data;
}

export async function getMyBookings(params: {
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
}): Promise<PagedResult<BookingDto>> {
  const { data } = await apiClient.get<PagedResult<BookingDto>>("/bookings", {
    params,
  });
  return data;
}

export async function getBookingById(id: string): Promise<BookingDto> {
  const { data } = await apiClient.get<BookingDto>(`/bookings/${id}`);
  return data;
}

export async function getBookingByReference(
  reference: string
): Promise<BookingDto> {
  const { data } = await apiClient.get<BookingDto>(
    `/bookings/reference/${reference}`
  );
  return data;
}

export async function cancelBooking(
  id: string,
  reason?: string
): Promise<void> {
  await apiClient.patch(`/bookings/${id}/cancel`, { reason });
}

export async function createPaymentIntent(
  bookingId: string
): Promise<PaymentIntentResult> {
  const { data } = await apiClient.post<PaymentIntentResult>(
    "/payments/intent",
    { bookingId }
  );
  return data;
}

export async function confirmPayment(
  paymentIntentId: string
): Promise<PaymentDto> {
  const { data } = await apiClient.post<PaymentDto>("/payments/confirm", {
    paymentIntentId,
  });
  return data;
}

export async function validatePromo(
  code: string,
  cartTotal: number
): Promise<PromoValidationResult> {
  const { data } = await apiClient.post<PromoValidationResult>(
    "/payments/promo/validate",
    { code, cartTotal }
  );
  return data;
}

export async function requestRefund(
  bookingId: string,
  reason: string
): Promise<RefundDto> {
  const { data } = await apiClient.post<RefundDto>("/payments/refund", {
    bookingId,
    reason,
  });
  return data;
}

export async function selectSeat(
  bookingId: string,
  passengerId: string,
  seatId: string
): Promise<void> {
  await apiClient.post(`/bookings/${bookingId}/select-seat`, {
    passengerId,
    seatId,
  });
}