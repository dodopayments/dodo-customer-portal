import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { tokenHelper } from "@/lib/token-helper";
import { api } from "@/lib/http";
import { setTokenData } from "../token/tokenSlice";
import { AxiosError } from "axios";

export type UserResponse = {
  business_id: string;
  created_at: string;
  customer_id: string;
  email: string;
  name: string;
  phone_number: string;
};

const initialState = {
  user: null,
};

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { dispatch }) => {
    try {
      const tokenData = tokenHelper.get();
      if (!tokenData) {
        dispatch(setTokenData(null));
        throw new Error("No valid token found");
      }

      const response = await api.get<UserResponse>(
        "/customer-portal/profile",
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
