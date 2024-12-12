import { DisplayPrice } from "components/display/price";
import { isEmpty, truncate } from "lodash";
import React, { ChangeEvent, startTransition, useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { cartState, shippingInfoState, totalQuantityState, voucherState } from "state";
import { VoucherData } from "types/voucher";
import { API_URL } from "utils/constant";
import { calcTotalAmount, convertDiscountPriceToNumber, splitByComma } from "utils/price";
import { Box, Button, Input, Text } from "zmp-ui";

export const CartPreview = ({ isSubmitting }: { isSubmitting: boolean }) => {
  const quantity = useRecoilValue(totalQuantityState);
  const cart = useRecoilValue(cartState)
  const [selectedVoucher, setVoucher] = useRecoilState(voucherState)
  const [isErr, setIsErr] = useState(false)
  const [isDisabled, setDisabled] = useState(quantity <= 0)
  const SHIP_FEE = Number(process.env.SHIP_FEE) || 20000
  const FREESHIP_MIN_VALUE = Number(process.env.FREESHIP_AMOUNT) || 150000
  const [actualShipFee, setActualShipFee] = useState(0)
  const MIN_AMOUNT = 120000

  const setShippingInfo = useSetRecoilState(shippingInfoState)

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setIsErr(isEmpty(value))
    setDisabled(isEmpty(value));
    setVoucher(prev => ({ ...prev, code: value }));
  }

  const convertedPromoValue = useMemo(() => isEmpty(selectedVoucher.code) ? 0 : convertDiscountPriceToNumber(selectedVoucher.value), [selectedVoucher.value])

  const cartAmount = useMemo(() => calcTotalAmount(cart, 0), [])

  const actualPromoCodeValue = useMemo(() => convertedPromoValue < 1 ? cartAmount * convertedPromoValue : cartAmount - convertedPromoValue, [selectedVoucher.value, cartAmount]);

  const finalPrice = useMemo(() =>
    cartAmount - actualPromoCodeValue + actualShipFee, [actualPromoCodeValue]);

  useEffect(() => {
    const shipFeeCalc = cartAmount > FREESHIP_MIN_VALUE ? 0 : SHIP_FEE
    setActualShipFee(shipFeeCalc)
    // Only update if the shipping fee has changed
    setShippingInfo(prevShippingInfo => {
      if (prevShippingInfo.shippingFee !== actualShipFee) {
        return {
          ...prevShippingInfo,
          shippingFee: actualShipFee,
        }
      }
      return prevShippingInfo;
    });
  }, [cartAmount]);

  const verifyVoucher = (_): void => {
    fetch(`${API_URL}/promo?ref_code=${selectedVoucher.code}`)
      .then(async (response) => {
        if (response.ok) {
          const result = await response.json() as VoucherData
          setVoucher(_ => ({
            code: result.code,
            value: result.rate,
            description: result.description
          }))
          setDisabled(true)
        } else {
          console.error('Error fetching data:', response.statusText);
          debugger
          setIsErr(true)
        }
      })
      .catch(err => {
        console.log(err)
        setIsErr(true)
      })
  }

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
          <Text size="small" className="text-primary">
            <DisplayPrice useCurrency>{calcTotalAmount(cart, 0)}</DisplayPrice>
          </Text>
        </Box>
        <Box flex justifyContent="space-between" className="!mt-4 space-x-4">
          <Input placeholder="Nhập mã giảm giá"
            className="text-sm w-44 h-10"
            size="small"
            name="code"
            value={selectedVoucher.code}
            onChange={(event) => {
              handleInputChange(event)
            }}
          />
          <Button size="small"
            className="w-44 h-10 rounded-md"
            disabled={isDisabled || isErr || isEmpty(selectedVoucher.code)}
            onClick={verifyVoucher}
          >
            ÁP DỤNG
          </Button>
        </Box>
        {isErr &&
          <Box className="!mt-[5px]">
          <Text size="xxSmall" className="text-red">
            Mã khuyến mãi đã hết hạn hoặc không hợp lệ
          </Text>
        </Box>}
        <Box>
          <Box
            flex
            justifyContent="space-between"
            alignItems="center"
          >
            <Text size="xSmall" className="text-slate-500">
              Mã giảm giá: <span className="text-orange-600">{truncate(selectedVoucher.code, {
                length: 15, separator: '.'
              })}</span>
            </Text>
            <Text size="small" className="text-orange-500">
              <DisplayPrice useCurrency>
                {actualPromoCodeValue}
              </DisplayPrice>
            </Text>
          </Box>
          {selectedVoucher.value &&
            <Text size="xxSmall" className="text-orange-600">{selectedVoucher.description}</Text>
          }
        </Box>
        <Box
          flex
          justifyContent="space-between"
          className="text-slate-500"
        >
          <Text size="xSmall">
            Phí giao hàng (miễn phí cho đơn hàng từ {splitByComma(FREESHIP_MIN_VALUE)}đ)
          </Text>
          <Text size="small" className="text-primary">
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
          <Text size="xLarge" className="text-blue-600 font-bold">
            <DisplayPrice useCurrency>
              {finalPrice}
            </DisplayPrice>
          </Text>
        </Box>
      </Box>
      {finalPrice < MIN_AMOUNT &&
        <Text size="xxxSmall" className="text-orange-600">
          (chưa đạt giá trị đơn hàng tối thiểu 120,000đ)
        </Text>
      }
      <Button
        fullWidth
        type="highlight"
        disabled={!quantity || isSubmitting || finalPrice < MIN_AMOUNT}
        htmlType="submit"
        className="mt-6 text-red"
      >
        Đặt hàng
      </Button>
    </Box>
  );
};
