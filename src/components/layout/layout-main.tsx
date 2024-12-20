import { useHandlePayment } from "hooks";
import React, { ReactNode, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { cartState, totalQuantityState } from "state";
import { getSystemInfo } from "zmp-sdk";
import { Box, Page, useNavigate } from "zmp-ui";
import FloatingCartButton from "../display/floating-cart-button";
import { Navigation } from "../navigation";
import { ScrollRestoration } from "../scroll-restoration";
import { calcTotalAmount } from "utils/price";


export const MainLayout = ({ children }: { children: ReactNode }) => {
  const totalQuantity = useRecoilValue(totalQuantityState);
  const cart = useRecoilValue(cartState);
  const navigate = useNavigate();

  return (
    <Box flex flexDirection="column" className="h-screen">
      <ScrollRestoration />
      <Page className="relative flex-1 flex flex-col bg-white">
        <Box className="flex-1 flex flex-col overflow-hidden">
          {children}
        </Box>
        {cart.length > 0 && (
          <FloatingCartButton
            content="Hoàn tất đơn hàng"
            // type="primary"
            quantity={totalQuantity}
            totalPrice={calcTotalAmount(cart, 0)}
            handleOnClick={() => {
              navigate('/cart');
            }}
          />
        )}
      </Page>
      <Navigation />
    </Box>
  );
};
