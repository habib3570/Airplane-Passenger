import { apiClient } from "./client";

export interface AirportDto {
  id: string;
  iataCode?: string;
  icaoCode?: string;
  name?: string;
  city?: string;
  country?: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  timeZone?: string;
}

interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export async function searchAirports(term: string): Promise<AirportDto[]> {
  const { data } = await apiClient.get<PagedResult<AirportDto>>("/airports", {
    params: { SearchTerm: term, PageSize: 10 },
  });
  return data.items ?? [];
}