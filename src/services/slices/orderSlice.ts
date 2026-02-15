import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

type OrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  currentOrder: TOrder | null; // для просмотра конкретного заказа
  loading: boolean;
  error: string | null;
};

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  currentOrder: null,
  loading: false,
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

export const getOrderByNumber = createAsyncThunk(
  'order/getByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // postOrder
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
      })
      // getOrderByNumber
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  }
});

export const { clearOrderModalData, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
