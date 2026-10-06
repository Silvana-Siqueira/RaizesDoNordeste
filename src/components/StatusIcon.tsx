import {
  Ban,
  CheckCircle2,
  ClipboardCheck,
  CookingPot,
  LoaderCircle,
  ShoppingBag,
  XCircle,
} from 'lucide-react'
import type { OrderStatus } from '../types'

const icons = {
  pagamento_pendente: LoaderCircle,
  pagamento_negado: XCircle,
  recebido: ClipboardCheck,
  em_preparo: CookingPot,
  pronto: ShoppingBag,
  entregue: CheckCircle2,
  cancelado: Ban,
}

export function StatusIcon({ status, size = 18 }: { status: OrderStatus; size?: number }) {
  const Icon = icons[status]
  return <Icon size={size} strokeWidth={1.75} aria-hidden="true" />
}
