import { Award, ChevronRight, Clock3, MapPin, Sparkles, UtensilsCrossed } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CampaignBanner } from '../components/CampaignBanner'
import { IconTile } from '../components/IconTile'
import { usePlatform } from '../context/PlatformContext'
import { getUnit, money, products, resolveProduct } from '../data/catalog'
import { brandLine, campaignFor, loyaltyPitch, promises } from '../data/marketing'
import { channelPath, useChannel } from '../hooks/useChannel'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function HomeApp() {
  const channel = useChannel()
  const { unitId, orders, loyalty } = usePlatform()
  const unit = unitId ? getUnit(unitId) : undefined
  const campaign = campaignFor(unit)
  const open = orders.find(
    (order) => ['recebido', 'em_preparo', 'pronto'].includes(order.status) && order.channel === channel,
  )
  const featuredIds = (() => {
    const ids = unit
      ? [...unit.productIds]
      : ['combo-sertanejo', 'tapioca-coalho', 'cuscuz-sol', 'suco-caja', 'cafe-passado', 'bolo-macaxeira']
    if (campaign.productId && ids.includes(campaign.productId)) {
      return [campaign.productId, ...ids.filter((id) => id !== campaign.productId)]
    }
    return ids
  })()
  const featured = featuredIds
    .slice(0, channel === 'site' ? 6 : 3)
    .map((id) => (unit ? resolveProduct(id, unit.id) : products.find((item) => item.id === id)))
    .filter(Boolean)

  return (
    <section className="stack reveal">
      <div className="app-hero">
        <p className="eyebrow">
          <Sparkles size={13} /> {greeting()}. {brandLine}
        </p>
        <h1>
          {unit
            ? `${unit.city}: o sertão no seu horário.`
            : channel === 'site'
              ? 'Peça o Nordeste no computador. Retire quente na loja.'
              : 'Retire na unidade, no seu horário.'}
        </h1>
        <p>
          {unit
            ? `${unit.note} ${unit.hours}.`
            : 'Escolha a loja, veja só o que ela tem hoje e busque no ponto. Pagamento no gateway, vapor na retirada.'}
        </p>
        <Link className="btn" to={unit ? channelPath(channel, '/cardapio') : channelPath(channel, '/unidades')}>
          {unit ? <UtensilsCrossed size={18} /> : <MapPin size={18} />}
          {unit ? 'Pedir agora' : 'Escolher unidade'}
          <ChevronRight size={18} />
        </Link>
      </div>

      {open && (
        <Link className="panel pulse-border" to={channelPath(channel, `/pedido/${open.id}`)}>
          <p className="eyebrow">Pedido em andamento</p>
          <strong>{open.id}</strong>
          <span className="meta">
            <Clock3 size={14} /> Acompanhe a retirada
          </span>
        </Link>
      )}

      <CampaignBanner campaign={campaign} />

      <ul className="promises">
        {promises.map((item) => (
          <li key={item.title}>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </li>
        ))}
      </ul>

      <div className="quick-grid">
        <Link className="quick-card" to={channelPath(channel, '/unidades')}>
          <MapPin size={18} />
          Unidades
        </Link>
        <Link className="quick-card" to={channelPath(channel, '/cardapio')}>
          <UtensilsCrossed size={18} />
          Cardápio
        </Link>
        <Link className="quick-card" to={channelPath(channel, '/fidelidade')}>
          <Award size={18} />
          {loyalty.consented ? `${loyalty.points} pts` : 'Programa Raízes'}
        </Link>
      </div>

      <section className="stack">
        <header className="page-head">
          <p className="eyebrow">Destaques da casa</p>
          <h2>{unit?.seasonalEnabled ? 'O São João que cabe na sacola' : 'Para começar o dia'}</h2>
        </header>
        <ul className="product-list home-featured">
          {featured.map((product) =>
            product ? (
              <li key={product.id}>
                <Link
                  className="product-row"
                  to={unit ? channelPath(channel, `/produto/${product.id}`) : channelPath(channel, '/unidades')}
                >
                  <IconTile art={product.art} />
                  <div>
                    <strong>{product.name}</strong>
                    <p>{product.description}</p>
                    <span>
                      {money(product.price)}
                      {product.id === campaign.productId && <b className="tag">Campanha</b>}
                      {product.seasonal && <b className="tag">São João</b>}
                    </span>
                  </div>
                </Link>
              </li>
            ) : null,
          )}
        </ul>
      </section>

      <Link className="loyalty-invite" to={channelPath(channel, '/fidelidade')}>
        <p className="eyebrow">{loyaltyPitch.kicker}</p>
        {loyalty.consented ? (
          <>
            <h2>
              {loyalty.points >= 300
                ? 'Casa cheia. O desconto já é de 12%.'
                : loyalty.points >= 120
                  ? `Frequentador. Faltam ${300 - loyalty.points} pts para a casa cheia.`
                  : `Raiz nova. Faltam ${120 - loyalty.points} pts para frequentador.`}
            </h2>
            <p>Cada retirada soma ponto. Campanhas da rede entram primeiro para quem está no programa.</p>
            <em>
              Ver meus pontos <ChevronRight size={16} />
            </em>
          </>
        ) : (
          <>
            <h2>{loyaltyPitch.title}</h2>
            <p>{loyaltyPitch.text}</p>
            <em>
              Entrar no programa <ChevronRight size={16} />
            </em>
          </>
        )}
      </Link>
    </section>
  )
}
