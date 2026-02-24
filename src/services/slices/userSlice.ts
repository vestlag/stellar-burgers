import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  TLoginData,
  TRegisterData,
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '@api';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';
import { RootState } from '../store';

type UserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null
};

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { state: RootState }
>('user/register', async (data) => {
  const response = await registerUserApi(data);
  setCookie('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);
  return response.user;
});

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { state: RootState }
>('user/login', async (data) => {
  const response = await loginUserApi(data);
  setCookie('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);
  return response.user;
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { state: RootState }
>('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const checkUserAuth = createAsyncThunk<
  TUser | null,
  void,
  { state: RootState; dispatch: any }
>('user/checkAuth', async (_, { dispatch }) => {
  if (getCookie('accessToken')) {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error) {
      dispatch(logoutUser());
      return null;
    }
  }
  return null;
});

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { state: RootState }
>('user/update', async (user) => {
  const response = await updateUserApi(user);
  return response.user;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка регистрации';
        state.isAuthChecked = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка входа';
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка обновления';
      });
  }
});

export const isAuthenticatedSelector = (state: RootState) => !!state.user.user;
export default userSlice.reducer;
