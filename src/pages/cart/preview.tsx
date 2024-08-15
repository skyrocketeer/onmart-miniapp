import { DisplayPrice } from "components/display/price";
import { useCreateOrder } from "hooks";
import { useForm, SubmitHandler, useFormContext } from 'react-hook-form';
import React, { FC, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { cartState, shippingInfoState, totalPriceState, totalQuantityState } from "state";
import { OrderData, ShippingData } from "types/order";
import { v4 as uuidv4 } from 'uuid';
import { Box, Button, Text, useNavigate } from "zmp-ui";

export const CartPreview = () => {
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
      quantity,
      item: listOrderItem
    } as OrderData
  }

  // Custom validation function
  const validateOrder = (data: ShippingData) => {
    const errors: any = {};
    if (!data.shippingAddressText) {
      errors.address = 'Shipping address is required';
    }
    return errors;
  };

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
        fullWidth
        type="highlight"
        disabled={!quantity}
        htmlType="submit"
      >
        Đặt hàng
      </Button>
    </Box>
  );
};
