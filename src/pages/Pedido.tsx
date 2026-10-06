import { CreditCard, MapPin, Plus, ShieldAlert } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { StatusIcon } from '../components/StatusIcon'
import { usePlatform } from '../context/PlatformContext'
import { getUnit, money, pickupSlots, resolveProduct } from '../data/catalog'
import { channelPath, useChannel } from '../hooks/useChannel'
import { statusFlow, statusLabel } from '../lib/status'

export function Pedido() {
  const { id = '' } = useParams()
  const { orders } = usePlatform()
  const channel = useChannel()
  const order = orders.find((item) => item.id === id)
  const unit = order ? getUnit(order.unitId) : undefined
  const slot = pickupSlots.find((item) => item.id === order?.pickupSlot)?.label

  if (!order) {
    return (
      <section className="empty">
        <h1>Pedido não encontrado</h1>
        <Link className="text-link" to={channelPath(channel, '/pedidos')}>
          Ver pedidos
        </Link>
      </section>
    )
  }

  const step = statusFlow.indexOf(order.status)

  return (
    <article className="stack">
      <header className="page-head">
        <p className="eyebrow">{order.id}</p>
        <h1 className="status-title">
          <StatusIcon status={order.status} size={26} />
          {statusLabel(order.status)}
        </h1>
        <p className="meta">
          <MapPin size={14} /> {unit?.city} · {unit?.name} · {slot}
        </p>
      </header>
      {order.status !== 'pagamento_negado' && order.status !== 'cancelado' && (
        <ol className="timeline">
          {statusFlow.map((item, index) => (
            <li key={item} className={index <= step ? 'done' : ''}>
              <StatusIcon status={item} size={16} />
              {statusLabel(item)}
            </li>
          ))}
        </ol>
      )}
      {order.status === 'pagamento_pendente' && (
        <p className="hint">Aguardando confirmação do serviço de pagamento.</p>
      )}
      {order.status === 'pagamento_negado' && (
        <p className="error meta">
          <ShieldAlert size={16} /> O gateway recusou a cobrança. O pedido não foi para a cozinha.
        </p>
      )}
      <ul className="cart-list">
        {order.items.map((item) => {
          const product = resolveProduct(item.productId, order.unitId)
          return (
            <li key={item.productId}>
              <div>
                <strong>
                  {item.qty}× {product?.name}
                </strong>
                {item.note && <em>{item.note}</em>}
              </div>
              <b>{money((product?.price ?? 0) * item.qty)}</b>
            </li>
          )
        })}
      </ul>
      <p className="hint meta">
        <CreditCard size={14} />
        Pagamento via {order.paymentMethod.toUpperCase()}
        {order.gatewayRef ? ` · ref ${order.gatewayRef}` : ' · sem referência do gateway'}
      </p>
      <div className="total-row">
        <span>Total</span>
        <strong>{money(order.total)}</strong>
      </div>
      {(channel === 'totem' || channel === 'site') && (
        <Link className="btn" to={channelPath(channel)}>
          <Plus size={18} />
          Novo pedido
        </Link>
      )}
    </article>
  )
}
