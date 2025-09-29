/* eslint-disable @typescript-eslint/no-explicit-any */
import { tokenHelper } from "@/lib/token-helper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { setTokenData } from "../token/tokenSlice";
import { api } from "@/lib/http";
import parseError from "@/lib/parseError";
import { RootState } from "@/redux/configure-store";
import type { AppDispatch } from "@/redux/configure-store";

export type SubscriptionResponse = {
  created_at: string;
  currency: string;
  customer: {
    customer_id: string;
    email: string;
    name: string;
  };
  billing: {
    city: string;
    country: string;
    state: string;
    street: string;
    zipcode: string;
  };
  discount_id: string;
  metadata: object;
  next_billing_date: string;
  on_demand: boolean;
  payment_frequency_count: number;
  payment_frequency_interval: string;
  product_id: string;
  quantity: number;
  recurring_pre_tax_amount: number;
  status: string;
  subscription_id: string;
  subscription_period_count: number;
  subscription_period_interval: string;
  tax_inclusive: boolean;
  trial_period_days: number;
  cancel_at_next_billing_date?: boolean;
};

// Subscription type for the advanced cancel thunk
export type Subscription = SubscriptionResponse;

export type UsageHistoryResponse = {
  chargeable_units: string;
  consumed_units: string;
  currency: string;
  free_threshold: number;
  last_submitted_event_timestamp?: string;
  meter_id: string;
  meter_name: string;
  price_per_unit: string;
  subscription_id: string;
  total_price: string;
};

export type UsageHistoryResponseByMeterId = {
  consumed_units: string;
  event_id: string;
  event_name: string;
  timestamp: string;
};

// Helper function to get access token
export const getAccessToken = createAsyncThunk(
  "subscription/getAccessToken",
  async (_, { dispatch }) => {
    const tokenData = tokenHelper.get();
    if (!tokenData) {
      dispatch(setTokenData(null));
      throw new Error("No valid token found");
    }
    return tokenData.token;
  }
);

// Selectors (keeping for potential future use)
// export const selectMode = (): string => Mode;
// export const selectApiByMode = (mode: string) => api;

export const fetchSubscriptions = createAsyncThunk(
  "transaction/fetchSubscriptions",
  async (
    {
      pageSize,
      pageNumber,
      created_at_gte,
      created_at_lte,
      status,
    }: {
      pageSize: number;
      pageNumber: number;
      created_at_gte?: Date;
      created_at_lte?: Date;
      status?: string;
    },
    { dispatch }
  ) => {
    try {
      const tokenData = tokenHelper.get();
      if (!tokenData) {
        dispatch(setTokenData(null));
        throw new Error("No valid token found");
      }

      const response = await api.get<{ items: SubscriptionResponse[] }>(
        "/customer-portal/subscriptions",
        {
          params: {
            page_size: pageSize,
            page_number: pageNumber,
            created_at_gte,
            created_at_lte,
            status,
          },
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenData(null));
        }
        throw error;
      }
      throw error;
    }
  }
);

export const fetchUsageHistory = createAsyncThunk(
  "transaction/fetchUsageHistory",
  async (
    {
      pageSize,
      pageNumber,
    }: {
      pageSize: number;
      pageNumber: number;
    },
    { dispatch }
  ) => {
    try {
      const tokenData = tokenHelper.get();
      if (!tokenData) {
        dispatch(setTokenData(null));
        throw new Error("No valid token found");
      }

      const response = await api.get<{ items: UsageHistoryResponse[] }>(
        "/customer-portal/subscriptions/usage-history",
        {
          params: {
            page_size: pageSize,
            page_number: pageNumber,
          },
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenData(null));
        }
        throw error;
      }
      throw error;
    }
  }
);
export const fetchUsageHistoryByMeterId = createAsyncThunk(
  "transaction/fetchUsageHistory",
  async (
    {
      pageSize,
      pageNumber,
      start,
      end,
      subscription_id,
      meter_id,
    }: {
      pageSize: number;
      pageNumber: number;
      start?: string;
      end?: string;
      subscription_id: string;
      meter_id: string;
    },
    { dispatch }
  ) => {
    try {
      const tokenData = tokenHelper.get();
      if (!tokenData) {
        dispatch(setTokenData(null));
        throw new Error("No valid token found");
      }

      const response = await api.get<{
        items: UsageHistoryResponseByMeterId[];
      }>(
        `/customer-portal/subscriptions/${subscription_id}/meters/${meter_id}`,

        {
          params: {
            page_size: pageSize,
            page_number: pageNumber,
            start: start ? start : "2020-09-02T07:19:53.000Z",
            end: end ? end : new Date().toISOString(),
          },
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenData(null));
        }
        throw error;
      }
      throw error;
    }
  }
);

