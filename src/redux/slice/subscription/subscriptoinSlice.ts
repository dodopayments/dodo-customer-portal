import { tokenHelper } from "@/lib/token-helper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { setTokenData } from "../token/tokenSlice";

import { api } from "@/lib/http";

export type SubscriptionResponse = {
  created_at: string;
  currency: string;
  customer: {
    customer_id: string;
    email: string;
    name: string;
  };
  discount_id: string;
  metadata: object;
  next_billing_date: string;
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
};

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

export const cancelSubscription = createAsyncThunk(
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
  },
});

export const { setSubscriptions } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
