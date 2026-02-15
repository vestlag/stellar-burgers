// src/services/slices/ordersSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

type OrdersState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
};

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null
};

export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      });
  }
});

export default ordersSlice.reducer;
