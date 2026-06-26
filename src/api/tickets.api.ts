import { apiClient } from "./client";
import type { TicketDto } from "../types/dto";

export async function getTicketsByBooking(
  bookingId: string
): Promise<TicketDto[]> {
  const { data } = await apiClient.get<TicketDto[]>(
    `/tickets/booking/${bookingId}`
  );
  return data;
}

export async function getTicketByNumber(
  ticketNumber: string
): Promise<TicketDto> {
  const { data } = await apiClient.get<TicketDto>(
    `/tickets/${ticketNumber}`
  );
  return data;
}

export async function downloadTicket(
  ticketNumber: string
): Promise<Blob> {
  const { data } = await apiClient.get(
    `/tickets/${ticketNumber}/download`,
    { responseType: "blob" }
  );
  return data as Blob;
}

export async function downloadBoardingPass(
  ticketNumber: string
): Promise<Blob> {
  const { data } = await apiClient.get(
    `/tickets/${ticketNumber}/boarding-pass`,
    { responseType: "blob" }
  );
  return data as Blob;
}

export async function checkIn(ticketNumber: string): Promise<void> {
  await apiClient.post(`/tickets/${ticketNumber}/check-in`);
}