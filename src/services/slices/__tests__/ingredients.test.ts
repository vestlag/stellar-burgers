import ingredientsReducer, { getIngredients } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

const initialState = {
  ingredients: [],
  loading: false,
  error: null
};

describe('ingredients slice', () => {
  it('должен возвращать начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен устанавливать loading true при pending', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен заполнять данные при fulfilled', () => {
    const mockIngredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Bun',
        type: 'bun',
        proteins: 0,
        fat: 0,
        carbohydrates: 0,
        calories: 0,
        price: 100,
        image: '',
        image_mobile: '',
        image_large: ''
      }
    ];
    const action = { type: getIngredients.fulfilled.type, payload: mockIngredients };
    const state = ingredientsReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  it('должен устанавливать ошибку при rejected', () => {
    const errorMessage = 'Ошибка загрузки';
    const action = { type: getIngredients.rejected.type, error: { message: errorMessage } };
    const state = ingredientsReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.ingredients).toEqual([]);
  });
});
