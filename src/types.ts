export type Channel = 'app' | 'site' | 'totem' | 'balcao' | 'matriz'

export type KitchenType = 'completa' | 'reduzida'

export type OrderStatus =
  | 'pagamento_pendente'
  | 'pagamento_negado'
  | 'recebido'
  | 'em_preparo'
  | 'pronto'
  | 'entregue'
  | 'cancelado'

export type PaymentMethod = 'pix' | 'credito' | 'debito'

export type Unit = {
  id: string
  name: string
  city: string
  state: string
  address: string
  hours: string
  kitchen: KitchenType
  seasonalEnabled: boolean
  productIds: string[]
  note: string
}

export type Product = {
  id: string
  name: string
  description: string
  category: string
  price: number
  tags: string[]
  seasonal?: boolean
  seasonLabel?: string
  needsFullKitchen?: boolean
  art: string
}

export type UnitOverride = {
  name?: string
  description?: string
  price?: number
}

export type CartItem = {
  productId: string
  qty: number
  note: string
}

export type Order = {
  id: string
  unitId: string
  channel: Exclude<Channel, 'matriz'>
  items: CartItem[]
  total: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  gatewayRef: string | null
  pickupSlot: string
  createdAt: string
  customerName: string
  loyaltyUsed: boolean
}

export type AuditEntry = {
  id: string
  at: string
  unitId: string
  orderId: string
  action: 'cancelamento' | 'desconto' | 'ajuste'
  reason: string
  actor: string
}

export type Loyalty = {
  consented: boolean
  consentedAt: string | null
  points: number
  name: string
  email: string
}
