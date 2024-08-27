import CartPage from "pages/cart";
import CategoryPage from "pages/category";
import HomePage from "pages/index";
import NotificationPage from "pages/notification";
import ProfilePage from "pages/profile";
import CheckoutResultPage from "pages/result";
import SearchPage from "pages/search";
import React from "react";
import { Route, Routes } from "react-router";
import { RecoilRoot } from "recoil";
import { getConfig } from "utils/config";
import { App, SnackbarProvider, ZMPRouter } from "zmp-ui";
import { ConfigProvider } from "./config-provider";
import VoucherPage from "pages/voucher";

const MyApp = () => {
  return (
    <RecoilRoot>
      <ConfigProvider
        cssVariables={{
          "--zmp-primary-color": getConfig((c) => c.template.primaryColor),
          "--zmp-background-color": "#f4f5f6",
        }}
      >
        <App>
          <SnackbarProvider>
            <ZMPRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/category" element={<CategoryPage />} />
                <Route path="/voucher" element={<VoucherPage />} />
                <Route path="/notification" element={<NotificationPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/result" element={<CheckoutResultPage />} />
              </Routes>
            </ZMPRouter>
          </SnackbarProvider>
        </App>
      </ConfigProvider>
    </RecoilRoot>
  );
};
export default MyApp;
