import userReducer, {
  loginUser,
  logoutUser,
  checkUserAuth,
  updateUser
} from '../userSlice';

const initialState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null
};

describe('user slice', () => {
  it('должен возвращать начальное состояние', () => {
    expect(userReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен устанавливать пользователя при loginUser.fulfilled', () => {
    const mockUser = { email: 'test@test.com', name: 'Test' };
    const action = { type: loginUser.fulfilled.type, payload: mockUser };
    const state = userReducer(initialState, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
    expect(state.loading).toBe(false);
  });

  it('должен очищать пользователя при logoutUser.fulfilled', () => {
    const prevState = { ...initialState, user: { email: 'test', name: 'Test' } };
    const action = { type: logoutUser.fulfilled.type };
    const state = userReducer(prevState, action);
    expect(state.user).toBeNull();
  });

});
