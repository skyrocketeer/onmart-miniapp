import { defaultShippingState } from "state"

export interface OrderData {
  amount: number,
  method: Record<string, any>,
  quantity: number,
  description?: string,
  extraData: object,
  item: Record<string, any>[],
  selectedVoucher: string
}

type ShippingDataKey = keyof typeof defaultShippingState;
type ShippingDataValues = typeof defaultShippingState[ShippingDataKey];

export type ShippingData = Record<ShippingDataKey,ShippingDataValues>