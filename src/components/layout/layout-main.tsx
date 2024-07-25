import { useHandlePayment } from "hooks";
import React, { ReactNode, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { totalPriceState, totalQuantityState } from "state";
import { getSystemInfo } from "zmp-sdk";
import { Box, Page, useNavigate } from "zmp-ui";
import FloatingCartButton from "../display/floating-cart-button";
import { Navigation } from "../navigation";
import { ScrollRestoration } from "../scroll-restoration";

if (getSystemInfo().platform === "android") {
  const androidSafeTop = Math.round(
    (window as any).ZaloJavaScriptInterface.getStatusBarHeight() /
    window.devicePixelRatio,
  );
  document.body.style.setProperty(
    "--zaui-safe-area-inset-top",
    `${androidSafeTop}px`,
  );
}

export const MainLayout = ({ children }: { children: ReactNode }) => {
  const totalQuantity = useRecoilValue(totalQuantityState);
  const totalPrice = useRecoilValue(totalPriceState);

  const navigate = useNavigate();
  useHandlePayment();

  return (
    <Box flex flexDirection="column" className="h-screen">
      <ScrollRestoration />
      <Page className="relative flex-1 flex flex-col bg-white">
        <Box className="flex-1 flex flex-col overflow-hidden">
          {children}
        </Box>
        {totalPrice > 0 && (
          <FloatingCartButton
            content="Hoàn tất đơn hàng"
            // type="primary"
            quantity={totalQuantity}
            totalPrice={totalPrice}
            handleOnClick={() => {
              navigate("/cart");
            }}
          />
        )}
      </Page>
      <Navigation />
    </Box>
  );
};
