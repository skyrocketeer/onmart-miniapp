import { useEffect, useRef, useState } from "react";
import { getConfig } from "utils/config";
import { matchStatusBarColor } from "utils/device";
import { generateMac } from "utils/helpers";
import { EventName, events, getUserInfo, Payment } from "zmp-sdk";
import { useNavigate, useSnackbar } from "zmp-ui";
import { OrderData, ShippingData } from './types/order';
import { displayTime, fromMilisToDate } from "utils/date";
import { API_URL } from "utils/constant";

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
  try {
    // const halfAndHr = new Date(+shippingData.shippingTime).setMinutes(new Date(+shippingData.shippingTime).getMinutes() + 30);
    //   const mutableShippingData = {...shippingData, shippingTime: 
    //     `${fromMilisToDate(+shippingData.shippingTime, true)} ${displayTime(new Date(+shippingData.shippingTime))}-${displayTime(new Date(halfAndHr))}`}
    const macString = generateMac(orderData, shippingData)

    // create order backend
    const mac = await createNewOrder(macString, shippingData)

    // create order Zalo
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
  catch (err) {
    console.log('err in hook use create order ', err);
  }
}

async function createNewOrder(dataMac: string, shippingData: Object): Promise<string> {
  try {
    // Make the API request
    const response = await fetch(`${API_URL}/payment/checkout`, { 
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orderData: dataMac, shippingData })
    });

    if (!response.ok) {
      console.error('Error: Network response was not ok', response);
      return "";
    }
    const data = await response.text();
    console.log('Data received:', data);
    return data["mac"] || ""

  } catch (error) {
    // Catch any other errors such as network issues
    console.log('Error in create order:', error);
    return "";
  }
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

export const useUserBasicInfo = async (userData: UserInfo) => {
  try {
      const { userInfo } = await getUserInfo({ autoRequestPermission: true });
      Object.assign(userData, userInfo)
    } catch (error) {
      console.log(error);
    }
    return userData
}

export function useToBeImplemented() {
  const snackbar = useSnackbar();
  return () =>
    snackbar.openSnackbar({
      type: "success",
      text: "Chức năng dành cho các bên tích hợp phát triển...",
    });
}
