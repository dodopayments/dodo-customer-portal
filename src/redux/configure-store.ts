import {
  Action,
  combineSlices,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import businessReducer from "./slice/business/businessSlice";
import tokenReducer from "./slice/token/tokenSlice";
import transactionReducer from "./slice/transaction/transactionSlice";
const rootReducer = combineSlices({
  token: tokenReducer,
  business: businessReducer,
  transaction: transactionReducer,
});
export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
  });
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof makeStore>;

export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
