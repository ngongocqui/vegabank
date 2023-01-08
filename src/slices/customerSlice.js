import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  id: "",
  is_confirmed: false,
  name: "",
  type: "",
};

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    updateCustomerInfo: (state, action) => {
      const fields = action.payload;
      Object.keys(fields).map((k) => {
        state[k] = fields[k];
      });
    },
    resetAllCustomer: (state, _) => {
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

export const { updateCustomerInfo, resetAllCustomer, resetField } =
  customerSlice.actions;

export const customerInfo = (state) => state.customer;

export default customerSlice.reducer;
