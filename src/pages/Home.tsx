import { Building2, ChevronRight, Laptop, Smartphone, Touchpad, UtensilsCrossed } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '../components/Logo'

const channels = [
  {
    to: '/app',
    kicker: 'Celular',
    title: 'Aplicativo',
    text: 'Pedidos antecipados, retirada rápida e fidelização com consentimento.',
    icon: Smartphone,
  },
  {
    to: '/site',
    kicker: 'Computador',
    title: 'Site',
    text: 'A mesma jornada no notebook ou no desktop: cardápio da loja, pagamento e retirada.',
    icon: Laptop,
  },
  {
    to: '/totem',
    kicker: 'Loja',
    title: 'Totem',
    text: 'Autoatendimento com alvos de toque grandes e cardápio da unidade.',
    icon: Touchpad,
  },
  {
    to: '/balcao',
    kicker: 'Operação',
    title: 'Balcão',
    text: 'Fila da cozinha, status, cancelamentos e descontos com auditoria.',
    icon: UtensilsCrossed,
  },
  {
    to: '/matriz',
    kicker: 'Franquia',
    title: 'Matriz',
    text: 'Painel da franquia, com login, vendas por unidade e auditoria.',
    icon: Building2,
  },
]

export function Home() {
  return (
    <div className="cover">
      <header className="cover-top">
        <Logo light stacked />
        <p className="eyebrow">Rede de lanchonetes · 2026</p>
        <h1>O Nordeste no seu horário.</h1>
        <p className="lead">
          Peça no celular, no computador ou no totem. Retire na loja. Cinco canais, uma marca — sem
          misturar dado pessoal em relatório.
        </p>
      </header>
      <div className="channel-grid">
        {channels.map((item, index) => {
          const Icon = item.icon
          return (
            <Link key={item.to} to={item.to} className="channel-card" style={{ animationDelay: `${0.08 * index}s` }}>
              <span className="channel-icon">
                <Icon size={22} strokeWidth={1.6} />
              </span>
              <span>{item.kicker}</span>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
              <em>
                Abrir <ChevronRight size={16} />
              </em>
            </Link>
          )
        })}
      </div>
      <footer className="cover-foot">Protótipo de front-end · Projeto Multidisciplinar</footer>
    </div>
  )
}
