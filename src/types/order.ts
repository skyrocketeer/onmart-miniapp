export interface OrderData {
  amount: number,
  method: Record<string, any>,
  quantity: number,
  description?: string,
  extraData: object,
  item: Record<string, any>[]
}

export type ShippingData = Record<string, any>