import { FC, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { clearConstructor } from '../../services/slices/burgerConstructorSlice';
import {
  postOrder,
  clearOrderModalData
} from '../../services/slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector((state) => state.burgerConstructor);
  const orderRequest = useSelector((state) => state.order.orderRequest);
  const orderModalData = useSelector((state) => state.order.orderModalData);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    dispatch(postOrder()).then(() => {
      dispatch(clearConstructor());
    });
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
