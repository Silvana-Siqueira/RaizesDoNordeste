import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react'
import { getProduct, resolveProduct, units } from '../data/catalog'
import { demoAudit, demoLoyalty, demoOrders } from '../data/demo'
import type { AuditEntry, CartItem, Channel, Loyalty, Order, OrderStatus, PaymentMethod } from '../types'

const STORAGE_KEY = 'raizes-nordeste-v4'

type State = {
  unitId: string | null
  cart: CartItem[]
  orders: Order[]
  loyalty: Loyalty
  stock: Record<string, Record<string, number>>
  audit: AuditEntry[]
}

type Action =
  | { type: 'setUnit'; unitId: string }
  | { type: 'addCart'; productId: string; note: string }
  | { type: 'setQty'; productId: string; qty: number }
  | { type: 'clearCart' }
  | { type: 'placeOrder'; order: Order }
  | { type: 'setOrderStatus'; orderId: string; status: OrderStatus; gatewayRef?: string | null }
  | { type: 'consentLoyalty'; name: string; email: string }
  | { type: 'revokeLoyalty' }
  | { type: 'addAudit'; entry: AuditEntry }
  | { type: 'applyDiscount'; orderId: string; percent: number }
  | { type: 'hydrate'; state: State }

function initialStock() {
  const stock: Record<string, Record<string, number>> = {}
  for (const unit of units) {
    stock[unit.id] = {}
    for (const productId of unit.productIds) {
      const product = getProduct(productId)
      if (!product) continue
      if (product.seasonal && !unit.seasonalEnabled) {
        stock[unit.id][productId] = 0
        continue
      }
      if (product.needsFullKitchen && unit.kitchen === 'reduzida') {
        stock[unit.id][productId] = 0
        continue
      }
      stock[unit.id][productId] = unit.kitchen === 'reduzida' ? 8 : 18
    }
  }
  stock['recife-casa-forte']['suco-umbu'] = 2
  stock['recife-casa-forte']['bolo-macaxeira'] = 5
  stock['caruaru-centro']['pamonha'] = 4
  stock['sp-vila-mariana']['cafe-passado'] = 3
  return stock
}

const initialState: State = {
  unitId: null,
  cart: [],
  orders: demoOrders,
  loyalty: demoLoyalty,
  stock: initialStock(),
  audit: demoAudit,
}

function loadState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    return { ...initialState, ...JSON.parse(raw) }
  } catch {
    return initialState
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return action.state
    case 'setUnit':
      return { ...state, unitId: action.unitId, cart: [] }
    case 'addCart': {
      const current = state.cart.find((item) => item.productId === action.productId)
      if (current) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.productId === action.productId
              ? { ...item, qty: item.qty + 1, note: action.note || item.note }
              : item,
          ),
        }
      }
      return { ...state, cart: [...state.cart, { productId: action.productId, qty: 1, note: action.note }] }
    }
    case 'setQty':
      return {
        ...state,
        cart: state.cart
          .map((item) => (item.productId === action.productId ? { ...item, qty: action.qty } : item))
          .filter((item) => item.qty > 0),
      }
    case 'clearCart':
      return { ...state, cart: [] }
    case 'placeOrder':
      return {
        ...state,
        orders: [action.order, ...state.orders],
        cart: [],
      }
    case 'setOrderStatus': {
      const current = state.orders.find((order) => order.id === action.orderId)
      const confirmed = action.status === 'recebido' && current?.status === 'pagamento_pendente'
      const nextStock = structuredClone(state.stock)
      if (confirmed && current) {
        const unitStock = nextStock[current.unitId] ?? {}
        for (const item of current.items) {
          unitStock[item.productId] = Math.max(0, (unitStock[item.productId] ?? 0) - item.qty)
        }
        nextStock[current.unitId] = unitStock
      }
      return {
        ...state,
        stock: nextStock,
        loyalty: {
          ...state.loyalty,
          points: confirmed && current?.loyaltyUsed ? state.loyalty.points + Math.round(current.total) : state.loyalty.points,
        },
        orders: state.orders.map((order) =>
          order.id === action.orderId
            ? {
                ...order,
                status: action.status,
                gatewayRef: action.gatewayRef !== undefined ? action.gatewayRef : order.gatewayRef,
              }
            : order,
        ),
      }
    }
    case 'consentLoyalty':
      return {
        ...state,
        loyalty: {
          ...state.loyalty,
          consented: true,
          consentedAt: new Date().toISOString(),
          name: action.name,
          email: action.email,
        },
      }
    case 'revokeLoyalty':
      return {
        ...state,
        loyalty: { consented: false, consentedAt: null, points: 0, name: '', email: '' },
      }
    case 'addAudit':
      return { ...state, audit: [action.entry, ...state.audit] }
    case 'applyDiscount':
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.orderId
            ? { ...order, total: Number((order.total * (1 - action.percent / 100)).toFixed(2)) }
            : order,
        ),
      }
    default:
      return state
  }
}

