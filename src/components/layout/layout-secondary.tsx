import { useHandlePayment } from "hooks";
import React, { ReactNode } from "react";
import { getSystemInfo } from "zmp-sdk";
import { Box, Page, useNavigate } from "zmp-ui";
import { Navigation } from "../navigation";
import { ScrollRestoration } from "../scroll-restoration";

export const SecondaryLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  useHandlePayment();

  return (
    <Box flex flexDirection="column" className="h-screen">
      <ScrollRestoration />
      <Page className="relative flex-1 flex flex-col bg-white">
        <Box className="flex-1 flex flex-col">
          {children}
        </Box>
      </Page>
      <Navigation />
    </Box>
  );
};
