import { DisplayPrice } from "components/display/price";
import { useCreateOrder } from "hooks";
import React, { FC } from "react";
import { useRecoilValue } from "recoil";
import { cartState, totalPriceState, totalQuantityState } from "state";
import { OrderData } from "types/order";
import { v4 as uuidv4 } from 'uuid';
import { Box, Button, Text } from "zmp-ui";

export const CartPreview: FC = () => {
  const quantity = useRecoilValue(totalQuantityState);
  const totalPrice = useRecoilValue(totalPriceState);
  const cart = useRecoilValue(cartState);

  const generateMacData = () => {
    const tid = uuidv4()
    const listOrderItem: Record<string, any>[] = []
    cart.forEach(item => {
      listOrderItem.push({
        id: item.product.sku,
        quantity: item.quantity
      })
    })

    return {
      amount: totalPrice,
      extraData: {
        storeName: 'ONMART',
        orderGroupId: tid,
        myTransactionId: tid,
        notes: "Test"
      },
      method: "COD",
      quantity: quantity,
      item: listOrderItem
    } as OrderData
  }

  return (
    <Box flex className="sticky bottom-0 bg-background p-4 space-x-4">
      <Box
        flex
        flexDirection="column"
        justifyContent="space-between"
        className="min-w-[120px] flex-none"
      >
        <Text className="text-gray" size="xSmall">
          {quantity} sản phẩm
        </Text>
        <Text.Title size="large">
          <DisplayPrice>{totalPrice}</DisplayPrice>
        </Text.Title>
      </Box>
      <Button
        type="highlight"
        disabled={!quantity}
        fullWidth
        onClick={() => useCreateOrder(generateMacData())}
      >
        Đặt hàng
      </Button>
    </Box>
  );
};
