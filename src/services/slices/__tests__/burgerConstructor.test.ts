import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from '../burgerConstructorSlice';
import { TIngredient } from '@utils-types';

const initialState = {
  bun: null,
  ingredients: []
};

describe('burgerConstructor slice', () => {
  it('должен возвращать начальное состояние', () => {
    expect(burgerConstructorReducer(undefined, { type: '' })).toEqual(
      initialState
    );
  });

  it('должен добавлять булку', () => {
    const bun: TIngredient = {
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
    };
    const action = addIngredient(bun);
    const state = burgerConstructorReducer(initialState, action);
    expect(state.bun).toBeDefined();
    expect(state.bun?.name).toBe('Bun');
    expect(state.bun?.id).toBeDefined();
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен добавлять начинку', () => {
    const main: TIngredient = {
      _id: '2',
      name: 'Meat',
      type: 'main',
      proteins: 10,
      fat: 10,
      carbohydrates: 0,
      calories: 200,
      price: 50,
      image: '',
      image_mobile: '',
      image_large: ''
    };
    const action = addIngredient(main);
    const state = burgerConstructorReducer(initialState, action);
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].name).toBe('Meat');
    expect(state.ingredients[0].id).toBeDefined();
  });

  it('должен удалять ингредиент', () => {
    const stateWithIngredient = {
      bun: null,
      ingredients: [
        {
          _id: '2',
          name: 'Meat',
          type: 'main',
          proteins: 10,
          fat: 10,
          carbohydrates: 0,
          calories: 200,
          price: 50,
          image: '',
          image_mobile: '',
          image_large: '',
          id: 'some-id'
        }
      ]
    };
    const action = removeIngredient({ id: 'some-id' });
    const state = burgerConstructorReducer(stateWithIngredient, action);
    expect(state.ingredients).toHaveLength(0);
  });

  it('должен перемещать ингредиент вверх', () => {
    const stateWithTwo = {
      bun: null,
      ingredients: [
        {
          _id: '2',
          name: 'Meat',
          type: 'main',
          proteins: 10,
          fat: 10,
          carbohydrates: 0,
          calories: 200,
          price: 50,
          image: '',
          image_mobile: '',
          image_large: '',
          id: 'id1'
        },
        {
          _id: '3',
          name: 'Cheese',
          type: 'main',
          proteins: 5,
          fat: 15,
          carbohydrates: 2,
          calories: 150,
          price: 30,
          image: '',
          image_mobile: '',
          image_large: '',
          id: 'id2'
        }
      ]
    };
    const action = moveIngredientUp({ index: 1 });
    const state = burgerConstructorReducer(stateWithTwo, action);
    expect(state.ingredients[0].id).toBe('id2');
    expect(state.ingredients[1].id).toBe('id1');
  });

  it('должен перемещать ингредиент вниз', () => {
    const stateWithTwo = {
      bun: null,
      ingredients: [
        {
          _id: '2',
          name: 'Meat',
          type: 'main',
          proteins: 10,
          fat: 10,
          carbohydrates: 0,
          calories: 200,
          price: 50,
          image: '',
          image_mobile: '',
          image_large: '',
          id: 'id1'
        },
        {
          _id: '3',
          name: 'Cheese',
          type: 'main',
          proteins: 5,
          fat: 15,
          carbohydrates: 2,
          calories: 150,
          price: 30,
          image: '',
          image_mobile: '',
          image_large: '',
          id: 'id2'
        }
      ]
    };
    const action = moveIngredientDown({ index: 0 });
    const state = burgerConstructorReducer(stateWithTwo, action);
    expect(state.ingredients[0].id).toBe('id2');
    expect(state.ingredients[1].id).toBe('id1');
  });

  it('должен очищать конструктор', () => {
    const nonEmptyState = {
      bun: {
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
        image_large: '',
        id: 'bun-id'
      },
      ingredients: [
        {
          _id: '2',
          name: 'Meat',
          type: 'main',
          proteins: 10,
          fat: 10,
          carbohydrates: 0,
          calories: 200,
          price: 50,
          image: '',
          image_mobile: '',
          image_large: '',
          id: 'id1'
        }
      ]
    };
    const action = clearConstructor();
    const state = burgerConstructorReducer(nonEmptyState, action);
    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([]);
  });
});
