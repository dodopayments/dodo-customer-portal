# Pagination Implementation Guide

This guide explains how to implement server-side pagination in Next.js 15 App Router pages using the reusable pagination utilities and components.

## Overview

The pagination system consists of:
- **Utility functions** (`src/lib/pagination-utils.ts`) - Handle parameter parsing, validation, and URL building
- **ServerPagination component** (`src/components/common/server-pagination.tsx`) - Reusable pagination UI component
- **Server Actions** - Fetch paginated data from the API

## Quick Start

### Step 1: Create Server Action

Create a server action that accepts `pageNumber` and `pageSize` parameters:

```typescript
// src/app/session/your-page/actions.ts
"use server";

import { makeAuthenticatedRequest } from "@/lib/server-actions";

export async function fetchYourData(
  pageNumber: number = 0,
  pageSize: number = 50,
) {
  try {
    const params = new URLSearchParams();
    params.set("page_size", pageSize.toString());
    params.set("page_number", pageNumber.toString());

    const response = await makeAuthenticatedRequest(
      `/your-api-endpoint?${params}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
    return {
      data: data.items || [],
      totalCount: data.total_count || 0,
      hasNext: data.has_next || false,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { data: [], totalCount: 0, hasNext: false };
  }
}
```

### Step 2: Create Page Component

Create a server component page that extracts pagination params and fetches data:

```typescript
// src/app/session/your-page/page.tsx
import { fetchYourData } from "./actions";
import { YourDataComponent } from "@/components/your-component";
import { extractPaginationParams } from "@/lib/pagination-utils";

interface YourPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const DEFAULT_PAGE_SIZE = 50;
const PAGE_PARAM_KEY = "your_table_page";

export default async function YourPage({ searchParams }: YourPageProps) {
  const { currentPage, pageSize, baseUrl } = await extractPaginationParams(
    searchParams,
    DEFAULT_PAGE_SIZE,
    PAGE_PARAM_KEY,
  );

  const data = await fetchYourData(currentPage, pageSize);

  return (
    <div className="w-full px-4 md:px-12 py-4 md:py-6 mb-16 flex flex-col h-full">
      <YourDataComponent
        data={data.data}
        currentPage={currentPage}
        pageSize={pageSize}
        currentPageItems={data.data.length}
        hasNextPage={data.hasNext}
        baseUrl={baseUrl}
        pageParamKey={PAGE_PARAM_KEY}
      />
    </div>
  );
}
```

### Step 3: Create Data Display Component

Create a client component that displays data and pagination:

```typescript
// src/components/your-component.tsx
"use client";

import ServerPagination from "@/components/common/server-pagination";

interface YourDataComponentProps {
  data: YourDataType[];
  currentPage: number;
  pageSize: number;
  currentPageItems: number;
  hasNextPage: boolean;
  baseUrl: string;
  pageParamKey?: string;
}

export function YourDataComponent({
  data,
  currentPage,
  pageSize,
  currentPageItems,
  hasNextPage,
  baseUrl,
  pageParamKey,
}: YourDataComponentProps) {
  const isEmpty = data.length === 0;
  const emptyMessage =
    currentPage > 0
      ? "No items found on this page"
      : "No items at the moment";

  return (
    <div className="flex flex-col gap-4">
      {isEmpty ? (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-20rem)] my-auto">
          <span className="text-sm font-display text-center tracking-wide text-text-secondary">
            {emptyMessage}
          </span>
        </div>
      ) : (
        data.map((item) => (
          <YourItemComponent key={item.id} item={item} />
        ))
      )}
      <ServerPagination
        currentPage={currentPage}
        pageSize={pageSize}
        currentPageItems={currentPageItems}
        hasNextPage={hasNextPage}
        baseUrl={baseUrl}
        pageParamKey={pageParamKey}
      />
    </div>
  );
}
```

## Multiple Tables on Same Page

When you have multiple paginated tables on the same page, use different parameter keys:

```typescript
const ORDERS_PAGE_KEY = "order_page";
const SUBSCRIPTIONS_PAGE_KEY = "subscription_page";
const PAYMENTS_PAGE_KEY = "payment_page";