export const updateBillingDetails = createAsyncThunk(
  "subscription/updateBillingDetails",
  async (
    {
      subscription_id,
      data,
    }: {
      subscription_id: string;
      data: {
        billing: {
          city: string;
          country: string;
          state: string;
          street: string;
          zipcode: string;
        };
        tax_id: string | null;
      };
    },
    { dispatch }
  ) => {
    try {
      const tokenData = tokenHelper.get();
      if (!tokenData) {
        dispatch(setTokenData(null));
        throw new Error("No valid token found");
      }
      const patchData = {
        billing: data.billing,
        tax_id: data.tax_id === "" ? null : data.tax_id,
      };
      const response = await api.patch(
        `/customer-portal/subscriptions/${subscription_id}`,
        patchData,
        {
          headers: { Authorization: `Bearer ${tokenData.token}` },
        }
      );
      return response.data;
    } catch (error) {
      parseError(error);
      throw error;
    }
  }
);

// Advanced cancelSubscription thunk
export const cancelSubscription = createAsyncThunk<
  Subscription,
  {
    selectedId: string;
    subscription_id: string;
    nextBillingDate: boolean;
    revoke?: boolean;
  },
  { state: RootState; dispatch: AppDispatch }
>(
  "subscriptions/cancelSubscription",
  async (
    { selectedId, subscription_id, nextBillingDate, revoke },
    { dispatch }
  ) => {
    const accessToken = await dispatch(getAccessToken()).unwrap();
    let body;

    if (revoke) {
      body = JSON.stringify({
        cancel_at_next_billing_date: false,
      });
    } else {
      if (nextBillingDate) {
        body = JSON.stringify({
          cancel_at_next_billing_date: nextBillingDate,
        });
      } else {
        body = JSON.stringify({
          status: "cancelled",
        });
      }
    }
    try {
      const response = await api.patch<Subscription>(
        `/customer-portal/subscriptions/${subscription_id}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "business-id": selectedId,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      parseError(error, "Failed to cancel subscription");
      throw error;
    }
  }
);

export const cancelSubscriptionLegacy = createAsyncThunk(
  "transaction/cancelSubscription",
  async (subscription_id: string, { dispatch }) => {
    try {
      const tokenData = tokenHelper.get();
      if (!tokenData) {
        dispatch(setTokenData(null));
        throw new Error("No valid token found");
      }

      const response = await api.post(
        `/customer-portal/subscriptions/${subscription_id}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${tokenData.token}` },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          dispatch(setTokenData(null));
        }
      }
      throw error;
    }
  }
);

type initialState = {
  subscriptions: {
    data: SubscriptionResponse[];
  };
};

const initialState: initialState = {
  subscriptions: {
    data: [],
  },
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setSubscriptions: (state, action) => {
      state.subscriptions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSubscriptions.fulfilled, (state, action) => {
      state.subscriptions.data = action.payload.items;
    });
    builder.addCase(cancelSubscription.fulfilled, (state, action) => {
      // Update the subscription in the state with the new data
      const index = state.subscriptions.data.findIndex(
        (sub) => sub.subscription_id === action.payload.subscription_id
      );
      if (index !== -1) {
        state.subscriptions.data[index] = action.payload;
      }
    });
  },
});

export const { setSubscriptions } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
