import PaymentCard, { PAYMENT_OPTION } from "components/card/payment-method";
import { Divider } from "components/divider";
import { SecondaryLayout } from "components/layout/layout-secondary";
import { useCreateOrder, useVirtualKeyboardVisible } from "hooks";
import React, { Suspense, useState } from "react";
import cx from "utils/helpers";
import { Box, Header, Icon, Text, useNavigate } from "zmp-ui";
import { CartItems } from "./cart-items";
import { Delivery } from "./delivery";
import { CartPreview } from "./preview";
import { TermsAndPolicies } from "./term-and-policies";
import { OrderData, ShippingData } from "types/order";
import { cartState, shippingInfoState, totalPriceState, totalQuantityState, voucherState } from "state";
import { useForm } from "react-hook-form";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { v4 as uuidv4 } from 'uuid';
import { fromMilisToDate } from "utils/date";

type PaymentMethodProps = {
  type: PAYMENT_OPTION,
  text: string,
  isOn: boolean,
}

const CartPage = () => {
  const navigate = useNavigate();
  const quantity = useRecoilValue(totalQuantityState);
  const totalPrice = useRecoilValue(totalPriceState);
  const cart = useRecoilValue(cartState);
  const shippingInfo = useRecoilValue(shippingInfoState)
  const selectedVoucher = useRecoilValue(voucherState)
  const resetShipDataState = useResetRecoilState(shippingInfoState)
  const resetOrderDataState = useResetRecoilState(cartState)
  const resetVoucherState = useResetRecoilState(voucherState)

  // React Hook Form setup
  const methods = useForm<ShippingData>({
    defaultValues: {
      clientName: shippingInfo.clientName,
      phoneNumber: shippingInfo.phoneNumber,
      shippingTime: shippingInfo.shippingTime,
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
    const tid = uuidv4()
    const listOrderItem: Record<string, any>[] = []
    cart.forEach(item => {
      listOrderItem.push({
        sku: item.product.sku,
        name: item.product.name,
        quantity: item.quantity
      })
    })

    return {
      amount: totalPrice,
      extraData: {
        storeName: 'onMart',
        orderGroupId: tid,
        myTransactionId: tid,
        shippingFee: shippingInfo.shippingFee,
        ref_code: selectedVoucher.code,
      },
      method: {
        id: "COD",
        isCustom: false,
      },
      quantity,
      item: listOrderItem,
      createdTime: fromMilisToDate(new Date().getTime())
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
        navigate(`/result${location.search}`)
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
