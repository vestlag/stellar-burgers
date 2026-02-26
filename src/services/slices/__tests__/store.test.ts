import { rootReducer } from '../../store';
import { configureStore } from '@reduxjs/toolkit';

describe('rootReducer', () => {
  it('должен корректно инициализироваться', () => {
    const store = configureStore({ reducer: rootReducer });
    const state = store.getState();
    
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('feeds');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('order');
  });

  it('должен возвращать начальное состояние при неизвестном экшене', () => {
    const initialState = rootReducer(undefined, { type: '' });
    const unknownActionState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(unknownActionState).toEqual(initialState);
  });
});
