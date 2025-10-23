import Link from "next/link";

interface StatusOption {
  label: string;
  value: string;
}

interface ServerFilterControlsProps {
  currentPage: number;
  currentStatus?: string;
  currentDateFrom?: string;
  currentDateTo?: string;
  showRefundsOption?: boolean;
  statusOptions?: StatusOption[];
}

const PAYMENT_STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Successful", value: "succeeded" },
  { label: "Failed", value: "failed" },
  { label: "Not Initiated", value: "requires_payment_method" },
  { label: "In Progress", value: "processing" },
];

const REFUND_STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Successful", value: "succeeded" },
  { label: "Failed", value: "failed" },
  { label: "Pending", value: "pending" },
  { label: "Review", value: "review" },
];

export default function ServerFilterControls({
  currentStatus,
  currentDateFrom,
  currentDateTo,
  showRefundsOption = false,
  statusOptions,
}: ServerFilterControlsProps) {
  const buildUrl = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams();

    // Preserve existing params
    if (params.status !== undefined && params.status !== "") {
      searchParams.set('status', params.status);
    } else if (currentStatus) {
      searchParams.set('status', currentStatus);
    }

    if (params.dateFrom !== undefined && params.dateFrom !== "") {
      searchParams.set('dateFrom', params.dateFrom);
    } else if (currentDateFrom) {
      searchParams.set('dateFrom', currentDateFrom);
    }

    if (params.dateTo !== undefined && params.dateTo !== "") {
      searchParams.set('dateTo', params.dateTo);
    } else if (currentDateTo) {
      searchParams.set('dateTo', currentDateTo);
    }

    if (showRefundsOption) {
      searchParams.set('showRefunds', 'true');
    }

    searchParams.set('page', params.page !== undefined ? params.page.toString() : '0');

    return `?${searchParams.toString()}`;
  };

  const finalStatusOptions = statusOptions || (showRefundsOption ? REFUND_STATUS_OPTIONS : PAYMENT_STATUS_OPTIONS);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium">Status:</span>
        {finalStatusOptions.map((option) => (
          <Link
            key={option.value}
            href={buildUrl({ status: option.value, page: "0" })}
            className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              currentStatus === option.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {option.label}
          </Link>
        ))}
      </div>

      {(currentStatus || currentDateFrom || currentDateTo) && (
        <Link
          href="?page=0"
          className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
        >
          Clear Filters
        </Link>
      )}

      {showRefundsOption && (
        <Link
          href={buildUrl({ showRefunds: 'false', page: "0" })}
          className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          Hide Refunds
        </Link>
      )}
    </div>
  );
}
