import { apiClient } from "./client";
import type {
  FlightSearchRequest,
  FlightSearchResult,
  RoundTripResult,
  MultiCityResult,
  MultiCitySearchRequest,
  SeatMapDto,
} from "../types/dto";

export async function searchOneWay(
  payload: FlightSearchRequest
): Promise<FlightSearchResult[]> {
  const { data } = await apiClient.post<FlightSearchResult[]>(
    "/search/one-way",
    payload
  );
  return data;
}

export async function searchRoundTrip(
  payload: FlightSearchRequest
): Promise<RoundTripResult[]> {
  const { data } = await apiClient.post<RoundTripResult[]>(
    "/search/round-trip",
    payload
  );
  return data;
}

export async function searchMultiCity(
  payload: MultiCitySearchRequest
): Promise<MultiCityResult[]> {
  const { data } = await apiClient.post<MultiCityResult[]>(
    "/search/multi-city",
    payload
  );
  return data;
}

export async function getFlightSeatMap(id: string): Promise<SeatMapDto> {
  const { data } = await apiClient.get<SeatMapDto>(`/flights/${id}/seats`);
  return data;
}