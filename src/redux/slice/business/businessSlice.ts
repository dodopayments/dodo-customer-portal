import { api } from "@/lib/http";
import { RootState } from "@/redux/configure-store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { tokenHelper } from "@/lib/token-helper";
import { setTokenData } from "@/redux/slice/token/tokenSlice";

export type BusinessResponse = {
  business_id: string;
  name?: string;
  description?: string;
  support_email?: string;
  logo: string;
  country?: string;
};

const initialState: {
  business: BusinessResponse | null;
  error: string | null;
} = {
  business: null,
  error: null,
};

export const fetchBusiness = createAsyncThunk(
  "business/fetchBusiness",
  async (_, { dispatch }) => {
    try {
      const tokenData = tokenHelper.get();
      if (!tokenData) {
        dispatch(setTokenData(null));
        throw new Error("No valid token found");
      }

      const response = await api.get<BusinessResponse>(
        "/customer-portal/business",
        {
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

export const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBusiness.fulfilled, (state, action) => {
      state.business = action.payload as BusinessResponse;
    });
    builder.addCase(fetchBusiness.rejected, (state, action) => {
      state.error = action.error.message ?? null;
    });
  },
});

export const selectBusiness = (state: RootState) => state.business.business;

export default businessSlice.reducer;
