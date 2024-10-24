import { Cart, SelectedOptions } from "types/cart";
import { Option, Product } from "types/product";
import { convertStringToNumber } from "./helpers";
import { isEmpty } from "lodash";

export function calcFinalPrice(product: Product, options?: SelectedOptions) {
  const priceBefore = convertStringToNumber(product.priceBefore);
  const priceSale = convertStringToNumber(product.priceSale || "0");
  const finalPrice = priceBefore - priceSale;
  return finalPrice > 0 ? finalPrice : priceBefore;
}

export function calcTotalAmount(cart: Cart, reducedPrice: number) {
  const totalCart = cart.reduce((total, item) =>
    total + item.quantity * calcFinalPrice(item.product, item.options),0);
  return totalCart < reducedPrice ? 0 : totalCart - reducedPrice;
}

export function isIdentical(
  option1: SelectedOptions,
  option2: SelectedOptions,
) {
  const option1Keys = Object.keys(option1);
  const option2Keys = Object.keys(option2);

  if (option1Keys.length !== option2Keys.length) {
    return false;
  }

  for (const key of option1Keys) {
    const option1Value = option1[key];
    const option2Value = option2[key];

    const areEqual =
      Array.isArray(option1Value) &&
      Array.isArray(option2Value) &&
      [...option1Value].sort().toString() ===
        [...option2Value].sort().toString();

    if (option1Value !== option2Value && !areEqual) {
      return false;
    }
  }

  return true;
}

export function splitByComma(price: any) {
  // Convert price to number if it's a string
  const number = parseFloat(price);

   if (isNaN(number)) {
    return 0
  }

  // Round the price to ensure it's a whole number
  let roundedPrice = Math.round(price * 100);

  // Calculate dollars and cents
  let wholeNumber = Math.floor(roundedPrice / 100);
  // let cents = roundedPrice % 100;

  // Format the result
  return `${wholeNumber.toLocaleString()}`;
}

/**
 * Convert a comma-separated price string to a number.
 * @param {string} priceStr - The price string with commas (e.g., "10,000").
 * @return {number} - The numeric value of the price.
 */
export function convertPriceToNumber(priceStr: string) {
  if(isEmpty(priceStr)) return 0

  // Remove commas from the price string
  const cleanedString = priceStr.replace(/,/g, '');

  // Convert the cleaned string to a number
  const numberPrice = parseFloat(cleanedString);

  // Return the number price
  return numberPrice;
}

export function convertDiscountPriceToNumber(discount: number | string) {
  // let discountAmount: number;
  if (typeof discount === 'string' && discount.endsWith('%')) {
    // If the discount is a percentage
    return parseFloat(discount.replace('%', ''))/100;
    // discountAmount = (percentage / 100) * originalPrice;
  } else {
    // Assume the discount is an absolute amount
    return Number(discount)
    // discountAmount = Number(discount);
  }
}