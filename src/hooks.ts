import { useEffect, useRef, useState } from "react";
import { getConfig } from "utils/config";
import { matchStatusBarColor } from "utils/device";
import { generateMac } from "utils/helpers";
import { EventName, events, Payment } from "zmp-sdk";
import { useNavigate, useSnackbar } from "zmp-ui";
import { OrderData } from './types/order';

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

export const useCreateOrder = async (orderData: OrderData) => {
  const mac = await generateMac(orderData)

  Payment.createOrder({
    desc:
      orderData.description ??
      `Thanh toán cho ${getConfig((config) => config.app.title)}`,
    item: orderData.item,
    extradata: orderData.extraData,
    method: {
      id: orderData.method,
      isCustom: true
    },
    mac,
    amount: orderData.amount,
    success: (data) => {
      console.log("Payment success: ", data);
    },
    fail: (err) => {
      console.log("Payment error: ", err);
    },
  });
}

export const useHandlePayment = () => {
  const navigate = useNavigate();
  useEffect(() => {
    events.on(EventName.OpenApp, (data) => {
      console.log(EventName.OpenApp)
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
