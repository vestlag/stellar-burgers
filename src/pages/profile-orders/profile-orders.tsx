// src/pages/profile-orders/profile-orders.tsx
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUserOrders } from '../../services/slices/ordersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  if (loading) {
    return <div>Загрузка...</div>; // или Preloader
  }

  return <ProfileOrdersUI orders={orders} />;
};
