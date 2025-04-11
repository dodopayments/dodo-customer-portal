import { internalApi } from "@/lib/http";
import { CountriesList } from "@/constants/Countries";

export async function fetchSupportedCountries(): Promise<string[]> {
  const response = await internalApi.get<string[]>(
    `/checkout/supported_countries`
  );
  return response.data;
}

export async function getMatchedCountries(
  countryValues: string[],
  countryObjects: ReadonlyArray<CountriesList>
): Promise<CountriesList[]> {
  const filtered = countryObjects.filter((country) =>
    countryValues.includes(country.code)
  );

  return filtered.sort((a, b) => a.name.localeCompare(b.name));
} 