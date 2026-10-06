import { CreditCard, Minus, Plus, ShoppingBag, UtensilsCrossed } from 'lucide-react'
import { Link } from 'react-router-dom'
import { NeedUnit } from '../components/Layout'
import { usePlatform } from '../context/PlatformContext'
import { money, resolveProduct } from '../data/catalog'
import { channelPath, useChannel } from '../hooks/useChannel'

export function Carrinho() {
  const channel = useChannel()
  const { cart, setQty, cartTotal, unitId } = usePlatform()

  return (
    <NeedUnit>
      <section className="stack">
        <header className="page-head">
          <h1>Sacola</h1>
          <p>Retirada na unidade escolhida. O pagamento é processado fora deste sistema.</p>
        </header>
        {cart.length === 0 ? (
          <div className="empty">
            <ShoppingBag size={28} strokeWidth={1.6} />
            <p>Sua sacola está vazia.</p>
            <Link className="btn" to={channelPath(channel, '/cardapio')}>
              <UtensilsCrossed size={18} />
              Ver cardápio
            </Link>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {cart.map((item) => {
                const product = resolveProduct(item.productId, unitId!)
                if (!product) return null
                return (
                  <li key={item.productId}>
                    <div>
                      <strong>{product.name}</strong>
                      <span>{money(product.price)}</span>
                      {item.note && <em>{item.note}</em>}
                    </div>
                    <div className="stepper">
                      <button type="button" onClick={() => setQty(item.productId, item.qty - 1)} aria-label="Diminuir">
                        <Minus size={14} />
                      </button>
                      <b>{item.qty}</b>
                      <button type="button" onClick={() => setQty(item.productId, item.qty + 1)} aria-label="Aumentar">
                        <Plus size={14} />
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
            <div className="total-row">
              <span>Total</span>
              <strong>{money(cartTotal)}</strong>
            </div>
            <Link className="btn" to={channelPath(channel, '/checkout')}>
              <CreditCard size={18} />
              Ir para pagamento
            </Link>
          </>
        )}
      </section>
    </NeedUnit>
  )
}