type Ctx = State & {
  setUnit: (unitId: string) => void
  addCart: (productId: string, note?: string) => void
  setQty: (productId: string, qty: number) => void
  cartTotal: number
  cartCount: number
  stockOf: (productId: string, unitId?: string) => number
  checkout: (input: {
    channel: Exclude<Channel, 'matriz'>
    paymentMethod: PaymentMethod
    pickupSlot: string
    simulateFail: boolean
    customerName: string
  }) => Promise<Order>
  updateStatus: (orderId: string, status: OrderStatus, reason?: string, actor?: string) => void
  applyDiscount: (orderId: string, percent: number, reason: string, actor: string) => void
  consentLoyalty: (name: string, email: string) => void
  revokeLoyalty: () => void
}

const PlatformContext = createContext<Ctx | null>(null)

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    dispatch({ type: 'hydrate', state: loadState() })
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state, ready])

  const value = useMemo<Ctx>(() => {
    const unitId = state.unitId
    const cartTotal = state.cart.reduce((sum, item) => {
      const product = unitId ? resolveProduct(item.productId, unitId) : getProduct(item.productId)
      return sum + (product?.price ?? 0) * item.qty
    }, 0)

    return {
      ...state,
      cartTotal,
      cartCount: state.cart.reduce((sum, item) => sum + item.qty, 0),
      setUnit: (id) => dispatch({ type: 'setUnit', unitId: id }),
      addCart: (productId, note = '') => dispatch({ type: 'addCart', productId, note }),
      setQty: (productId, qty) => dispatch({ type: 'setQty', productId, qty }),
      stockOf: (productId, id) => state.stock[id ?? state.unitId ?? '']?.[productId] ?? 0,
      checkout: async ({ channel, paymentMethod, pickupSlot, simulateFail, customerName }) => {
        if (!state.unitId) throw new Error('Unidade não selecionada')
        const order: Order = {
          id: `RN-${Date.now().toString().slice(-8)}`,
          unitId: state.unitId,
          channel,
          items: state.cart,
          total: cartTotal,
          status: 'pagamento_pendente',
          paymentMethod,
          gatewayRef: null,
          pickupSlot,
          createdAt: new Date().toISOString(),
          customerName,
          loyaltyUsed: state.loyalty.consented,
        }
        dispatch({ type: 'placeOrder', order })
        await new Promise((resolve) => setTimeout(resolve, 1400))
        if (simulateFail) {
          dispatch({ type: 'setOrderStatus', orderId: order.id, status: 'pagamento_negado', gatewayRef: null })
          return { ...order, status: 'pagamento_negado' }
        }
        const gatewayRef = `pay_${Math.random().toString(36).slice(2, 10)}`
        dispatch({ type: 'setOrderStatus', orderId: order.id, status: 'recebido', gatewayRef })
        return { ...order, status: 'recebido', gatewayRef }
      },
      updateStatus: (orderId, status, reason, actor) => {
        dispatch({ type: 'setOrderStatus', orderId, status })
        if (status === 'cancelado' && reason) {
          const order = state.orders.find((item) => item.id === orderId)
          dispatch({
            type: 'addAudit',
            entry: {
              id: crypto.randomUUID(),
              at: new Date().toISOString(),
              unitId: order?.unitId ?? state.unitId ?? '',
              orderId,
              action: 'cancelamento',
              reason,
              actor: actor ?? 'Balcão',
            },
          })
        }
      },
      applyDiscount: (orderId, percent, reason, actor) => {
        dispatch({ type: 'applyDiscount', orderId, percent })
        const order = state.orders.find((item) => item.id === orderId)
        dispatch({
          type: 'addAudit',
          entry: {
            id: crypto.randomUUID(),
            at: new Date().toISOString(),
            unitId: order?.unitId ?? state.unitId ?? '',
            orderId,
            action: 'desconto',
            reason: `${percent}% — ${reason}`,
            actor,
          },
        })
      },
      consentLoyalty: (name, email) => dispatch({ type: 'consentLoyalty', name, email }),
      revokeLoyalty: () => dispatch({ type: 'revokeLoyalty' }),
    }
  }, [state])

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>
}

export function usePlatform() {
  const ctx = useContext(PlatformContext)
  if (!ctx) throw new Error('usePlatform fora do provider')
  return ctx
}
