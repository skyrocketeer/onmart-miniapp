import React, { FC } from "react";
import { getConfig } from "utils/config";
import { convertStringToNumber } from "utils/helpers";

export const DisplayPrice: FC<{ children: number, useCurrency?: boolean }> = ({ children, useCurrency }) => {
  const symbol = getConfig((config) => config.template.currencySymbol);
  const roundedPrice = Math.floor(Math.round(children * 100) / 100)
  if (getConfig((config) => config.template.prefixCurrencySymbol)) {
    return (
      <>
        {symbol}
        {roundedPrice.toLocaleString()}
      </>
    );
  } else {
    return (
      <>
        {roundedPrice.toLocaleString()}
        {useCurrency ? symbol : null}
      </>
    );
  }
};

export const getDiscountInPercent = (originalPrice: string, discountPrice: string) => {
  if (convertStringToNumber(discountPrice) == 0 || convertStringToNumber(discountPrice) > convertStringToNumber(originalPrice))
    return 0
  return 1 - (convertStringToNumber(discountPrice) / convertStringToNumber(originalPrice))
}
