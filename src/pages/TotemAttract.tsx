import { ChevronRight, Touchpad } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'

export function TotemAttract() {
  const { setUnit, unitId } = usePlatform()
  const navigate = useNavigate()

  useEffect(() => {
    if (!unitId) setUnit('recife-casa-forte')
  }, [unitId, setUnit])

  return (
    <section className="attract">
      <span className="channel-icon lg">
        <Touchpad size={32} strokeWidth={1.5} />
      </span>
      <p className="eyebrow">Toque para pedir</p>
      <h1>O cuscuz já está no vapor.</h1>
      <p>Cardápio desta unidade, pagamento no gateway e retirada no balcão. Tradição no ponto.</p>
      <button className="btn xl" type="button" onClick={() => navigate('/totem/cardapio')}>
        Começar pedido
        <ChevronRight size={22} />
      </button>
    </section>
  )
}
