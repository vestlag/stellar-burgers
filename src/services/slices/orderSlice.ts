// src/services/slices/orderSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

type OrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const postOrder = createAsyncThunk(
  'order/postOrder',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const constructorItems = state.burgerConstructor;
    if (!constructorItems.bun) {
      throw new Error('Добавьте булку');
    }
    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    const response = await orderBurgerApi(ingredientsIds);
    return response.order;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      });
  }
});

export const { clearOrderModalData } = orderSlice.actions;
export default orderSlice.reducer;
