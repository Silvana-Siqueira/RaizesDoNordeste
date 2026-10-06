import { ChefHat, Clock3, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { units } from '../data/catalog'
import { unitPitch } from '../data/marketing'
import { channelPath, useChannel } from '../hooks/useChannel'

export function Unidades() {
  const { setUnit, unitId } = usePlatform()
  const channel = useChannel()
  const navigate = useNavigate()

  return (
    <section className="stack">
      <header className="page-head">
        <p className="eyebrow">Três casas, uma marca</p>
        <h1>Escolha onde o vapor sobe</h1>
        <p>Cada loja tem cozinha, estoque e campanha próprios. O sabor da rede permanece.</p>
      </header>
      <ul className="cards">
        {units.map((unit) => (
          <li key={unit.id}>
            <button
              type="button"
              className={`unit-card ${unitId === unit.id ? 'selected' : ''}`}
              onClick={() => {
                setUnit(unit.id)
                navigate(channelPath(channel, '/cardapio'))
              }}
            >
              <strong>
                {unit.city} · {unit.name}
              </strong>
              <span className="meta">
                <MapPin size={14} /> {unit.address}
              </span>
              <span className="meta">
                <Clock3 size={14} /> {unit.hours}
              </span>
              <span className="meta">
                <ChefHat size={14} /> {unit.kitchen === 'completa' ? 'Cozinha completa' : 'Formato reduzido'}
              </span>
              <p>{unitPitch[unit.id] ?? unit.note}</p>
              {unit.seasonalEnabled && <b className="tag">Campanha São João</b>}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
