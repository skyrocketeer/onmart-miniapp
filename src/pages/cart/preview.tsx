import { DisplayPrice } from "components/display/price";
import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { shippingInfoState, totalPriceState, totalQuantityState } from "state";
import { splitByComma } from "utils/price";
import { Box, Button, Text } from "zmp-ui";

export const CartPreview = ({ isSubmitting }: { isSubmitting: boolean }) => {
  const quantity = useRecoilValue(totalQuantityState);
  const totalPrice = useRecoilValue(totalPriceState);
  const SHIP_FEE = Number(process.env.SHIP_FEE) || 20000
  const FREESHIP_MIN_VALUE = Number(process.env.FREESHIP_AMOUNT) || 150000
  const actualShipFee = totalPrice > FREESHIP_MIN_VALUE ? 0 : SHIP_FEE
  const [shippingInfo, setShippingInfo] = useRecoilState(shippingInfoState)

  useEffect(() => {
    setShippingInfo({ ...shippingInfo, shippingFee: actualShipFee })
  }, [actualShipFee])

  return (
    <Box className="sticky bottom-0 bg-background p-4">
      <Box className="space-y-3">
      <Box
          flex
        justifyContent="space-between"
          className="text-slate-500"
      >
          <Text size="xSmall">
          {quantity} sản phẩm
        </Text>
          <Text size="small">
            <DisplayPrice useCurrency>{totalPrice}</DisplayPrice>
          </Text>
        </Box>
        <Box
          flex
          justifyContent="space-between"
          className="text-slate-500"
        >
          <Text size="xSmall">
            Phí giao hàng (miễn phí cho đơn hàng trên {splitByComma(FREESHIP_MIN_VALUE)}đ)
          </Text>
          <Text size="small">
            <DisplayPrice useCurrency>{actualShipFee}</DisplayPrice>
          </Text>
        </Box>
        <Box
          flex
          justifyContent="space-between"
        >
          <Text.Title size="normal">
            Tổng giá trị đơn hàng
        </Text.Title>
          <Text size="xLarge">
            <DisplayPrice useCurrency>{totalPrice + actualShipFee}</DisplayPrice>
          </Text>
        </Box>
      </Box>
      <Button
        fullWidth
        type="highlight"
        disabled={!quantity || isSubmitting}
        htmlType="submit"
        className="mt-6"
      >
        Đặt hàng
      </Button>
    </Box>
  );
};
