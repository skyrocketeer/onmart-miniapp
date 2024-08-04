import { StockStatus } from "types/product";

export const isInStock = (status: string) => {
  return StockStatus.ON == status.toUpperCase() ? true : false;
}