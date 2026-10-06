import {
  AlertTriangle,
  Award,
  BarChart3,
  Building2,
  ChefHat,
  Clock3,
  CreditCard,
  Landmark,
  Laptop,
  PackageMinus,
  QrCode,
  Receipt,
  ScrollText,
  Shield,
  Smartphone,
  Store,
  Touchpad,
  UtensilsCrossed,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { usePlatform } from '../context/PlatformContext'
import { getUnit, money, products, units } from '../data/catalog'
import { useMatrizAuth } from '../hooks/useMatrizAuth'
import { statusLabel } from '../lib/status'
import type { Channel, Order, OrderStatus, PaymentMethod } from '../types'
import { MatrizLogin } from './MatrizLogin'

const paidStatus: OrderStatus[] = ['recebido', 'em_preparo', 'pronto', 'entregue']
const openStatus: OrderStatus[] = ['pagamento_pendente', 'recebido', 'em_preparo', 'pronto']

const channelMeta: Record<Exclude<Channel, 'matriz'>, { label: string; icon: typeof Store }> = {
  app: { label: 'Aplicativo', icon: Smartphone },
  site: { label: 'Site', icon: Laptop },
  totem: { label: 'Totem', icon: Touchpad },
  balcao: { label: 'Balcão', icon: UtensilsCrossed },
}

const payMeta: Record<PaymentMethod, { label: string; icon: typeof QrCode }> = {
  pix: { label: 'Pix', icon: QrCode },
  credito: { label: 'Crédito', icon: CreditCard },
  debito: { label: 'Débito', icon: Landmark },
}

function share(part: number, whole: number) {
  if (!whole) return 0
  return Math.round((part / whole) * 100)
}

export function Matriz() {
  const auth = useMatrizAuth()
  const { orders, audit, loyalty, stock } = usePlatform()
  const [unitId, setUnitId] = useState('')

  const scoped = useMemo(
    () => (unitId ? orders.filter((order) => order.unitId === unitId) : orders),
    [orders, unitId],
  )

  const paid = scoped.filter((order) => paidStatus.includes(order.status))
  const denied = scoped.filter((order) => order.status === 'pagamento_negado')
  const canceled = scoped.filter((order) => order.status === 'cancelado')
  const open = scoped.filter((order) => openStatus.includes(order.status))
  const revenue = paid.reduce((sum, order) => sum + order.total, 0)
  const ticket = paid.length ? revenue / paid.length : 0
  const approval = paid.length + denied.length ? share(paid.length, paid.length + denied.length) : 0

  const byUnit = useMemo(() => {
    return units.map((unit) => {
      const list = orders.filter((order) => order.unitId === unit.id && paidStatus.includes(order.status))
      const unitOpen = orders.filter((order) => order.unitId === unit.id && openStatus.includes(order.status))
      const low = Object.entries(stock[unit.id] ?? {}).filter(([, qty]) => qty > 0 && qty <= 5)
      const empty = Object.entries(stock[unit.id] ?? {}).filter(([, qty]) => qty === 0)
      return {
        unit,
        count: list.length,
        total: list.reduce((sum, order) => sum + order.total, 0),
        open: unitOpen.length,
        low: low.length,
        empty: empty.length,
      }
    })
  }, [orders, stock])

  const top = useMemo(() => {
    const tally = new Map<string, number>()
    for (const order of paid) {
      for (const item of order.items) {
        tally.set(item.productId, (tally.get(item.productId) ?? 0) + item.qty)
      }
    }
    const max = Math.max(1, ...tally.values())
    return [...tally.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([id, qty]) => ({
        id,
        name: products.find((item) => item.id === id)?.name ?? id,
        qty,
        pct: share(qty, max),
      }))
  }, [paid])

  const channelMix = useMemo(() => {
    return (['app', 'site', 'totem', 'balcao'] as const).map((channel) => {
      const list = paid.filter((order) => order.channel === channel)
      const total = list.reduce((sum, order) => sum + order.total, 0)
      return { channel, count: list.length, total, pct: share(list.length, paid.length) }
    })
  }, [paid])

  const payMix = useMemo(() => {
    return (['pix', 'credito', 'debito'] as const).map((method) => {
      const list = paid.filter((order) => order.paymentMethod === method)
      return { method, count: list.length, pct: share(list.length, paid.length) }
    })
  }, [paid])

  const hours = useMemo(() => {
    const buckets = Array.from({ length: 8 }, (_, index) => {
      const hour = new Date(Date.now() - (7 - index) * 3_600_000).getHours()
      return { hour, count: 0, total: 0 }
    })
    for (const order of paid) {
      const age = Date.now() - new Date(order.createdAt).getTime()
      const slot = 7 - Math.floor(age / 3_600_000)
      if (slot >= 0 && slot < 8) {
        buckets[slot].count += 1
        buckets[slot].total += order.total
      }
    }
    const max = Math.max(1, ...buckets.map((item) => item.count))
    return buckets.map((item) => ({ ...item, pct: Math.round((item.count / max) * 100) }))
  }, [paid])

  const lowStock = useMemo(() => {
    const rows: { unit: string; name: string; qty: number }[] = []
    const source = unitId ? units.filter((unit) => unit.id === unitId) : units
    for (const unit of source) {
      for (const [productId, qty] of Object.entries(stock[unit.id] ?? {})) {
        if (qty > 5) continue
        const product = products.find((item) => item.id === productId)
        if (!product || !unit.productIds.includes(productId)) continue
        if (product.seasonal && !unit.seasonalEnabled) continue
        if (product.needsFullKitchen && unit.kitchen === 'reduzida') continue
        rows.push({
          unit: `${unit.city} · ${unit.name}`,
          name: product.name,
          qty,
        })
      }
    }
    return rows.sort((a, b) => a.qty - b.qty).slice(0, 8)
  }, [stock, unitId])

  const recent = [...scoped].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 8)
  const scopedAudit = unitId ? audit.filter((entry) => entry.unitId === unitId) : audit
  const maxUnit = Math.max(1, ...byUnit.map((item) => item.total))

  if (!auth.ready) return null
  if (!auth.isIn) return <MatrizLogin onOk={auth.login} />

  return (
    <section className="desk light dash">
      <header className="desk-head">
        <div>
          <p className="eyebrow live">
            <span className="live-dot" /> Operação em tempo real
          </p>
          <h1>Painel da matriz</h1>
          <p>Números consolidados para decisão. Nome e e-mail do programa não entram neste recorte.</p>
        </div>
        <label className="field slim">
          Unidade
          <select value={unitId} onChange={(event) => setUnitId(event.target.value)}>
            <option value="">Rede inteira</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.city} · {unit.name}
              </option>
            ))}
          </select>
        </label>
      </header>

      <div className="kpis">
        <Kpi icon={BarChart3} label="Faturamento válido" value={money(revenue)} hint="Pedidos pagos no gateway" />
        <Kpi icon={Receipt} label="Pedidos válidos" value={String(paid.length)} hint={`${open.length} ainda na esteira`} />
        <Kpi icon={Store} label="Ticket médio" value={money(ticket)} hint={`${approval}% de aprovação no gateway`} />
        <Kpi icon={Clock3} label="Em operação" value={String(open.length)} hint="Recebido, preparo ou pronto" />
        <Kpi icon={AlertTriangle} label="Recusados / cancelados" value={`${denied.length} / ${canceled.length}`} hint="Fora da cozinha" />
        <Kpi
          icon={Award}
          label="Programa ativo"
          value={loyalty.consented ? '1 perfil*' : '0'}
          hint="Volume anonimizado"
        />
      </div>
      <p className="hint meta">
        <Shield size={14} /> A matriz vê só o volume. Dados pessoais ficam no canal do cliente.
      </p>

      <div className="split">
        <section className="panel dash-panel">
          <h2>
            <Smartphone size={18} /> Mix de canais
          </h2>
          <ul className="mix-list">
            {channelMix.map((item) => {
              const Icon = channelMeta[item.channel].icon
              return (
                <li key={item.channel}>
                  <span>
                    <Icon size={16} /> {channelMeta[item.channel].label}
                  </span>
                  <b>
                    {item.count} · {money(item.total)}
                  </b>
                  <div className="bar-track" aria-hidden="true">
                    <i className={`bar-fill ch-${item.channel}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
        <section className="panel dash-panel">
          <h2>
            <CreditCard size={18} /> Como a rede recebeu
          </h2>
          <ul className="mix-list">
            {payMix.map((item) => {
              const Icon = payMeta[item.method].icon
              return (
                <li key={item.method}>
                  <span>
                    <Icon size={16} /> {payMeta[item.method].label}
                  </span>
                  <b>
                    {item.count} pedidos · {item.pct}%
                  </b>
                  <div className="bar-track" aria-hidden="true">
                    <i className={`bar-fill pay-${item.method}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      <section className="panel dash-panel">
        <h2>
          <Clock3 size={18} /> Movimento nas últimas 8 horas
        </h2>
        <div className="hours" role="img" aria-label="Pedidos pagos por hora">
          {hours.map((item) => (
            <div key={`${item.hour}-${item.count}`} className="hour-col">
              <div className="hour-plot">
                <div className="hour-bar" style={{ height: `${Math.max(8, item.pct)}%` }} />
              </div>
              <span>{String(item.hour).padStart(2, '0')}h</span>
              <small>{item.count}</small>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>
          <Building2 size={18} /> Saúde das unidades
        </h2>
        <ul className="unit-dash">
          {byUnit.map(({ unit, count, total, open: unitOpen, low, empty }) => (
            <li key={unit.id} className={unitId === unit.id ? 'on' : ''}>
              <header>
                <strong>
                  {unit.city} · {unit.name}
                </strong>
                <b className="tag">{unit.kitchen === 'completa' ? 'Cozinha completa' : 'Formato reduzido'}</b>
              </header>
              <p>
                <ChefHat size={14} /> {unit.hours}
                {unit.seasonalEnabled ? ' · São João ativo' : ''}
              </p>
              <p className="dash-unit-kpis">
                {count} pedidos · {money(total)} · {unitOpen} na fila
              </p>
              <div className="bar-track" aria-hidden="true">
                <i className="bar-fill ch-app" style={{ width: `${share(total, maxUnit)}%` }} />
              </div>
              <span className="meta">
                {low} itens no limite · {empty} zerados no cardápio local
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="split">
        <section>
          <h2>Mais pedidos</h2>
          <ul className="table mix-list">
            {top.length === 0 && <li>Faça pedidos nos canais para popular este quadro.</li>}
            {top.map((item) => (
              <li key={item.id}>
                <span>{item.name}</span>
                <b>{item.qty} un.</b>
                <div className="bar-track" aria-hidden="true">
                  <i className="bar-fill ch-totem" style={{ width: `${item.pct}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2>
            <PackageMinus size={18} /> Estoque no limite
          </h2>
          <ul className="table">
            {lowStock.length === 0 && <li>Nenhum item crítico neste recorte.</li>}
            {lowStock.map((item) => (
              <li key={`${item.unit}-${item.name}`}>
                <span>
                  {item.name}
                  <em className="table-sub">{item.unit}</em>
                </span>
                <b className={item.qty === 0 ? 'bad' : 'warn'}>{item.qty} un.</b>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section>
        <h2>
          <Receipt size={18} /> Pedidos recentes
        </h2>
        <div className="table-wrap">
          <table className="grid-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Unidade</th>
                <th>Canal</th>
                <th>Status</th>
                <th>Pagamento</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>{order.id}</strong>
                    <em className="table-sub">{new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</em>
                  </td>
                  <td>{getUnit(order.unitId)?.city}</td>
                  <td>{channelMeta[order.channel].label}</td>
                  <td>
                    <StatusPill order={order} />
                  </td>
                  <td>{payMeta[order.paymentMethod].label}</td>
                  <td>{money(order.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2>
          <ScrollText size={18} /> Auditoria de operações sensíveis
        </h2>
        {scopedAudit.length === 0 ? (
          <p className="hint">Cancele ou aplique desconto no balcão para gerar trilha.</p>
        ) : (
          <ul className="table audit-list">
            {scopedAudit.map((entry) => (
              <li key={entry.id}>
                <span>
                  <b className={`pill pill-${entry.action}`}>{entry.action}</b>
                  {new Date(entry.at).toLocaleString('pt-BR')} · {entry.orderId}
                  <em className="table-sub">
                    {entry.reason} · {entry.actor} · {getUnit(entry.unitId)?.city}
                  </em>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  )
}

function Kpi({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof BarChart3
  label: string
  value: string
  hint: string
}) {
  return (
    <article>
      <span className="meta">
        <Icon size={16} /> {label}
      </span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </article>
  )
}

function StatusPill({ order }: { order: Order }) {
  return <b className={`pill pill-status pill-${order.status}`}>{statusLabel(order.status)}</b>
}
