import { createSlice } from "@reduxjs/toolkit";

export const incomeSlice = createSlice({
  name: "income",
  initialState: {
    incomelist: [],
    totalIncome: 0,
  },
  reducers: {
    addIncome: (state, action) => {
      state.incomelist = action.payload;
    },

    deleteAllIncome: (state, action) => {
      state.incomelist = [];
    },
  },
});

export const { addIncome, deleteAllIncome } = incomeSlice.actions;
export default incomeSlice.reducer;
