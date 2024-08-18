import { DisplayPrice } from "components/display/price";
import React from "react";
import { useRecoilValue } from "recoil";
import { totalPriceState, totalQuantityState } from "state";

import { Box, Button, Text } from "zmp-ui";

export const CartPreview = ({ isSubmitting }: { isSubmitting: boolean }) => {
  const quantity = useRecoilValue(totalQuantityState);
  const totalPrice = useRecoilValue(totalPriceState);

  return (
    <Box flex className="sticky bottom-0 bg-background p-4 space-x-4">
      <Box
        flex
        flexDirection="column"
        justifyContent="space-between"
        className="min-w-[120px] flex-none"
      >
        <Text className="text-gray" size="xSmall">
          {quantity} sản phẩm
        </Text>
        <Text.Title size="large">
          <DisplayPrice>{totalPrice}</DisplayPrice>
        </Text.Title>
      </Box>
      <Button
        fullWidth
        type="highlight"
        disabled={!quantity || isSubmitting}
        htmlType="submit"
      >
        Đặt hàng
      </Button>
    </Box>
  );
};
