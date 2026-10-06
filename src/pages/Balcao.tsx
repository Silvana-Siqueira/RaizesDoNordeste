import { BadgePercent, Ban, ChevronRight, ClipboardList } from 'lucide-react'
import { useState } from 'react'
import { StatusIcon } from '../components/StatusIcon'
import { usePlatform } from '../context/PlatformContext'
import { getUnit, money, resolveProduct } from '../data/catalog'
import { statusLabel } from '../lib/status'
import type { OrderStatus } from '../types'

const channelLabel = {
  app: 'App',
  site: 'Site',
  totem: 'Totem',
  balcao: 'Balcão',
}

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  recebido: 'em_preparo',
  em_preparo: 'pronto',
  pronto: 'entregue',
}

export function Balcao() {
  const { orders, updateStatus, applyDiscount } = usePlatform()
  const [reason, setReason] = useState('Cliente desistiu')
  const [filter, setFilter] = useState('')
  const open = orders
    .filter((order) => !['entregue', 'cancelado', 'pagamento_negado'].includes(order.status))
    .filter((order) => !filter || order.unitId === filter)

  return (
    <section className="desk">
      <div className="desk-head">
        <div>
          <h1>Fila da loja</h1>
          <p>App, totem e balcão entram na mesma esteira. Cancelar e dar desconto deixa rastro.</p>
        </div>
        <label className="field slim">
          Unidade em operação
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="">Todas no protótipo</option>
            <option value="recife-casa-forte">Recife · Casa Forte</option>
            <option value="caruaru-centro">Caruaru · Centro</option>
            <option value="sp-vila-mariana">São Paulo · Vila Mariana</option>
          </select>
        </label>
      </div>
      {open.length === 0 ? (
        <div className="empty dark">
          <ClipboardList size={28} />
          <p>Nenhum pedido em aberto. Faça um pedido no app ou no totem.</p>
        </div>
      ) : (
        <ul className="kds">
          {open.map((order) => {
            const unit = getUnit(order.unitId)
            const next = nextStatus[order.status]
            return (
              <li key={order.id} className={`ticket ticket-${order.status}`}>
                <header>
                  <strong>{order.id}</strong>
                  <span>
                    {channelLabel[order.channel]} · {unit?.city}
                  </span>
                </header>
                <p className="ticket-status">
                  <StatusIcon status={order.status} />
                  {statusLabel(order.status)}
                </p>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.productId}>
                      {item.qty}× {resolveProduct(item.productId, order.unitId)?.name}
                    </li>
                  ))}
                </ul>
                <b>
                  {order.customerName} · {money(order.total)}
                </b>
                <div className="ticket-actions">
                  {next && (
                    <button type="button" className="btn" onClick={() => updateStatus(order.id, next)}>
                      {statusLabel(next)}
                      <ChevronRight size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn ghost"
                    onClick={() => applyDiscount(order.id, 10, 'Cortesia da loja', 'Gerente')}
                  >
                    <BadgePercent size={16} />
                    10% desconto
                  </button>
                  <button
                    type="button"
                    className="btn danger"
                    onClick={() => updateStatus(order.id, 'cancelado', reason, 'Gerente')}
                  >
                    <Ban size={16} />
                    Cancelar
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
      <label className="field slim">
        Motivo padrão de cancelamento
        <input value={reason} onChange={(event) => setReason(event.target.value)} />
      </label>
    </section>
  )
}
