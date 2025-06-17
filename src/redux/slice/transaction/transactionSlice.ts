import { tokenHelper } from "@/lib/token-helper";
import { RootState } from "@/redux/configure-store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setTokenData } from "../token/tokenSlice";
import { api } from "@/lib/http";
import { AxiosError } from "axios";

export type PaymentResponse = {
  created_at: string;
  currency: string;
  customer: {
    customer_id: string;
    email: string;
    name: string;
  };
  metadata: object;
  payment_id: string;
  brand_id: string;
  digital_products_delivered: boolean;
  payment_method: string;
  payment_method_type: string;
  status: string;
  subscription_id: string;
  total_amount: number;
};

export type RefundResponse = {
  amount: number;
  business_id: string;
  created_at: string;
  currency: string;
  payment_id: string;
  reason: string;
  refund_id: string;
  status: string;
};

export type DigitalProductResponse = {
  deliverable: {
    external_url?: string;
    files?: {
      file_id: string;
      file_name: string;
      url: string;
    }[];
    instructions?: string;
  };
  description?: string;
  name: string;
  product_id: string;
};

export const fetchPayments = createAsyncThunk(
  "transaction/fetchPayments",
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

      const response = await api.get<{ items: PaymentResponse[] }>(
        "/customer-portal/payments",
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

export const fetchRefunds = createAsyncThunk(
  "transaction/fetchRefunds",
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

      const response = await api.get<{ items: RefundResponse[] }>(
        "/customer-portal/refunds",
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

export const fetchDigitalProducts = createAsyncThunk(
  "transaction/fetchDigitalProducts",
  async (payment_id: string, { dispatch }) => {
    const tokenData = tokenHelper.get();
    if (!tokenData) {
      dispatch(setTokenData(null));
      throw new Error("No valid token found");
    }

    const response = await api.get<{ items: DigitalProductResponse[] }>(
      `/customer-portal/payments/${payment_id}/digital-product-deliverables`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
      }
    );
    return response.data;
  }
);

type initialState = {
  payments: {
    data: PaymentResponse[];
    error: string | null;
    loading: boolean;
  };
  refunds: {
    data: RefundResponse[];
    error: string | null;
    loading: boolean;
  };
};

const initialState: initialState = {
  payments: {
    data: [],
    error: null,
    loading: false,
  },
  refunds: {
    data: [],
    error: null,
    loading: false,
  },
};
const transactionSlice = createSlice({
  name: "transaction",
  initialState: initialState,
  reducers: {
    setTransactions: (state, action) => {
      state.payments.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPayments.pending, (state) => {
      state.payments.loading = true;
    });
    builder.addCase(fetchPayments.fulfilled, (state, action) => {
      state.payments.data = action.payload.items;
      state.payments.loading = false;
    });
    builder.addCase(fetchPayments.rejected, (state, action) => {
      state.payments.loading = false;
      state.payments.error = action.error.message ?? null;
    });
    builder.addCase(fetchRefunds.pending, (state) => {
      state.refunds.loading = true;
    });
    builder.addCase(fetchRefunds.fulfilled, (state, action) => {
      state.refunds.data = action.payload.items;
      state.refunds.loading = false;
    });
    builder.addCase(fetchRefunds.rejected, (state, action) => {
      state.refunds.loading = false;
      state.refunds.error = action.error.message ?? null;
    });
  },
});

export const { setTransactions } = transactionSlice.actions;
export const selectTransactions = (state: RootState) => state.transaction;
export default transactionSlice.reducer;
