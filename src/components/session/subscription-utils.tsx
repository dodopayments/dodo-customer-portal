import { internalApi } from "@/lib/http";
import { CountriesListType } from "@/constants/Countries";
import { Badge } from "@/components/ui/badge";
import { parseIsoDateDMY } from "@/lib/date-helper";

export async function fetchSupportedCountries(): Promise<string[]> {
  const response = await internalApi.get<string[]>(
    `/checkout/supported_countries`,
  );
  return response.data;
}

export async function getMatchedCountries(
  countryValues: string[],
  countryObjects: ReadonlyArray<CountriesListType>,
): Promise<CountriesListType[]> {
  const filtered = countryObjects.filter((country) =>
    countryValues.includes(country.code),
  );

  return filtered.sort((a, b) => a.name.localeCompare(b.name));
}

interface SubscriptionBadgeData {
  status: string;
  cancelled_at: string;
  next_billing_date: string;
  cancel_at_next_billing_date: boolean;
}

export function renderSubscriptionBadges(
  subscription: SubscriptionBadgeData,
  badgeClassName?: string,
) {
  if (subscription.status === "cancelled") {
    return (
      <Badge variant="red" dot={false} className={badgeClassName}>
        cancelled on {parseIsoDateDMY(subscription.cancelled_at)}
      </Badge>
    );
  }

  const nextBillingDate = parseIsoDateDMY(subscription.next_billing_date);

  if (subscription.cancel_at_next_billing_date) {
    return (
      <Badge variant="red" dot={false} className={badgeClassName}>
        subscription ends on {nextBillingDate}
      </Badge>
    );
  }

  return (
    <>
      <Badge variant="default" dot={false} className={badgeClassName}>
        renews on {nextBillingDate}
      </Badge>
      <Badge variant="default" dot={false} className={badgeClassName}>
        valid until {nextBillingDate}
      </Badge>
    </>
  );
}
