import { Cart } from "types/cart";
import { StockStatus } from "types/product";

export const isInStock = (status: string) => {
  return StockStatus.ON == status.toUpperCase() ? true : false;
}

export const getCurrentQuantity = (sku: string | undefined, cart: Cart) => {
  if(!sku) return 0
  const existed = cart.find(item => item.product.sku === sku)
  if (existed) {
    return existed.quantity
  }
  return 0
}