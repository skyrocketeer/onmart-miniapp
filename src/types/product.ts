export interface PercentSale {
  type: "percent";
  percent: number;
}

export interface FixedSale {
  amount: number;
  type: "fixed";
}

export type Sale = PercentSale | FixedSale;

export interface Option {
  id: string;
  label?: string;
  priceChange?: Sale;
}

export interface BaseVariant {
  id: string;
  label?: string;
  options: Option[];
}

export interface SingleOptionVariant extends BaseVariant {
  type: "single";
  default?: string;
}

export interface MultipleOptionVariant extends BaseVariant {
  type: "multiple";
  default?: string[];
}

export type Variant = SingleOptionVariant | MultipleOptionVariant;

export enum StockStatus {
  ON = "ON",
  OFF = "OFF"
}
export interface Product {
  sku: string;
  name: string;
  image: string;
  priceBefore: string;
  category: string;
  description?: string;
  priceSale: string;
  unit: string;
  // priceSale?: Sale;
  variants?: Variant[];
  inStock: StockStatus;
}
