import { useEffect, useRef, useState } from "react";
import { getConfig } from "utils/config";
import { matchStatusBarColor } from "utils/device";
import { generateMac } from "utils/helpers";
import { EventName, events, Payment } from "zmp-sdk";
import { useNavigate, useSnackbar } from "zmp-ui";
import { OrderData, ShippingData } from './types/order';
import { displayTime, fromMilisToDate } from "utils/date";

export function useMatchStatusTextColor(visible?: boolean) {
  const changedRef = useRef(false);
  useEffect(() => {
    if (changedRef.current) {
      matchStatusBarColor(visible ?? false);
    } else {
      changedRef.current = true;
    }
  }, [visible]);
}

const originalScreenHeight = window.innerHeight;

export function useVirtualKeyboardVisible() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const detectKeyboardOpen = () => {
      setVisible(window.innerHeight + 160 < originalScreenHeight);
    };
    window.addEventListener("resize", detectKeyboardOpen);
    return () => {
      window.removeEventListener("resize", detectKeyboardOpen);
    };
  }, []);

  return visible;
}

export const useCreateOrder = async (orderData: OrderData, shippingData: ShippingData, callback: Function) => {
  const halfAndHr = new Date(+shippingData.shippingTime).setMinutes(new Date(+shippingData.shippingTime).getMinutes() + 30);
  const mutableShippingData = {...shippingData, shippingTime: 
    `${fromMilisToDate(+shippingData.shippingTime, true)} ${displayTime(new Date(+shippingData.shippingTime))}-${displayTime(new Date(halfAndHr))}`}
  const mac = await generateMac(orderData, mutableShippingData)
  await Payment.createOrder({
    desc:
      orderData.description ??
      `Thanh toán cho ${getConfig((config) => config.app.title)}`,
    item: orderData.item,
    extradata: orderData.extraData,
    method: {
      id: orderData.method.id,
      isCustom: orderData.method.isCustom
    },
    mac,
    amount: orderData.amount,
    success: (data) => {
      const { orderId } = data;
      callback(orderId)
    },
    fail: (err) => {
      throw err
    },
  });
}

export const useHandlePayment = () => {
  const navigate = useNavigate();
  useEffect(() => {
    events.on(EventName.OpenApp, (data) => {
      if (data?.path) {
        navigate(data?.path, {
          state: data,
        });
      }
    });

    events.on(EventName.OnDataCallback, (resp) => {
      const { appTransID, eventType } = resp;
      if (appTransID || eventType === "PAY_BY_CUSTOM_METHOD") {
        navigate("/result", {
          state: resp,
        });
      }
    });

    events.on(EventName.PaymentClose, (data = {}) => {
      const { zmpOrderId } = data;
      navigate("/result", {
        state: { data: { zmpOrderId } },
      });
    });
  }, []);
};

export function useToBeImplemented() {
  const snackbar = useSnackbar();
  return () =>
    snackbar.openSnackbar({
      type: "success",
      text: "Chức năng dành cho các bên tích hợp phát triển...",
    });
}
