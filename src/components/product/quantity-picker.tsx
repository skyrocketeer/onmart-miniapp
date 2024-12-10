import React, { FC, memo, useMemo, useState } from "react";
import { getCurrentQuantity } from "utils/product";
import { Box, Button, Icon, Modal, Text } from "zmp-ui";

export const QuantityPicker: FC<{
  value: number;
  price: number;
  onChange: (quantity: number) => void;
}> = ({ value, onChange, price }) => {
  const [alertPopup, setAlertPopup] = useState(false)
  const AlertPopup = () =>
    <Modal
      visible={alertPopup}
      modalClassName="text-slate-800 text-justify"
      description="Chỉ được phép chọn 1 sản phẩm ưu đãi 1K"
      actionsDivider={false}
      actions={[
        {
          text: "Đã hiểu",
          onClick: () => setAlertPopup(false),
          className: "!text-red"
        },
      ]}
    />

  const onAddProduct = (isAdding: boolean = true) => {
    if (!isAdding) {
      onChange(-1)
      return
    }
    if (price <= 1000 && value >= 1) {
      setAlertPopup(true)
      return
    }
    onChange(1)
  }
  return (
    <Box flex className="border border-[#e9ebed] rounded-full p-[6px]">
      <AlertPopup />
      <Button
        disabled={value < 1}
        onClick={() => onAddProduct(false)}
        variant="secondary"
        type="neutral"
        icon={
          <div className="py-3 px-1">
            <div className="w-full h-[2px] bg-black" />
          </div>
        }
      />
      <Box flex justifyContent="center" alignItems="center" className="flex-1">
        <Text size="large" className="font-medium">
          Số lượng: {value}
        </Text>
      </Box>
      <Button
        onClick={() => onAddProduct()}
        variant="secondary"
        type="neutral"
        icon={<Icon icon="zi-plus" />}
      />
    </Box>
  );
};