export default async function DashboardPage({ searchParams }: PageProps) {
  const ordersParams = await extractPaginationParams(
    searchParams,
    50,
    ORDERS_PAGE_KEY,
  );

  const subscriptionsParams = await extractPaginationParams(
    searchParams,
    50,
    SUBSCRIPTIONS_PAGE_KEY,
  );

  const ordersData = await fetchOrders(ordersParams.currentPage, ordersParams.pageSize);
  const subscriptionsData = await fetchSubscriptions(
    subscriptionsParams.currentPage,
    subscriptionsParams.pageSize,
  );

  return (
    <div>
      <OrdersTable
        data={ordersData.data}
        {...ordersParams}
        pageParamKey={ORDERS_PAGE_KEY}
      />
      <SubscriptionsTable
        data={subscriptionsData.data}
        {...subscriptionsParams}
        pageParamKey={SUBSCRIPTIONS_PAGE_KEY}
      />
    </div>
  );
}
```

## API Reference

### `extractPaginationParams`

Extracts and validates pagination parameters from Next.js 15 searchParams.

**Parameters:**
- `searchParams: Promise<Record<string, string | string[] | undefined>>` - Next.js 15 searchParams
- `defaultPageSize: number = 50` - Default page size if not specified
- `pageParamKey: string = "page"` - Custom parameter name for the page number

**Returns:**
```typescript
{
  currentPage: number;    // Validated page number (0-indexed)
  pageSize: number;       // Validated page size
  baseUrl: string;        // Base URL with all params except page
}
```

### `ServerPagination` Component

Reusable pagination UI component with client-side navigation.

**Props:**
- `currentPage: number` - Current page number (0-indexed)
- `pageSize: number` - Number of items per page
- `currentPageItems: number` - Number of items on current page
- `hasNextPage: boolean` - Whether there are more pages available
- `baseUrl: string` - Base URL with query params (excluding page param)
- `pageParamKey?: string` - Custom parameter name (defaults to "page")

**Behavior:**
- Next button is enabled when `currentPageItems === pageSize`
- Previous button is enabled when `currentPage > 0`
- Uses Next.js Link for client-side navigation (no full page refresh)
- Shows ellipsis for large page ranges
- Displays up to 5 visible page numbers

## Utility Functions

### `parsePageNumber`
Parses and validates page number from URL parameter. Handles invalid, negative, and NaN values.

### `buildPaginationBaseUrl`
Constructs base URL from searchParams, excluding the page parameter. Preserves all other query parameters.

### `buildPageUrl`
Builds pagination URL with page parameter. Handles both cases: baseUrl with or without existing params.

### `validatePaginationParams`
Validates pagination parameters and returns normalized values.

## Best Practices

1. **Always use custom parameter names** when multiple tables exist on the same page
2. **Set a constant for page size** at the top of your page component for easy configuration
3. **Handle empty states** with appropriate messages for page 0 vs page > 0
4. **Use the same pageParamKey** throughout your component tree (page → data component → pagination component)
5. **Keep page size consistent** - The default is 50, but you can customize per table

## Example: Complete Implementation

See `src/app/session/orders/page.tsx` for a complete working example.

## Troubleshooting

**Issue: Pagination not working**
- Ensure `pageParamKey` is consistent across all components
- Check that `baseUrl` is correctly constructed
- Verify that your server action is using the correct API parameters

**Issue: Multiple tables conflict**
- Use unique `pageParamKey` values for each table
- Ensure each table has its own `extractPaginationParams` call with different keys

**Issue: Next button not appearing**
- Check that `currentPageItems === pageSize` (you got a full page)
- Verify `hasNextPage` is correctly set from API response

