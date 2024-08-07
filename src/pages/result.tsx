import React, { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { Box, Button, Header, Page, Text, useNavigate } from "zmp-ui";
import shieldCheckImg from "static/shield-check.svg";
import {
  AsyncCallbackFailObject,
  CheckTransactionReturns,
  Payment,
} from "zmp-sdk";
import { useLocation } from "react-router";
import { useResetRecoilState } from "recoil";
import { cartState } from "state";
import { fromMilisToDate } from "utils/date";
import cx, { convertStringToNumber } from "utils/helpers";

interface RenderResultProps {
  title: string;
  message: string;
  orderInfo: CheckTransactionReturns | AsyncCallbackFailObject;
  color: string;
}

const CheckoutResultPage: FC = () => {
  const { state, search } = useLocation();
  const [paymentResult, setPaymentResult] = useState<CheckTransactionReturns | AsyncCallbackFailObject>();
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(search);
  const orderId = queryParams.get('orderId'); // Retrieve the value of 'param1'

  useEffect(() => {
    let timeout;

    const check = () => {
      let data = state;
      if (data) {
        if ("path" in data) {
          data = data.path;
        } else if ("data" in data) {
          data = data.data;
        }
      } else {
        data = new URL(window.location.href).searchParams.toString();
      }
      Payment.checkTransaction({
        data,
        success: (rs) => {
          // Kết quả giao dịch khi gọi api thành công
          setPaymentResult(rs);
          if (rs.resultCode === 0) {
            // Thanh toán đang được xử lý
            timeout = setTimeout(check, 3000);
          }
        },
        fail: (err) => {
          // Kết quả giao dịch khi gọi api thất bại
          setPaymentResult(err);
        },
      });
    };

    check();

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const clearCart = useResetRecoilState(cartState);
  useEffect(() => {
    console.log(paymentResult)
    if (paymentResult?.resultCode >= 0) {
      clearCart();
    }
  }, [paymentResult]);

  if (paymentResult) {
    return (
      <Page className="flex flex-col">
        <Header title="Kết quả thanh toán" />
        {(function (render: (result: RenderResultProps) => ReactNode) {
          // if ("resultCode" in paymentResult) {
          //   if (paymentResult.resultCode === 1) {
              return render({
                title: "Thanh toán thành công",
                message: "Cảm ơn bạn đã mua hàng!",
                orderInfo: paymentResult,
                color: "#288F4E",
              });
          //   }
          //   if (paymentResult.resultCode === 0) {
          //     return render({
          //       title: "Thanh toán đang được xử lý",
          //       message: `Nhà bán hàng đã nhận được yêu cầu thanh toán của bạn vào lúc ${fromMilisToDate(paymentResult.createdAt || 0)} và đang xử lý.`,
          //       orderInfo: paymentResult,
          //       color: "#F4AA39",
          //     });
          //   }
          // }
          // return render({
          //   title: "Thanh toán thất bại",
          //   message: `Đã có lỗi xảy ra trong quá trình thanh toán, vui lòng thử lại sau! Mã lỗi: ${JSON.stringify(
          //     (paymentResult as AsyncCallbackFailObject).code
          //   )}`,
          //   orderInfo: paymentResult,
          //   color: "#DC1F18",
          // });
        })(({ title, message, color }: RenderResultProps) => (
          <Box className="px-4 py-16 space-y-4 flex-1 flex flex-col justify-center items-center text-center">
            <div
              key={+new Date()}
              className="w-28 h-28 flex items-center justify-center rounded-full animate-spin"
              style={{
                backgroundColor: color,
                animationIterationCount: 1,
              }}
            >
              <img src={shieldCheckImg} className="w-20" />
            </div>
            {/* <Text.Title className={cx("font-bold", `text-[${color}]`)}>
              {title}
            </Text.Title> */}
            {/* <Text>{message}</Text> */}
            <Text>Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ bạn để xác nhận lại đơn hàng trong thời gian sớm nhất</Text>
            <Box flex className="space-x-16 pt-5">
              <Button variant="secondary" className="rounded-md bg-white text-[#288F4E] shadow-xl"
                onClick={() => navigate('/')}>
                Trang chủ
              </Button>
              {/* <Button variant="secondary" className="rounded-md bg-[#288F4E] text-white shadow-xl"
                onClick={() => navigate('/cart')}
              >
                Đơn đã đặt
              </Button> */}
            </Box>
          </Box>
        ))}
      </Page>
    );
  }

  return <></>;
};

export default CheckoutResultPage;
