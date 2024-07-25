export interface OrderData {
  amount: number,
  method: string,
  quantity: number,
  description?: string,
  extraData: object,
  item: Record<string, any>[]
}