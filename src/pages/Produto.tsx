import { ChevronLeft, Package, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { IconTile } from '../components/IconTile'
import { NeedUnit } from '../components/Layout'
import { usePlatform } from '../context/PlatformContext'
import { getUnit, money, productAvailable, resolveProduct } from '../data/catalog'
import { channelPath, useChannel } from '../hooks/useChannel'

export function Produto() {
  const { id = '' } = useParams()
  const channel = useChannel()
  const navigate = useNavigate()
  const { unitId, addCart, stockOf } = usePlatform()
  const [note, setNote] = useState('')
  const unit = unitId ? getUnit(unitId) : undefined
  const product = unit ? resolveProduct(id, unit.id) : undefined
  const stock = stockOf(id, unit?.id)
  const available = product && unit ? productAvailable(product, unit, stock) : false

  if (!product) {
    return (
      <section className="empty">
        <h1>Item não encontrado</h1>
        <Link className="text-link" to={channelPath(channel, '/cardapio')}>
          Voltar ao cardápio
        </Link>
      </section>
    )
  }

  return (
    <NeedUnit>
      <article className="stack">
        <Link className="text-link" to={channelPath(channel, '/cardapio')}>
          <ChevronLeft size={16} /> Voltar
        </Link>
        <div className="hero-product">
          <IconTile art={product.art} size={88} />
          <div>
            <p className="eyebrow">{product.seasonal ? 'Campanha São João' : product.category}</p>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <strong className="price">{money(product.price)}</strong>
          </div>
        </div>
        <p className="hint meta">
          <Package size={15} />
          {available
            ? `${stock} unidades nesta loja agora.`
            : 'Este item não está disponível nesta unidade neste momento.'}
        </p>
        <label className="field">
          Observação
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Sem cebola, mais manteiga de garrafa..."
          />
        </label>
        <button
          className="btn"
          type="button"
          disabled={!available}
          onClick={() => {
            addCart(product.id, note)
            navigate(channelPath(channel, '/carrinho'))
          }}
        >
          <ShoppingBag size={18} />
          Adicionar à sacola
        </button>
      </article>
    </NeedUnit>
  )
}
