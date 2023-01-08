import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    updateAccountInfo: (state, action) => {
      const fields = action.payload;
      Object.keys(fields).map((k) => {
        state[k] = fields[k];
      });
    },
    resetAllAccount: (state, _) => {
      Object.keys(initialState).map((k) => {
        state[k] = initialState[k];
      });
    },
    resetField: (state, action) => {
      const { field } = action.payload;
      state[field] = initialState[field];
    },
  },
});

export const { updateAccountInfo, resetAllAccount, resetField } =
  accountSlice.actions;

export const accountInfo = (state) => state.account;

export default accountSlice.reducer;
