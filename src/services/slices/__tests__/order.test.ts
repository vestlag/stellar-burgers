import orderReducer, {
  postOrder,
  getOrderByNumber,
  clearOrderModalData,
  clearCurrentOrder
} from '../orderSlice';
import { TOrder } from '@utils-types';

const initialState = {
  orderRequest: false,
  orderModalData: null,
  currentOrder: null,
  loading: false,
  error: null
};

describe('order slice', () => {
  const mockOrder: TOrder = {
    _id: '1',
    status: 'done',
    name: 'Order',
    createdAt: '',
    updatedAt: '',
    number: 123,
    ingredients: []
  };

  it('должен возвращать начальное состояние', () => {
    expect(orderReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен устанавливать orderRequest=true при postOrder.pending', () => {
    const action = { type: postOrder.pending.type };
    const state = orderReducer(initialState, action);
    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен заполнять orderModalData при postOrder.fulfilled', () => {
    const action = { type: postOrder.fulfilled.type, payload: mockOrder };
    const state = orderReducer(initialState, action);
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockOrder);
  });

  it('должен очищать orderModalData', () => {
    const stateWithOrder = { ...initialState, orderModalData: mockOrder };
    const action = clearOrderModalData();
    const state = orderReducer(stateWithOrder, action);
    expect(state.orderModalData).toBeNull();
  });

  it('должен устанавливать currentOrder при getOrderByNumber.fulfilled', () => {
    const action = { type: getOrderByNumber.fulfilled.type, payload: mockOrder };
    const state = orderReducer(initialState, action);
    expect(state.currentOrder).toEqual(mockOrder);
    expect(state.loading).toBe(false);
  });
});
