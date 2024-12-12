import PaymentCard, { PAYMENT_OPTION } from "components/card/payment-method";
import { Divider } from "components/divider";
import { SecondaryLayout } from "components/layout/layout-secondary";
import { useCreateOrder, useVirtualKeyboardVisible } from "hooks";
import React, { useMemo, useState } from "react";
import cx from "utils/helpers";
import { Box, Header, Icon, Text } from "zmp-ui";
import { CartItems } from "./cart-items";
import { Delivery } from "./delivery";
import { CartPreview } from "./preview";
import { TermsAndPolicies } from "./term-and-policies";
import { OrderData, ShippingData } from "types/order";
import { cartState, shippingInfoState, totalQuantityState, voucherState } from "state";
import { useForm } from "react-hook-form";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { displayDate, displayTime } from "utils/date";
import { calcTotalAmount, convertPriceToNumber } from "utils/price";

type PaymentMethodProps = {
  type: PAYMENT_OPTION,
  text: string,
  isOn: boolean,
}

const CartPage = () => {
  const quantity = useRecoilValue(totalQuantityState);
  const cart = useRecoilValue(cartState);
  const shippingInfo = useRecoilValue(shippingInfoState)
  const selectedVoucher = useRecoilValue(voucherState)
  const resetShipDataState = useResetRecoilState(shippingInfoState)
  const resetOrderDataState = useResetRecoilState(cartState)
  const resetVoucherState = useResetRecoilState(voucherState)

  const totalPrice = useMemo(() => calcTotalAmount(cart, 0), [])

  // React Hook Form setup
  const methods = useForm<ShippingData>({
    defaultValues: {
      clientName: shippingInfo.clientName,
      phoneNumber: shippingInfo.phoneNumber,
      shippingAddress: shippingInfo.shippingAddress,
      note: shippingInfo.note
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true
  });
  const { handleSubmit, control, setValue, getValues, formState: { errors, isSubmitting } } = methods

  const keyboardVisible = useVirtualKeyboardVisible();

  const generateMacData = () => {
    const listOrderItem: Record<string, any>[] = []
    cart.forEach(item => {
      listOrderItem.push({
        sku: item.product.sku,
        name: item.product.name,
        quantity: item.quantity,
        price: convertPriceToNumber(item.product.priceBefore)
      })
    })

    return {
      amount: totalPrice,
      extraData: {
        storeName: 'onMart',
        ref_code: selectedVoucher.code,
      },
      method: {
        id: "COD",
        isCustom: false,
      },
      quantity,
      item: listOrderItem,
      createdTime: displayTime(new Date()),
      createdDate: displayDate()
    } as OrderData
  }

  const PaymentOptions = () => {
    const [selectedMethod, setSelectedMethod] = useState<PAYMENT_OPTION>(PAYMENT_OPTION.COD);
    const methods = [
      {
        type: PAYMENT_OPTION["COD"],
        text: "Thanh toán khi nhận hàng (COD)",
        isOn: true
      }, 
      // {
      //   type: PAYMENT_OPTION["CREDIT_CARD"],
      //   text: "Thẻ tín dụng",
      //   isOn: true
      // },
      // {
      //   type: PAYMENT_OPTION["ZALOPAY"],
      //   text: "Ví Zalopay",
      //   isOn: true
      // },
      // {
      //   type: PAYMENT_OPTION["MOMO"],
      //   text: "Ví Momo",
      //   isOn: false
      // },
    ]

    const handleChangeMethod = ({ type, isOn }: PaymentMethodProps) => {
      if (isOn)
        setSelectedMethod(type);
    };

    return (
      <Box className="space-y-3 p-3">
        <Text.Header className="mt-1 mb-5">Phương thức thanh toán</Text.Header>
        {methods.map(method => (
          <Box key={method.type} flex alignItems="center"
            className={cx("border",
              method.type == selectedMethod ? 'cursor-pointer border-primary' : 'border-slate-200',
              "mx-2 p-3 rounded-lg shadow-md gap-2",
              method.isOn ? 'bg-white' : 'bg-slate-200 cursor-default')
            }
            role='button'
            onClick={(e) => handleChangeMethod(method)}
          >
            <Icon icon={selectedMethod == method.type ? "zi-radio-checked" : "zi-radio-unchecked"} size={18} />
            <PaymentCard text={method.text} method={method.type} isActive={selectedMethod == method.type} />
          </Box>
        ))}
      </Box>
    )
  }

  const handleCreateOrder = async (data: ShippingData) => {
    if (!quantity || cart.length === 0) {
      console.log('Cart is empty or quantity is invalid');
      return;
    }

    await useCreateOrder(generateMacData(), shippingInfo, (orderId: string) => {
      try {
        resetOrderDataState()
        resetShipDataState()
        resetVoucherState()
      } catch (err) {
        console.log('payment err ', err)
      }
    })
  }

  return (
    <SecondaryLayout>
      <form onSubmit={handleSubmit(handleCreateOrder)}>
        <Header title="Giỏ hàng" showBackIcon={false} />
        <CartItems />
        <Delivery
          control={control}
          errors={errors}
          getValues={getValues}
          setValue={setValue}
        />
        <Divider size={12} />
        <PaymentOptions />
        <Divider size={12} />
        <TermsAndPolicies />
        <Divider size={32} className="flex-1" />
        {!keyboardVisible &&
          <CartPreview isSubmitting={isSubmitting} />
        }
      </form>
    </SecondaryLayout>
  );
};

export default CartPage;
