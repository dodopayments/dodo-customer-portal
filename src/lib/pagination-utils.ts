export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationResult {
  currentPage: number;
  pageSize: number;
  baseUrl: string;
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  currentPageItems: number;
  hasNextPage: boolean;
  totalCount?: number;
}

export function parsePageNumber(
  pageParam: string | undefined,
  defaultPage: number = 0,
): number {
  if (!pageParam) return defaultPage;

  const parsed = Number.parseInt(pageParam, 10);

  if (
    !Number.isFinite(parsed) ||
    parsed < 0 ||
    !Number.isSafeInteger(parsed)
  ) {
    return defaultPage;
  }

  return parsed;
}

export function buildPaginationBaseUrl(
  searchParams: Record<string, string | string[] | undefined>,
  pageParamKey: string = "page",
): string {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (key === pageParamKey) return;

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v) params.append(key, v);
      });
    } else if (value) {
      params.set(key, value);
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "?";
}

export function buildPageUrl(
  baseUrl: string,
  page: number,
  pageParamKey: string = "page",
): string {
  const normalizedBaseUrl = baseUrl.startsWith("?") ? baseUrl : `?${baseUrl}`;
  const params = new URLSearchParams(normalizedBaseUrl.slice(1));
  params.set(pageParamKey, page.toString());
  return `?${params.toString()}`;
}

export function validatePaginationParams(
  page: number,
  pageSize: number,
): { isValid: boolean; normalizedPage: number; normalizedPageSize: number } {
  const normalizedPage = Math.max(0, Math.floor(page));
  const normalizedPageSize = Math.max(1, Math.floor(pageSize));

  return {
    isValid:
      Number.isSafeInteger(normalizedPage) &&
      Number.isSafeInteger(normalizedPageSize) &&
      normalizedPage >= 0 &&
      normalizedPageSize > 0,
    normalizedPage,
    normalizedPageSize,
  };
}

export async function extractPaginationParams(
  searchParams: Promise<Record<string, string | string[] | undefined>>,
  defaultPageSize: number = 50,
  pageParamKey: string = "page",
): Promise<PaginationResult> {
  const resolvedParams = await searchParams;
  const page = parsePageNumber(
    Array.isArray(resolvedParams[pageParamKey])
      ? resolvedParams[pageParamKey][0]
      : resolvedParams[pageParamKey],
  );

  const { normalizedPage, normalizedPageSize } = validatePaginationParams(
    page,
    defaultPageSize,
  );

  const baseUrl = buildPaginationBaseUrl(resolvedParams, pageParamKey);

  return {
    currentPage: normalizedPage,
    pageSize: normalizedPageSize,
    baseUrl,
  };
}

