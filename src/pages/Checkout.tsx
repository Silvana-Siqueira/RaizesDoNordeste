import { AlertTriangle, Clock3, CreditCard, Landmark, LoaderCircle, QrCode, ShieldCheck, User } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NeedUnit } from '../components/Layout'
import { usePlatform } from '../context/PlatformContext'
import { money, pickupSlots } from '../data/catalog'
import { channelPath, useChannel } from '../hooks/useChannel'
import type { PaymentMethod } from '../types'

const methods: { id: PaymentMethod; label: string; icon: typeof QrCode }[] = [
  { id: 'pix', label: 'Pix', icon: QrCode },
  { id: 'credito', label: 'Crédito', icon: CreditCard },
  { id: 'debito', label: 'Débito', icon: Landmark },
]

export function Checkout() {
  const channel = useChannel()
  const navigate = useNavigate()
  const { cart, cartTotal, checkout, loyalty } = usePlatform()
  const [method, setMethod] = useState<PaymentMethod>('pix')
  const [slot, setSlot] = useState('15')
  const [name, setName] = useState(loyalty.name || 'Cliente')
  const [fail, setFail] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  return (
    <NeedUnit>
      <section className="stack">
        <header className="page-head">
          <h1>Pagamento</h1>
          <p>
            Este sistema só solicita a cobrança. O gateway confirma ou recusa; a loja registra o
            resultado e libera o pedido.
          </p>
        </header>
        <label className="field">
          <span className="meta">
            <User size={14} /> Nome para retirada
          </span>
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <fieldset className="field">
          <legend className="meta">
            <Clock3 size={14} /> Retirada
          </legend>
          {pickupSlots.map((item) => (
            <label key={item.id} className="radio">
              <input type="radio" name="slot" checked={slot === item.id} onChange={() => setSlot(item.id)} />
              {item.label}
            </label>
          ))}
        </fieldset>
        <fieldset className="field">
          <legend>Como você quer pagar</legend>
          <div className="pay-grid">
            {methods.map((item) => {
              const Icon = item.icon
              return (
                <label key={item.id} className={`pay-card ${method === item.id ? 'on' : ''}`}>
                  <input type="radio" name="pay" checked={method === item.id} onChange={() => setMethod(item.id)} />
                  <Icon size={20} strokeWidth={1.7} />
                  {item.label}
                </label>
              )
            })}
          </div>
        </fieldset>
        <label className="radio warn">
          <input type="checkbox" checked={fail} onChange={(event) => setFail(event.target.checked)} />
          <AlertTriangle size={15} />
          Simular negativa do gateway (caso de teste)
        </label>
        <div className="total-row">
          <span>A cobrar no gateway</span>
          <strong>{money(cartTotal)}</strong>
        </div>
        {error && <p className="error">{error}</p>}
        <button
          className="btn"
          type="button"
          disabled={busy || cart.length === 0}
          onClick={async () => {
            setBusy(true)
            setError('')
            try {
              const order = await checkout({
                channel: channel === 'matriz' ? 'app' : channel,
                paymentMethod: method,
                pickupSlot: slot,
                simulateFail: fail,
                customerName: name,
              })
              navigate(channelPath(channel, `/pedido/${order.id}`))
            } catch {
              setError('Não foi possível solicitar o pagamento. Tente de novo.')
            } finally {
              setBusy(false)
            }
          }}
        >
          {busy ? <LoaderCircle size={18} className="spin" /> : <ShieldCheck size={18} />}
          {busy ? 'Falando com o gateway…' : 'Solicitar pagamento'}
        </button>
        {loyalty.consented && <p className="hint">Pontos de fidelidade serão creditados após a confirmação.</p>}
      </section>
    </NeedUnit>
  )
}
