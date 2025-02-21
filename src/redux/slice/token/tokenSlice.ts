import { RootState } from "@/redux/configure-store";
import { createSlice } from "@reduxjs/toolkit";
import { TokenData } from "@/lib/token-helper";

interface TokenState {
  token: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
}

const initialState: TokenState = {
  token: null,
  expiresAt: null,
  isAuthenticated: false,
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setTokenData: (state, action: { payload: TokenData | null }) => {
      if (action.payload) {
        state.token = action.payload.token;
        state.expiresAt = action.payload.expiresAt;
        state.isAuthenticated = true;
      } else {
        state.token = null;
        state.expiresAt = null;
        state.isAuthenticated = false;
      }
    },
  },
});     

export const { setTokenData } = tokenSlice.actions;
export const selectToken = (state: RootState) => state.token;
export default tokenSlice.reducer;
