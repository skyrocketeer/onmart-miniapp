import { SelectedOptions } from "types/cart";
import { Option, Product } from "types/product";
import { convertStringToNumber } from "./helpers";

export function calcFinalPrice(product: Product, options?: SelectedOptions) {
  const priceBefore = convertStringToNumber(product.priceBefore);
  const priceSale = convertStringToNumber(product.priceSale || "0");
  //   if (product.sale.type === "fixed") {
    // finalPrice = product.price - product.sale.amount;
  //   } else {
  const finalPrice = priceBefore - priceSale;
  //   }
  // }

  // if (options && product.sku) {
  //   const selectedOptions: Option[] = [];
  //   for (const variantKey in options) {
      // const variant = product.variants.find((v) => v.id === variantKey);
      // if (variant) {
      //   const currentOption = options[variantKey];
      //   if (typeof currentOption === "string") {
      //     const selected = variant.options.find((o) => o.id === currentOption);
      //     if (selected) {
      //       selectedOptions.push(selected);
      //     }
      //   } else {
      //     const selecteds = variant.options.filter((o) =>
      //       currentOption.includes(o.id),
      //     );
      //     selectedOptions.push(...selecteds);
      //   }
      // }
    // }
    // finalPrice = selectedOptions.reduce((price, option) => {
    //   if (option.priceChange) {
    //     if (option.priceChange.type == "fixed") {
    //       return price + option.priceChange.amount;
    //     } else {
    //       return price + convertPriceToNumber(product.priceBefore) * option.priceChange.percent;
    //     }
    //   }
    //   return price;
    // }, finalPrice);
  // }
  return finalPrice > 0 ? finalPrice : priceBefore;
}

export function getDummyImage(filename: string) {
  return `https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/${filename}`;
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
