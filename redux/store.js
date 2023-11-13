import transactionReducer from "./reducers/transactionReducers";
import inventoryReducer from "./reducers/inventoryReducers";
import incomeReducer from "./reducers/incomeReducers";
import { configureStore } from "@reduxjs/toolkit";

export default configureStore({
  reducer: {
    transactionStates: transactionReducer,
    inventoryStates: inventoryReducer,
    incomeStates: incomeReducer,
  },
  devTools: true,
});
