import { ClipboardList, UtensilsCrossed } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusIcon } from '../components/StatusIcon'
import { usePlatform } from '../context/PlatformContext'
import { getUnit, money } from '../data/catalog'
import { channelPath, useChannel } from '../hooks/useChannel'
import { statusLabel } from '../lib/status'

export function Pedidos() {
  const { orders } = usePlatform()
  const channel = useChannel()

  return (
    <section className="stack">
      <header className="page-head">
        <h1>Seus pedidos</h1>
        <p>Acompanhe o status da cozinha e da retirada, em qualquer canal.</p>
      </header>
      {orders.length === 0 ? (
        <div className="empty">
          <ClipboardList size={28} strokeWidth={1.6} />
          <p>Nenhum pedido ainda.</p>
          <Link className="btn" to={channelPath(channel, '/cardapio')}>
            <UtensilsCrossed size={18} />
            Pedir agora
          </Link>
        </div>
      ) : (
        <ul className="cards">
          {orders.map((order) => {
            const unit = getUnit(order.unitId)
            return (
              <li key={order.id}>
                <Link className="order-card" to={channelPath(channel, `/pedido/${order.id}`)}>
                  <strong>{order.id}</strong>
                  <span className="meta">
                    <StatusIcon status={order.status} size={15} />
                    {unit?.city} · {statusLabel(order.status)}
                  </span>
                  <b>{money(order.total)}</b>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
