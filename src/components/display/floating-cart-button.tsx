import React, { forwardRef, ReactNode } from "react";
import { splitByComma } from "utils/price";
import { Box, Icon } from "zmp-ui";

export type ButtonType = {
  id: number;
  content: string;
  onClick: (e?) => void;
  type: "primary" | "secondary";
};

type FloatingCartButtonProps = {
  children?: ReactNode;
  content: string;
  quantity: number,
  totalPrice: number,
  handleOnClick: () => void;
};
const FloatingCartButton = forwardRef<HTMLDivElement, FloatingCartButtonProps>(
  (props, ref) => {
    const { content, quantity, totalPrice, handleOnClick } = props;

    return (
      <Box
        py={3}
        m={3}
        className="bg-red overflow-auto rounded-2xl text-white"
        onClick={handleOnClick}
        role="button"
        // @ts-ignore
        ref={ref}
      >
        <Box flex alignContent="center"
          justifyContent="space-between"
          className="px-4"
        >
          <Box flex alignContent="space-between" className="gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-primary">
              {quantity}
            </span>
            <span className="text-lg font-extrabold">{splitByComma(totalPrice)} đ</span>
          </Box>
          <Box className="text-sm font-bold">
            {content}
            <Icon icon="zi-chevron-right" size={18} />
          </Box>
        </Box>
      </Box>
    );
  }
);

export default FloatingCartButton;