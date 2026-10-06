import type { AuditEntry, CartItem, Loyalty, Order } from '../types'
import { resolveProduct } from './catalog'

function ago(hours: number, minutes = 0) {
  return new Date(Date.now() - hours * 3_600_000 - minutes * 60_000).toISOString()
}

function totalOf(unitId: string, items: CartItem[]) {
  return Number(
    items
      .reduce((sum, item) => sum + (resolveProduct(item.productId, unitId)?.price ?? 0) * item.qty, 0)
      .toFixed(2),
  )
}

function order(
  partial: Omit<Order, 'total' | 'loyaltyUsed' | 'gatewayRef'> & {
    gatewayRef?: string | null
    loyaltyUsed?: boolean
  },
): Order {
  return {
    loyaltyUsed: false,
    gatewayRef: partial.status === 'pagamento_negado' ? null : (partial.gatewayRef ?? `pay_${partial.id.slice(-6)}`),
    total: totalOf(partial.unitId, partial.items),
    ...partial,
  }
}

export const demoLoyalty: Loyalty = {
  consented: true,
  consentedAt: ago(26),
  points: 186,
  name: 'Cliente do app',
  email: 'cliente@exemplo.com',
}

export const demoOrders: Order[] = [
  order({
    id: 'RN-104821',
    unitId: 'recife-casa-forte',
    channel: 'app',
    items: [
      { productId: 'combo-sertanejo', qty: 1, note: '' },
      { productId: 'suco-caja', qty: 1, note: '' },
    ],
    status: 'em_preparo',
    paymentMethod: 'pix',
    pickupSlot: '15',
    createdAt: ago(0, 18),
    customerName: 'Marina',
  }),
  order({
    id: 'RN-104790',
    unitId: 'recife-casa-forte',
    channel: 'totem',
    items: [
      { productId: 'cuscuz-sol', qty: 1, note: 'sem pimenta' },
      { productId: 'cafe-passado', qty: 2, note: '' },
    ],
    status: 'pronto',
    paymentMethod: 'credito',
    pickupSlot: 'agora',
    createdAt: ago(0, 42),
    customerName: 'Totem Casa Forte',
  }),
  order({
    id: 'RN-104612',
    unitId: 'caruaru-centro',
    channel: 'app',
    items: [
      { productId: 'pamonha', qty: 2, note: '' },
      { productId: 'canjica', qty: 1, note: '' },
      { productId: 'cafe-passado', qty: 1, note: '' },
    ],
    status: 'entregue',
    paymentMethod: 'pix',
    pickupSlot: '30',
    createdAt: ago(1, 10),
    customerName: 'Josefa',
    loyaltyUsed: true,
  }),
  order({
    id: 'RN-104588',
    unitId: 'sp-vila-mariana',
    channel: 'site',
    items: [
      { productId: 'tapioca-coalho', qty: 2, note: '' },
      { productId: 'suco-caja', qty: 2, note: '' },
    ],
    status: 'recebido',
    paymentMethod: 'debito',
    pickupSlot: '15',
    createdAt: ago(1, 35),
    customerName: 'Paulo',
  }),
  order({
    id: 'RN-104401',
    unitId: 'recife-casa-forte',
    channel: 'site',
    items: [
      { productId: 'tapioca-coco', qty: 1, note: '' },
      { productId: 'bolo-macaxeira', qty: 2, note: '' },
    ],
    status: 'entregue',
    paymentMethod: 'pix',
    pickupSlot: 'agora',
    createdAt: ago(2, 5),
    customerName: 'Lívia',
    loyaltyUsed: true,
  }),
  order({
    id: 'RN-104377',
    unitId: 'caruaru-centro',
    channel: 'totem',
    items: [
      { productId: 'combo-sertanejo', qty: 1, note: '' },
      { productId: 'pamonha', qty: 1, note: '' },
    ],
    status: 'em_preparo',
    paymentMethod: 'credito',
    pickupSlot: 'agora',
    createdAt: ago(2, 40),
    customerName: 'Totem Centro',
  }),
  order({
    id: 'RN-104210',
    unitId: 'sp-vila-mariana',
    channel: 'app',
    items: [{ productId: 'cuscuz-ovo', qty: 1, note: '' }],
    status: 'pagamento_negado',
    paymentMethod: 'credito',
    pickupSlot: '60',
    createdAt: ago(3, 12),
    customerName: 'Ana',
    gatewayRef: null,
  }),
  order({
    id: 'RN-104188',
    unitId: 'recife-casa-forte',
    channel: 'totem',
    items: [
      { productId: 'cuscuz-ovo', qty: 1, note: '' },
      { productId: 'suco-umbu', qty: 1, note: '' },
    ],
    status: 'entregue',
    paymentMethod: 'debito',
    pickupSlot: 'agora',
    createdAt: ago(4, 20),
    customerName: 'Totem Casa Forte',
  }),
  order({
    id: 'RN-103955',
    unitId: 'caruaru-centro',
    channel: 'app',
    items: [
      { productId: 'tapioca-coco', qty: 1, note: '' },
      { productId: 'canjica', qty: 2, note: '' },
    ],
    status: 'cancelado',
    paymentMethod: 'pix',
    pickupSlot: '15',
    createdAt: ago(5, 8),
    customerName: 'Rafael',
  }),
  order({
    id: 'RN-103802',
    unitId: 'sp-vila-mariana',
    channel: 'site',
    items: [
      { productId: 'tapioca-coco', qty: 1, note: '' },
      { productId: 'cafe-passado', qty: 1, note: '' },
    ],
    status: 'entregue',
    paymentMethod: 'pix',
    pickupSlot: '30',
    createdAt: ago(6, 15),
    customerName: 'Helena',
  }),
  order({
    id: 'RN-103641',
    unitId: 'recife-casa-forte',
    channel: 'app',
    items: [{ productId: 'combo-sertanejo', qty: 2, note: 'um sem ovo' }],
    status: 'entregue',
    paymentMethod: 'credito',
    pickupSlot: '60',
    createdAt: ago(7, 50),
    customerName: 'Davi',
    loyaltyUsed: true,
  }),
  order({
    id: 'RN-103420',
    unitId: 'caruaru-centro',
    channel: 'app',
    items: [
      { productId: 'cuscuz-sol', qty: 1, note: '' },
      { productId: 'suco-caja', qty: 1, note: '' },
    ],
    status: 'entregue',
    paymentMethod: 'pix',
    pickupSlot: '15',
    createdAt: ago(9, 5),
    customerName: 'Bia',
  }),
]

export const demoAudit: AuditEntry[] = [
  {
    id: 'aud-01',
    at: ago(5, 6),
    unitId: 'caruaru-centro',
    orderId: 'RN-103955',
    action: 'cancelamento',
    reason: 'Cliente desistiu na retirada',
    actor: 'Gerente · Caruaru',
  },
  {
    id: 'aud-02',
    at: ago(2, 38),
    unitId: 'caruaru-centro',
    orderId: 'RN-104377',
    action: 'desconto',
    reason: '10% — Cortesia da loja',
    actor: 'Gerente · Caruaru',
  },
  {
    id: 'aud-03',
    at: ago(0, 40),
    unitId: 'recife-casa-forte',
    orderId: 'RN-104790',
    action: 'ajuste',
    reason: 'Item extra conferido no totem',
    actor: 'Gerente · Recife',
  },
]
