// counterReducer.js// counterReducer.js
import { createSlice } from "@reduxjs/toolkit";

export const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],
    total: 0,
    filter: "",
  },
  reducers: {
    addTransaction: (state, action) => {
      let newtotal = state.total;
      action.payload?.map((item, key) => {
        if (state.transactions.length !== 0)
          item.id = state.transactions.length + key + 1;
        newtotal = newtotal + Number(item?.price) * Number(item?.quantity);
      });

      state.transactions = state.transactions.concat(action.payload);
      state.total = newtotal;
    },
    deleteTransaction: (state, action) => {
      state.transactions = state.transactions.filter(
        (item) => item.id !== action.payload.id
      );
      state.total = state.total - action?.payload?.price;
    },
    deleteAllTransaction: (state) => {
      state.transactions = [];
      state.total = 0;
    },

    updateTransaction: (state, action) => {
      let item = state.transactions?.find(
        (item) => item.id == action.payload.id
      );
      let toadd = action.payload.price - item.price;

      state.total = state.total + toadd;
      state.transactions = state.transactions.map((item) => {
        return item.id == action.payload.id ? action.payload : item;
      });
    },
    searchTransaction: (state, action) => {
      state.filter = action.payload;
    },
  },
});

export const {
  addTransaction,
  deleteTransaction,
  updateTransaction,
  deleteAllTransaction,
  searchTransaction,
} = transactionSlice.actions;
export default transactionSlice.reducer;
