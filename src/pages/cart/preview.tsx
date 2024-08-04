import { DisplayPrice } from "components/display/price";
import { useCreateOrder } from "hooks";
import React, { FC, useState } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { cartState, defaultShippingState, shippingInfoState, totalPriceState, totalQuantityState } from "state";
import { OrderData } from "types/order";
import { v4 as uuidv4 } from 'uuid';
import { Box, Button, Text, useNavigate } from "zmp-ui";

export const CartPreview: FC = () => {
  const quantity = useRecoilValue(totalQuantityState);
  const totalPrice = useRecoilValue(totalPriceState);
  const cart = useRecoilValue(cartState);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate();
  const shippingInfo = useRecoilValue(shippingInfoState)
  const resetShipDataState = useResetRecoilState(shippingInfoState)
  const resetOrderDataState = useResetRecoilState(cartState)

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
      method: {
        id: "COD",
        isCustom: false,
      },
      quantity: quantity,
      item: listOrderItem
    } as OrderData
  }

  const handleCreateOrder = async () => {
    setIsSubmitting(true)
    await useCreateOrder(generateMacData(), shippingInfo, (orderId: string) => {
      try {
        setIsSubmitting(false)
        navigate(`/result${location.search}`)
      } catch (err) {
        console.log('payment err ', err)
      }
    })
    resetOrderDataState()
    resetShipDataState()
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
        disabled={!quantity || isSubmitting}
        fullWidth
        onClick={handleCreateOrder}
      >
        Đặt hàng
      </Button>
    </Box>
  );
};
