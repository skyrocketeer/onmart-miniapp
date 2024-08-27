import { DisplayPrice } from "components/display/price";
import React, { startTransition, useEffect } from "react";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { shippingInfoState, totalPriceState, totalQuantityState, voucherData, voucherState } from "state";
import { convertPriceToNumber, splitByComma } from "utils/price";
import { Box, Button, Text } from "zmp-ui";

export const CartPreview = ({ isSubmitting }: { isSubmitting: boolean }) => {
  const quantity = useRecoilValue(totalQuantityState);
  const totalPrice = useRecoilValue(totalPriceState);
  const selectedVoucher = useRecoilValue(voucherState)
  const { contents: voucherList } = useRecoilValueLoadable(voucherData);
  const SHIP_FEE = Number(process.env.SHIP_FEE) || 20000
  const FREESHIP_MIN_VALUE = Number(process.env.FREESHIP_AMOUNT) || 150000
  const actualShipFee = totalPrice > FREESHIP_MIN_VALUE ? 0 : SHIP_FEE
  const setShippingInfo = useSetRecoilState(shippingInfoState)

  const getVoucherValue = () => {
    if (Array.isArray(voucherList)) {
      const voucher = voucherList.find(item => item.id === selectedVoucher);
      return voucher
        ? { name: voucher.code, value: voucher.value }
        : { name: '', value: '0' };
    }
    return { name: '', value: '0' };
  };

  useEffect(() => {
    startTransition(() => {
      setShippingInfo(prevShippingInfo => ({
        ...prevShippingInfo,
        shippingFee: actualShipFee,
      }));
    });
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
        {selectedVoucher ?
          (<Box
            flex
            justifyContent="space-between"
            className="text-slate-500"
          >
            <Text size="xSmall">
              Mã giảm giá: {getVoucherValue().name}
            </Text>
            <Text size="small">
              {getVoucherValue().value}đ
            </Text>
          </Box>
          ) : null}
        <Box
          flex
          justifyContent="space-between"
        >
          <Text.Title size="normal">
            Tổng giá trị đơn hàng
          </Text.Title>
          <Text size="xLarge">
            <DisplayPrice useCurrency>
              {totalPrice + actualShipFee -
                (selectedVoucher ? convertPriceToNumber(getVoucherValue().value) : 0)
              }
            </DisplayPrice>
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
