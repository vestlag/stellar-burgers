import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { getOrderByNumber } from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const orderFromStore = useSelector((state) => state.order.currentOrder);
  const orders = useSelector((state) => state.feeds.orders);
  const userOrders = useSelector((state) => state.orders.orders);
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const loading = useSelector((state) => state.order.loading);

  // Ищем заказ по номеру сначала в ленте, потом в истории заказов
  const existingOrder = [...orders, ...userOrders].find(
    (item) => item.number === Number(number)
  );

  const orderData = existingOrder || orderFromStore;

  useEffect(() => {
    if (!existingOrder && number && !orderFromStore) {
      dispatch(getOrderByNumber(Number(number)));
    }
  }, [existingOrder, number, orderFromStore, dispatch]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (loading || (!orderInfo && !orderData)) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <div>Заказ не найден</div>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
