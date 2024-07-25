import React, { FC } from "react";
import { getConfig } from "utils/config";
import { convertPriceToNumber } from "utils/price";

export const DisplayPrice: FC<{ children: number, useCurrency?: boolean }> = ({ children, useCurrency }) => {
  const symbol = getConfig((config) => config.template.currencySymbol);
  if (getConfig((config) => config.template.prefixCurrencySymbol)) {
    return (
      <>
        {symbol}
        {children.toLocaleString()}
      </>
    );
  } else {
    return (
      <>
        {children.toLocaleString()}
        {useCurrency ? symbol : null}
      </>
    );
  }
};

export const getDiscountInPercent = (originalPrice: string, discountPrice: string) => {
  if (convertPriceToNumber(discountPrice) == 0 || convertPriceToNumber(discountPrice) > convertPriceToNumber(originalPrice))
    return 0
  return 1 - (convertPriceToNumber(discountPrice) / convertPriceToNumber(originalPrice))
}
