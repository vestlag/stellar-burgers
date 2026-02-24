import feedsReducer, { getFeeds } from '../feedsSlice';
import { TOrder } from '@utils-types';

const initialState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

describe('feeds slice', () => {
  const mockOrders: TOrder[] = [
    {
      _id: '1',
      status: 'done',
      name: 'Order 1',
      createdAt: '',
      updatedAt: '',
      number: 101,
      ingredients: []
    }
  ];

  it('должен возвращать начальное состояние', () => {
    expect(feedsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен устанавливать loading true при pending', () => {
    const action = { type: getFeeds.pending.type };
    const state = feedsReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен заполнять данные при fulfilled', () => {
    const payload = {
      orders: mockOrders,
      total: 10,
      totalToday: 2
    };
    const action = { type: getFeeds.fulfilled.type, payload };
    const state = feedsReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(payload.orders);
    expect(state.total).toBe(10);
    expect(state.totalToday).toBe(2);
    expect(state.error).toBeNull();
  });

  it('должен устанавливать ошибку при rejected', () => {
    const errorMessage = 'Ошибка ленты';
    const action = { type: getFeeds.rejected.type, error: { message: errorMessage } };
    const state = feedsReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.orders).toEqual([]);
  });
});
