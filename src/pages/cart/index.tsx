import PaymentCard, { PAYMENT_OPTION } from "components/card/payment-method";
import { Divider } from "components/divider";
import { SecondaryLayout } from "components/layout/layout-secondary";
import { useVirtualKeyboardVisible } from "hooks";
import React, { FC, useState } from "react";
import cx from "utils/helpers";
import { Box, Header, Icon, Text } from "zmp-ui";
import { CartItems } from "./cart-items";
import { Delivery } from "./delivery";
import { CartPreview } from "./preview";
import { TermsAndPolicies } from "./term-and-policies";
import { ShippingData } from "types/order";
import { defaultShippingState } from "state";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

type PaymentMethodProps = {
  type: PAYMENT_OPTION,
  text: string,
  isOn: boolean,
}

const CartPage: FC = () => {
  // React Hook Form setup
  const methods = useForm<any>({
    defaultValues: defaultShippingState,
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true
  });
  const { handleSubmit, register, control ,watch, formState:{errors} } = methods

  const keyboardVisible = useVirtualKeyboardVisible();

  console.log(watch('shippingAddressText'))
  

  const PaymentOptions = () => {
    const [selectedMethod, setSelectedMethod] = useState<PAYMENT_OPTION>(PAYMENT_OPTION.COD);
    const methods = [
      {
        type: PAYMENT_OPTION["COD"],
        text: "Thanh toán khi nhận hàng (COD)",
        isOn: true
      }, {
        type: PAYMENT_OPTION["CREDIT_CARD"],
        text: "Thẻ tín dụng",
        isOn: true
      },
      {
        type: PAYMENT_OPTION["ZALOPAY"],
        text: "Ví Zalopay",
        isOn: true
      },
      {
        type: PAYMENT_OPTION["MOMO"],
        text: "Ví Momo",
        isOn: false
      },
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
    console.log(data)
    // setIsSubmitting(true)

    // const validationErrors = validateOrder(data);
    // console.log('Validation errors:', validationErrors);

    // if (Object.keys(validationErrors).length > 0) {
    //   console.log('Validation errors:', validationErrors);
    //   return;
    // }

    // if (!quantity || cart.length === 0) {
    //   console.log('Cart is empty or quantity is invalid');
    //   return;
    // }

    // setIsSubmitting(true)
    //   await useCreateOrder(generateMacData(), shippingInfo, (orderId: string) => {
    //     try {
    //       setIsSubmitting(false)
    //       navigate(`/result${location.search}`)
    //     } catch (err) {
    //       console.log('payment err ', err)
    //     }
    //   })
    //   resetOrderDataState()
    //   resetShipDataState()
  }

  return (
    
      <SecondaryLayout>
        <form onSubmit={handleSubmit(handleCreateOrder)}>
          <Header title="Giỏ hàng" showBackIcon={false} />
          <CartItems />
          <Delivery
            register={register}
            control={control}
            errors={errors}
          />
          <Divider size={12} />
          <PaymentOptions />
          <Divider size={12} />
          <TermsAndPolicies />
          <Divider size={32} className="flex-1" />
          {!keyboardVisible && <CartPreview />}
        </form>
      </SecondaryLayout>
  );
};

export default CartPage;
