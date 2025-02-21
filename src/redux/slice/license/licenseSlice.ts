import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { tokenHelper } from "@/lib/token-helper";
import { api } from "@/lib/http";
import { setTokenData } from "../token/tokenSlice";
import { AxiosError } from "axios";

export type LicenseResponse = {
  activations_limit: number;
  business_id: string;
  created_at: string;
  customer_id: string;
  expires_at: string;
  id: string;
  instances_count: number;
  key: string;
  payment_id: string;
  product_id: string;
  status: string;
  subscription_id: string;
};

const initialState: {
  licenses: {
    data: LicenseResponse[];
  };
} = {
  licenses: {
    data: [],
  },
};

export const fetchLicenses = createAsyncThunk(
  "license/fetchLicenses",
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

      const response = await api.get<{ items: LicenseResponse[] }>(
        "/customer-portal/license-keys",
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

const licenseSlice = createSlice({
  name: "license",
  initialState,
  reducers: {
    setLicenses: (state, action) => {
      state.licenses = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLicenses.fulfilled, (state, action) => {
      state.licenses.data = action.payload.items;
    });
  },
});

export const { setLicenses } = licenseSlice.actions;
export default licenseSlice.reducer;
