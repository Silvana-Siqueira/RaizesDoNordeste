import { MapPin } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { IconTile } from '../components/IconTile'
import { NeedUnit } from '../components/Layout'
import { usePlatform } from '../context/PlatformContext'
import { getUnit, money, productAvailable, products, resolveProduct } from '../data/catalog'
import { campaignFor } from '../data/marketing'
import { channelPath, useChannel } from '../hooks/useChannel'

export function Cardapio() {
  const channel = useChannel()
  const { unitId, stockOf } = usePlatform()
  const [category, setCategory] = useState('Todos')
  const unit = unitId ? getUnit(unitId) : undefined
  const campaign = campaignFor(unit)

  const all = useMemo(() => {
    if (!unit) return []
    return products
      .map((product) => resolveProduct(product.id, unit.id)!)
      .filter((product) => unit.productIds.includes(product.id))
  }, [unit])

  const list = category === 'Todos' ? all : all.filter((item) => item.category === category)
  const categories = ['Todos', ...new Set(all.map((item) => item.category))]

  return (
    <NeedUnit>
      <section className="stack">
        <header className="page-head">
          <p className="eyebrow">
            <MapPin size={13} /> {unit?.city} · {unit?.name}
          </p>
          <h1>{unit?.seasonalEnabled ? 'Cardápio com São João' : 'O que a casa faz hoje'}</h1>
          <p>{unit?.note}</p>
          <Link className="text-link" to={channelPath(channel, '/unidades')}>
            Trocar unidade
          </Link>
        </header>
        {unit && (
          <p className="campaign-note">
            <span className="eyebrow">{campaign.kicker}</span>
            {campaign.title}. {campaign.text}
          </p>
        )}
        <div className="filters" role="tablist" aria-label="Categorias">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={item === category ? 'chip on' : 'chip'}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <ul className="product-list">
          {list.map((product) => {
            const stock = stockOf(product.id, unit?.id)
            const available = unit ? productAvailable(product, unit, stock) : false
            return (
              <li key={product.id}>
                <Link className={`product-row ${available ? '' : 'off'}`} to={channelPath(channel, `/produto/${product.id}`)}>
                  <IconTile art={product.art} />
                  <div>
                    <strong>{product.name}</strong>
                    <p>{product.description}</p>
                    <span>
                      {money(product.price)}
                      {product.seasonal && <b className="tag">São João</b>}
                      {product.id === campaign.productId && !product.seasonal && <b className="tag">Campanha</b>}
                      {!available && <b className="tag mute">Indisponível</b>}
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </NeedUnit>
  )
}
