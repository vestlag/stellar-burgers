import ordersReducer, { getUserOrders } from '../ordersSlice';
import { TOrder } from '@utils-types';

const initialState = {
  orders: [],
  loading: false,
  error: null
};

describe('orders slice', () => {
  const mockOrders: TOrder[] = [
    {
      _id: '1',
      status: 'done',
      name: 'My Order',
      createdAt: '',
      updatedAt: '',
      number: 101,
      ingredients: []
    }
  ];

  it('должен возвращать начальное состояние', () => {
    expect(ordersReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен устанавливать loading true при pending', () => {
    const action = { type: getUserOrders.pending.type };
    const state = ordersReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен заполнять данные при fulfilled', () => {
    const action = { type: getUserOrders.fulfilled.type, payload: mockOrders };
    const state = ordersReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.error).toBeNull();
  });

  it('должен устанавливать ошибку при rejected', () => {
    const errorMessage = 'Ошибка заказов';
    const action = { type: getUserOrders.rejected.type, error: { message: errorMessage } };
    const state = ordersReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.orders).toEqual([]);
  });
});
